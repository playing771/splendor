import { Game } from '.';
import { ICardShape } from '../../interfaces/card';
import { EDevDeckLevel } from '../../interfaces/devDeck';
import { TGameTableConfig } from '../../interfaces/gameTable';
import { IPlayerConfig } from '../../interfaces/player';
import { ETokenColor } from '../../interfaces/token';
import { CARDS_MAP_BY_LEVEL } from '../../static/cards';
import { EGameBasicState } from './createGameSMDefinition';
import { EPlayerAction, EPLayerState } from './createPlayerSMDefinition';

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

const TABLE_CONFIG: TGameTableConfig<ICardShape> = {
  initialCardsOnTableCount: 3,
  [EDevDeckLevel.First]: [...CARDS_MAP_BY_LEVEL[EDevDeckLevel.First]],
  [EDevDeckLevel.Second]: [...CARDS_MAP_BY_LEVEL[EDevDeckLevel.Second]],
  [EDevDeckLevel.Third]: [...CARDS_MAP_BY_LEVEL[EDevDeckLevel.Third]],
  [ETokenColor.Blue]: 5,
  [ETokenColor.Black]: 5,
  [ETokenColor.Gold]: 5,
  [ETokenColor.Green]: 5,
  [ETokenColor.Red]: 5,
  [ETokenColor.White]: 5,
};

const GAME_CONFIG = {
  players: PLAYERS,
  tableConfig: TABLE_CONFIG,
};

describe('Game functionality', () => {
  it.each([...PLAYERS])('initializes game with players without tokens', (player) => {
    const game = new Game(GAME_CONFIG);

    expect(game.showPlayerTokens(player.id)).toEqual({
      count: 0, tokens: {
        [ETokenColor.Blue]: 0,
        [ETokenColor.Red]: 0,
        [ETokenColor.Green]: 0,
        [ETokenColor.Black]: 0,
        [ETokenColor.Gold]: 0,
        [ETokenColor.White]: 0,
      }
    })
  })

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

    game.giveTokensToPlayer(FIRST_PLAYER.id, {
      [ETokenColor.Blue]: 1,
      [ETokenColor.Red]: 1,
      [ETokenColor.Black]: 1
    });

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
    const game = new Game({
      ...GAME_CONFIG, players: [{
        name: 'max', id: FIRST_PLAYER.id, tokens: {
          [ETokenColor.Blue]: 5,
          [ETokenColor.Black]: 3,
          [ETokenColor.Green]: 3
        }
      }]
    });
    game.move();

    console.log('game',game.getPlayer(FIRST_PLAYER.id));
    

    const cardBought = game.buyCardByPlayer(FIRST_PLAYER.id, EDevDeckLevel.First, 0);
    console.log(game.getPlayer(FIRST_PLAYER.id).cardsBought);
    // expect(game.getPlayer(FIRST_PLAYER.id).cardsBought[0].id).toBe(cardBought.id);
  })
});
