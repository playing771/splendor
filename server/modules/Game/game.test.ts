import { Game } from '.';
import { ICardShape } from '../../interfaces/card';
import { EDevDeckLevel } from '../../interfaces/devDeck';
import { TGameTableConfig } from '../../interfaces/gameTable';
import { IPlayerConfig } from '../../interfaces/player';
import { ETokenColor } from '../../interfaces/token';
import { populateCardsByLevelFromPool } from '../DevDeck/populateCardByLevelFromPool';
import { EGameBasicState } from './createGameSMDefinition';
import { EPlayerAction, EPLayerState } from './createPlayerSMDefinition';
import { MOCKED_CARDS_POOL } from './mockedCards';

const PLAYERS: IPlayerConfig[] = [
  {
    id: 'player_1',
    name: 'Maxim',
  },
  {
    id: 'player_2',
    name: 'Evgenii',
  },
];

const FIRST_PLAYER = PLAYERS[0];

const MOCKED_CARDS_POOL_BY_LVL =
  populateCardsByLevelFromPool(MOCKED_CARDS_POOL);

const TABLE_CONFIG: TGameTableConfig<ICardShape> = {
  initialCardsOnTableCount: 3,
  willShuffleDecks: false,
  [ETokenColor.Blue]: 5,
  [ETokenColor.Black]: 5,
  [ETokenColor.Gold]: 5,
  [ETokenColor.Green]: 5,
  [ETokenColor.Red]: 5,
  [ETokenColor.White]: 5,
  ...MOCKED_CARDS_POOL_BY_LVL,
};

const GAME_CONFIG = {
  players: PLAYERS,
  tableConfig: TABLE_CONFIG,
};

describe('Game functionality', () => {
  it.each([...PLAYERS])(
    'initializes game with players without tokens',
    (player) => {
      const game = new Game(GAME_CONFIG);

      expect(game.showPlayerTokens(player.id)).toEqual({
        count: 0,
        tokens: {
          [ETokenColor.Blue]: 0,
          [ETokenColor.Red]: 0,
          [ETokenColor.Green]: 0,
          [ETokenColor.Black]: 0,
          [ETokenColor.Gold]: 0,
          [ETokenColor.White]: 0,
        },
      });
    }
  );

  it('can change game state', () => {
    const game = new Game(GAME_CONFIG);

    expect(game.getState()).toBe(EGameBasicState.RoundStarted);

    game.move();
    expect(game.getState()).toBe(FIRST_PLAYER.id);

    game.move();
    expect(game.getState()).toBe(PLAYERS[1].id);

    game.move();
    expect(game.getState()).toBe(EGameBasicState.RoundStarted);

    game.move();
    expect(game.getState()).toBe(FIRST_PLAYER.id);
  });

  it('can change active players state', () => {
    const game = new Game(GAME_CONFIG);

    expect(game.getPlayerState(FIRST_PLAYER.id)).toBe(EPLayerState.Idle);
    expect(game.getPlayerState(PLAYERS[1].id)).toBe(EPLayerState.Idle);

    game.move();
    expect(game.getPlayerState(FIRST_PLAYER.id)).toBe(EPLayerState.Active);
    expect(game.getPlayerState(PLAYERS[1].id)).toBe(EPLayerState.Idle);

    game.move();
    expect(game.getPlayerState(FIRST_PLAYER.id)).toBe(EPLayerState.Idle);
    expect(game.getPlayerState(PLAYERS[1].id)).toBe(EPLayerState.Active);

    game.move();
    expect(game.getPlayerState(FIRST_PLAYER.id)).toBe(EPLayerState.Idle);
    expect(game.getPlayerState(PLAYERS[1].id)).toBe(EPLayerState.Idle);

    game.move();
    expect(game.getPlayerState(FIRST_PLAYER.id)).toBe(EPLayerState.Active);
    expect(game.getPlayerState(PLAYERS[1].id)).toBe(EPLayerState.Idle);
  });

  it('can show player tokens', () => {
    const game = new Game(GAME_CONFIG);
    game.move();

    expect(game.showPlayerTokens(FIRST_PLAYER.id)).toHaveProperty('count');
    expect(game.showPlayerTokens(FIRST_PLAYER.id)).toHaveProperty('tokens');
  });

  it('can give tokens to player', () => {
    const game = new Game(GAME_CONFIG);
    game.move();

    expect(game.getPlayer(FIRST_PLAYER.id).tokensCount).toBe(0);

    const TOKENS_TO_TAKE = {
      [ETokenColor.Blue]: 1,
      [ETokenColor.Red]: 1,
      [ETokenColor.Black]: 1,
    };

    game.giveTokensToPlayer(FIRST_PLAYER.id, TOKENS_TO_TAKE);

    expect(game.table.tokens[ETokenColor.Blue]).toBe(
      TABLE_CONFIG[ETokenColor.Blue] - TOKENS_TO_TAKE[ETokenColor.Blue]
    );
    expect(game.table.tokens[ETokenColor.Red]).toBe(
      TABLE_CONFIG[ETokenColor.Red] - TOKENS_TO_TAKE[ETokenColor.Red]
    );
    expect(game.table.tokens[ETokenColor.Black]).toBe(
      TABLE_CONFIG[ETokenColor.Black] - TOKENS_TO_TAKE[ETokenColor.Black]
    );

    expect(game.getPlayer(FIRST_PLAYER.id).tokensCount).toBe(3);
    expect(game.getPlayer(FIRST_PLAYER.id).tokens).toEqual({
      [ETokenColor.Blue]: 1,
      [ETokenColor.Red]: 1,
      [ETokenColor.Black]: 1,
      [ETokenColor.Green]: 0,
      [ETokenColor.Gold]: 0,
      [ETokenColor.White]: 0,
    });
  });

  it('let player buy a card', () => {
    const PLAYER_INITIAL_TOKENS = {
      [ETokenColor.Blue]: 5,
      [ETokenColor.Black]: 3,
      [ETokenColor.Green]: 3,
      [ETokenColor.Gold]: 0,
      [ETokenColor.Red]: 0,
      [ETokenColor.White]: 0,
    };

    const game = new Game({
      ...GAME_CONFIG,
      players: [
        {
          name: 'max',
          id: FIRST_PLAYER.id,
          tokens: PLAYER_INITIAL_TOKENS,
        },
      ],
    });
    game.move();

    const CARD_TO_TAKE =
      MOCKED_CARDS_POOL_BY_LVL[EDevDeckLevel.First].slice(-1)[0];

    game.buyCardByPlayer(FIRST_PLAYER.id, EDevDeckLevel.First, 0);

    expect(
      game.getPlayer(FIRST_PLAYER.id).cardsBought[CARD_TO_TAKE.color][0].id
    ).toBe(CARD_TO_TAKE.id);
    expect(game.table.First.cards.length === 4);
    expect(game.getPlayer(FIRST_PLAYER.id).tokens).toEqual({
      [ETokenColor.Black]:
        PLAYER_INITIAL_TOKENS[ETokenColor.Black] -
        (CARD_TO_TAKE.cost[ETokenColor.Black] || 0),
      [ETokenColor.Blue]:
        PLAYER_INITIAL_TOKENS[ETokenColor.Blue] -
        (CARD_TO_TAKE.cost[ETokenColor.Blue] || 0),
      [ETokenColor.Gold]:
        PLAYER_INITIAL_TOKENS[ETokenColor.Gold] -
        (CARD_TO_TAKE.cost[ETokenColor.Gold] || 0),
      [ETokenColor.Green]:
        PLAYER_INITIAL_TOKENS[ETokenColor.Green] -
        (CARD_TO_TAKE.cost[ETokenColor.Green] || 0),
      [ETokenColor.Red]:
        PLAYER_INITIAL_TOKENS[ETokenColor.Red] -
        (CARD_TO_TAKE.cost[ETokenColor.Red] || 0),
      [ETokenColor.White]:
        PLAYER_INITIAL_TOKENS[ETokenColor.White] -
        (CARD_TO_TAKE.cost[ETokenColor.White] || 0),
    });
  });

  it('can show available actions for player', () => {
    const game = new Game(GAME_CONFIG);
    game.move();

    expect(game.getPlayerAvailableActions(FIRST_PLAYER.id)).toEqual([
      EPlayerAction.TakeTokens,
      EPlayerAction.TakeTokensOverLimit,
      EPlayerAction.BuyCard,
      EPlayerAction.EndTurn,
    ]);
    expect(game.getPlayerAvailableActions(PLAYERS[1].id)).toHaveLength(0);

    console.log(game.getPlayerAvailableActions(FIRST_PLAYER.id));
    
  });
});
