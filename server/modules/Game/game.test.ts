import { Game } from '.';
import { ICardShape } from '../../../interfaces/card';
import { EDeckLevel } from '../../../interfaces/devDeck';
import {
  EPlayerAction,
  EPLayerState,
  IGameSetup,
} from '../../../interfaces/game';
import { TGameTableConfig } from '../../../interfaces/gameTable';
import { IPlayerConfig } from '../../../interfaces/player';
import { EGemColor } from '../../../interfaces/gem';
import { populateCardsByLevelFromPool } from '../DevDeck/populateCardByLevelFromPool';
import { MOCKED_CARDS_POOL } from './mockedCards';
import {
  SEVERAL_GEMS_TO_TAKE_IN_STOCK_LIMIT,
  PLAYER_CARDS_HOLDED_MAX,
  PLAYER_GEMS_MAX,
  TAKE_GEM_LIMIT,
  TAKE_GEM_LIMIT_SAME_COLOR,
} from '../../../gameRules';
import { EGameBasicState } from './createGameSMDefinition';
import { INobleShape } from '../../../interfaces/noble';

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
const SECOND_PLAYER = PLAYERS[1];

const MOCKED_GAME_SETUP = new Map<number, IGameSetup>();
MOCKED_GAME_SETUP.set(1, { gems: 0, nobles: 0 });
MOCKED_GAME_SETUP.set(2, { gems: 0, nobles: 0 });
MOCKED_GAME_SETUP.set(3, { gems: 0, nobles: 0 });

const MOCKED_CARDS_POOL_BY_LVL =
  populateCardsByLevelFromPool(MOCKED_CARDS_POOL);

const MOCKED_NOBLES: INobleShape[] = [
  {
    score: 3,
    requirements: { [EGemColor.Black]: 2, [EGemColor.Red]: 2 },
    id: 'N',
  },
  {
    score: 3,
    requirements: { [EGemColor.White]: 2, [EGemColor.Green]: 1 },
    id: 'NN',
  },
];

const TABLE_CONFIG = {
  initialCardsOnTableCount: 3,
  willShuffleDecks: false,
  gems: {
    [EGemColor.Blue]: 5,
    [EGemColor.Black]: 5,
    [EGemColor.Gold]: 5,
    [EGemColor.Green]: 5,
    [EGemColor.Red]: 5,
    [EGemColor.White]: 5,
  },
  decks: {
    ...MOCKED_CARDS_POOL_BY_LVL,
  },
  noblesInPlay: 3,
  nobles: MOCKED_NOBLES,
} as const;

const GAME_CONFIG = {
  players: PLAYERS,
  tableConfig: TABLE_CONFIG,
  hasAutostart: true,
  setup: MOCKED_GAME_SETUP,
};

describe('Game functionality', () => {
  it.each([...PLAYERS])(
    'initializes game with players without gems',
    (player) => {
      const game = new Game(GAME_CONFIG);

      expect(game.showPlayerGems(player.id)).toEqual({
        count: 0,
        gems: {
          [EGemColor.Blue]: 0,
          [EGemColor.Red]: 0,
          [EGemColor.Green]: 0,
          [EGemColor.Black]: 0,
          [EGemColor.Gold]: 0,
          [EGemColor.White]: 0,
        },
      });
    }
  );

  it('has setup', () => {
    const newGameSetup = new Map<number, IGameSetup>();
    newGameSetup.set(2, {
      gems: 10,
      nobles: 1
    })

    const game = new Game({
      players: GAME_CONFIG.players,
      tableConfig: {
        initialCardsOnTableCount: 4,
        nobles: MOCKED_NOBLES,
        decks: TABLE_CONFIG.decks,
      },
      hasAutostart: true,
      setup: newGameSetup
    });
    
    expect(game.table.gems).toEqual({
      [EGemColor.Gold]: 5,
      [EGemColor.Blue]: 10,
      [EGemColor.Red]: 10,
      [EGemColor.Black]: 10,
      [EGemColor.Green]: 10,
      [EGemColor.White]: 10,
    })
    expect(game.table.nobles).toHaveLength(1);
    expect(game.table.First.cards).toHaveLength(4);
    expect(game.table.Second.cards).toHaveLength(4);
    expect(game.table.Third.cards).toHaveLength(4);
  });

  it('can change game state', () => {
    const game = new Game(GAME_CONFIG);

    expect(game.getState()).toBe(FIRST_PLAYER.id);

    game.dispatch(FIRST_PLAYER.id, EPlayerAction.EndTurn);
    expect(game.getState()).toBe(SECOND_PLAYER.id);

    game.dispatch(SECOND_PLAYER.id, EPlayerAction.EndTurn);
    expect(game.getState()).toBe(FIRST_PLAYER.id);
  });

  it('will throw an Error if player cant change a state', () => {
    const game = new Game(GAME_CONFIG);

    expect(() => {
      game.dispatch(SECOND_PLAYER.id, EPlayerAction.EndTurn);
    }).toThrow();
  });

  it('can change active players state', () => {
    const game = new Game(GAME_CONFIG);

    expect(game.getPlayerState(FIRST_PLAYER.id)).toBe(EPLayerState.Active);
    expect(game.getPlayerState(SECOND_PLAYER.id)).toBe(EPLayerState.Idle);

    game.dispatch(FIRST_PLAYER.id, EPlayerAction.EndTurn);

    expect(game.getPlayerState(FIRST_PLAYER.id)).toBe(EPLayerState.Idle);
    expect(game.getPlayerState(SECOND_PLAYER.id)).toBe(EPLayerState.Active);

    game.dispatch(SECOND_PLAYER.id, EPlayerAction.EndTurn);

    expect(game.getPlayerState(FIRST_PLAYER.id)).toBe(EPLayerState.Active);
    expect(game.getPlayerState(SECOND_PLAYER.id)).toBe(EPLayerState.Idle);

    game.dispatch(FIRST_PLAYER.id, EPlayerAction.EndTurn);

    expect(game.getPlayerState(FIRST_PLAYER.id)).toBe(EPLayerState.Idle);
    expect(game.getPlayerState(SECOND_PLAYER.id)).toBe(EPLayerState.Active);

    game.dispatch(SECOND_PLAYER.id, EPlayerAction.EndTurn);

    expect(game.getPlayerState(FIRST_PLAYER.id)).toBe(EPLayerState.Active);
    expect(game.getPlayerState(SECOND_PLAYER.id)).toBe(EPLayerState.Idle);
  });

  it('can show player gems', () => {
    const game = new Game(GAME_CONFIG);

    expect(game.showPlayerGems(FIRST_PLAYER.id)).toHaveProperty('count');
    expect(game.showPlayerGems(FIRST_PLAYER.id)).toHaveProperty('gems');
  });

  it('can give gems to player', () => {
    const game = new Game(GAME_CONFIG);

    expect(game.getPlayer(FIRST_PLAYER.id).gemsCount).toBe(0);

    const GEMS_TO_TAKE = {
      [EGemColor.Blue]: 1,
      [EGemColor.Red]: 1,
      [EGemColor.Black]: 1,
    };

    game.dispatch(FIRST_PLAYER.id, EPlayerAction.TakeGems, GEMS_TO_TAKE);

    expect(game.table.gems[EGemColor.Blue]).toBe(
      TABLE_CONFIG.gems[EGemColor.Blue] - GEMS_TO_TAKE[EGemColor.Blue]
    );
    expect(game.table.gems[EGemColor.Red]).toBe(
      TABLE_CONFIG.gems[EGemColor.Red] - GEMS_TO_TAKE[EGemColor.Red]
    );
    expect(game.table.gems[EGemColor.Black]).toBe(
      TABLE_CONFIG.gems[EGemColor.Black] - GEMS_TO_TAKE[EGemColor.Black]
    );

    expect(game.getPlayer(FIRST_PLAYER.id).gemsCount).toBe(3);
    expect(game.getPlayer(FIRST_PLAYER.id).gems).toEqual({
      [EGemColor.Blue]: 1,
      [EGemColor.Red]: 1,
      [EGemColor.Black]: 1,
      [EGemColor.Green]: 0,
      [EGemColor.Gold]: 0,
      [EGemColor.White]: 0,
    });
    expect(game.getPlayerState(FIRST_PLAYER.id)).toBe(EPLayerState.OutOfAction);
  });

  it(`will throw an error if player takes more than ${TAKE_GEM_LIMIT} limit`, () => {
    const game = new Game(GAME_CONFIG);

    expect(() =>
      game.dispatch(FIRST_PLAYER.id, EPlayerAction.TakeGems, {
        [EGemColor.Blue]: 1,
        [EGemColor.Red]: 1,
        [EGemColor.Black]: 1,
        [EGemColor.Green]: 1,
      })
    ).toThrow();
  });

  it(`will throw an error if player takes ${TAKE_GEM_LIMIT_SAME_COLOR} of gems if stock is less than ${SEVERAL_GEMS_TO_TAKE_IN_STOCK_LIMIT}`, () => {
    const game = new Game({
      ...GAME_CONFIG,
      tableConfig: {
        ...GAME_CONFIG.tableConfig,
        gems: { [EGemColor.Blue]: 3 },
      },
    });

    expect(() =>
      game.dispatch(FIRST_PLAYER.id, EPlayerAction.TakeGems, {
        [EGemColor.Blue]: TAKE_GEM_LIMIT_SAME_COLOR,
      })
    ).toThrow();
  });

  it(`will throw an error if a player takes 2 same color gems and any number of other gems`, () => {
    const game = new Game(GAME_CONFIG);

    expect(() =>
      game.dispatch(FIRST_PLAYER.id, EPlayerAction.TakeGems, {
        [EGemColor.Blue]: 2,
        [EGemColor.Red]: 1,
      })
    ).toThrow();
    expect(() =>
      game.dispatch(FIRST_PLAYER.id, EPlayerAction.TakeGems, {
        [EGemColor.Blue]: 1,
        [EGemColor.Red]: 2,
      })
    ).toThrow();
  });

  it(`will throw if a player tries to buy any number of ${EGemColor.Gold}`, () => {
    const game = new Game(GAME_CONFIG);

    expect(() =>
      game.dispatch(FIRST_PLAYER.id, EPlayerAction.TakeGems, {
        [EGemColor.Gold]: 1,
      })
    ).toThrow();
  });

  it(`will make player state ${EPLayerState.TooManyGems} if gems exceeds ${PLAYER_GEMS_MAX} limit in the end of turn`, () => {
    const game = new Game({
      ...GAME_CONFIG,
      players: [
        {
          ...FIRST_PLAYER,
          gems: {
            [EGemColor.Red]: 9,
          },
        },
      ],
    });

    game.dispatch(FIRST_PLAYER.id, EPlayerAction.TakeGems, {
      [EGemColor.Blue]: 2,
    });

    expect(game.getActivePlayerState()).toBe(EPLayerState.TooManyGems);
  });

  it('can let player to return gems', () => {
    const game = new Game({
      ...GAME_CONFIG,
      players: [
        {
          ...FIRST_PLAYER,
          gems: {
            [EGemColor.Red]: 10,
          },
        },
      ],
    });

    game.dispatch(FIRST_PLAYER.id, EPlayerAction.TakeGems, {
      [EGemColor.Black]: 2,
    });
    game.dispatch(FIRST_PLAYER.id, EPlayerAction.ReturnGems, {
      [EGemColor.Red]: 1,
    });

    expect(game.getActivePlayerState()).toBe(EPLayerState.TooManyGems);
    game.dispatch(FIRST_PLAYER.id, EPlayerAction.ReturnGems, {
      [EGemColor.Black]: 1,
    });
    expect(game.getActivePlayerState()).toBe(EPLayerState.OutOfAction);
    expect(game.table.gems[EGemColor.Red]).toBe(6);
    expect(game.table.gems[EGemColor.Black]).toBe(4);
    expect(game.getActivePlayer().gems[EGemColor.Red]).toBe(9);
    expect(game.getActivePlayer().gems[EGemColor.Black]).toBe(1);
  });

  it('let player to buy a card', () => {
    const PLAYER_INITIAL_GEMS = {
      [EGemColor.Blue]: 5,
      [EGemColor.Black]: 3,
      [EGemColor.Green]: 3,
      [EGemColor.Gold]: 0,
      [EGemColor.Red]: 0,
      [EGemColor.White]: 0,
    };

    const game = new Game({
      ...GAME_CONFIG,
      players: [
        {
          name: 'max',
          id: FIRST_PLAYER.id,
          gems: PLAYER_INITIAL_GEMS,
        },
      ],
    });

    const CARD_TO_TAKE =
      MOCKED_CARDS_POOL_BY_LVL[EDeckLevel.First].slice(-1)[0];

    game.dispatch(
      FIRST_PLAYER.id,
      EPlayerAction.BuyCard,
      game.table[EDeckLevel.First].cards[0].id
    );

    expect(
      game.getPlayer(FIRST_PLAYER.id).cardsBought[CARD_TO_TAKE.color][0].id
    ).toBe(CARD_TO_TAKE.id);
    expect(game.table.First.cards.length === 4);
    expect(game.getPlayer(FIRST_PLAYER.id).gems).toEqual({
      [EGemColor.Black]:
        PLAYER_INITIAL_GEMS[EGemColor.Black] -
        (CARD_TO_TAKE.cost[EGemColor.Black] || 0),
      [EGemColor.Blue]:
        PLAYER_INITIAL_GEMS[EGemColor.Blue] -
        (CARD_TO_TAKE.cost[EGemColor.Blue] || 0),
      [EGemColor.Gold]:
        PLAYER_INITIAL_GEMS[EGemColor.Gold] -
        (CARD_TO_TAKE.cost[EGemColor.Gold] || 0),
      [EGemColor.Green]:
        PLAYER_INITIAL_GEMS[EGemColor.Green] -
        (CARD_TO_TAKE.cost[EGemColor.Green] || 0),
      [EGemColor.Red]:
        PLAYER_INITIAL_GEMS[EGemColor.Red] -
        (CARD_TO_TAKE.cost[EGemColor.Red] || 0),
      [EGemColor.White]:
        PLAYER_INITIAL_GEMS[EGemColor.White] -
        (CARD_TO_TAKE.cost[EGemColor.White] || 0),
    });
    expect(game.table.gems).toEqual({
      [EGemColor.Black]:
        GAME_CONFIG.tableConfig.gems[EGemColor.Black] +
        (CARD_TO_TAKE.cost[EGemColor.Black] || 0),
      [EGemColor.Blue]:
        GAME_CONFIG.tableConfig.gems[EGemColor.Blue] +
        (CARD_TO_TAKE.cost[EGemColor.Blue] || 0),
      [EGemColor.Gold]:
        GAME_CONFIG.tableConfig.gems[EGemColor.Gold] +
        (CARD_TO_TAKE.cost[EGemColor.Gold] || 0),
      [EGemColor.Green]:
        GAME_CONFIG.tableConfig.gems[EGemColor.Green] +
        (CARD_TO_TAKE.cost[EGemColor.Green] || 0),
      [EGemColor.Red]:
        GAME_CONFIG.tableConfig.gems[EGemColor.Red] +
        (CARD_TO_TAKE.cost[EGemColor.Red] || 0),
      [EGemColor.White]:
        GAME_CONFIG.tableConfig.gems[EGemColor.White] +
        (CARD_TO_TAKE.cost[EGemColor.White] || 0),
    });
    expect(game.getPlayerState(FIRST_PLAYER.id)).toBe(EPLayerState.OutOfAction);
  });

  it('lets use cards resources to pay for a card', () => {
    const PLAYER_INITIAL_GEMS = {
      [EGemColor.Blue]: 1,
      [EGemColor.Black]: 0,
      [EGemColor.Green]: 1,
      [EGemColor.Gold]: 0,
      [EGemColor.Red]: 0,
      [EGemColor.White]: 0,
    };

    const game = new Game({
      ...GAME_CONFIG,
      players: [
        {
          name: 'max',
          id: FIRST_PLAYER.id,
          gems: PLAYER_INITIAL_GEMS,
          cardsBought: {
            [EGemColor.Black]: [
              {
                color: EGemColor.Black,
                cost: {},
                id: 'SOME',
                lvl: EDeckLevel.First,
                score: 0,
              },
            ],
          },
        },
      ],
    });

    game.dispatch(
      FIRST_PLAYER.id,
      EPlayerAction.BuyCard,
      game.table[EDeckLevel.First].cards[0].id
    );
    expect(game.table.gems[EGemColor.Black]).toBe(
      TABLE_CONFIG.gems[EGemColor.Black]
    );
  });

  it('let player to pay gold for cards cost', () => {
    const game = new Game({
      ...GAME_CONFIG,
      players: [
        {
          name: 'max',
          id: FIRST_PLAYER.id,
          gems: {
            [EGemColor.Blue]: 1,
            [EGemColor.Black]: 0,
            [EGemColor.Green]: 0,
            [EGemColor.Gold]: 2,
            [EGemColor.Red]: 0,
            [EGemColor.White]: 0,
          },
        },
      ],
    });

    game.dispatch(FIRST_PLAYER.id, EPlayerAction.BuyCard, 'first_five');

    expect(
      game.getPlayer(FIRST_PLAYER.id).cardsBought[EGemColor.White][0].id
    ).toBe('first_five');
    expect(game.getPlayer(FIRST_PLAYER.id).gems).toEqual({
      [EGemColor.Blue]: 0,
      [EGemColor.Black]: 0,
      [EGemColor.Green]: 0,
      [EGemColor.Gold]: 0,
      [EGemColor.Red]: 0,
      [EGemColor.White]: 0,
    });
    expect(game.table.gems[EGemColor.Gold]).toBe(7);
    expect(game.table.gems[EGemColor.Blue]).toBe(6);
  });

  it('let to buy holded card', () => {
    const game = new Game({
      ...GAME_CONFIG,
      players: [
        {
          name: 'max',
          id: FIRST_PLAYER.id,
          cardsHolded: [
            {
              id: 'HOLDED_CARD',
              color: EGemColor.Black,
              lvl: EDeckLevel.First,
              score: 0,
              cost: {
                [EGemColor.Blue]: 1,
                [EGemColor.Black]: 1,
              },
            },
          ],
          gems: {
            [EGemColor.Blue]: 1,
            [EGemColor.Black]: 1,
          },
        },
      ],
    });

    game.dispatch(FIRST_PLAYER.id, EPlayerAction.BuyHoldedCard, 'HOLDED_CARD');

    expect(
      game.getPlayer(FIRST_PLAYER.id).cardsBought[EGemColor.Black][0].id
    ).toBe('HOLDED_CARD');
    expect(game.getPlayer(FIRST_PLAYER.id).gems).toEqual({
      [EGemColor.Blue]: 0,
      [EGemColor.Black]: 0,
      [EGemColor.Green]: 0,
      [EGemColor.Gold]: 0,
      [EGemColor.Red]: 0,
      [EGemColor.White]: 0,
    });
    expect(game.table.gems[EGemColor.Blue]).toBe(6);
    expect(game.table.gems[EGemColor.Black]).toBe(6);
    expect(game.getPlayer(FIRST_PLAYER.id).cardsHolded).toHaveLength(0);
    expect(game.getActivePlayerState()).toBe(EPLayerState.OutOfAction);
  });

  it('wont change state if a player didnt manage to buy a card', () => {
    const game = new Game(GAME_CONFIG);

    expect(() =>
      game.dispatch(
        FIRST_PLAYER.id,
        EPlayerAction.BuyCard,
        game.table[EDeckLevel.First].cards[0].id
      )
    ).toThrow();

    expect(game.getPlayerState(FIRST_PLAYER.id)).toBe(EPLayerState.Active);
  });

  it('let player hold a card from table', () => {
    const game = new Game(GAME_CONFIG);
    const cardToHold = game.table[EDeckLevel.First].cards[0];
    const newCardFromDeck = game.table[EDeckLevel.First].deck.lookTop();

    game.dispatch(
      FIRST_PLAYER.id,
      EPlayerAction.HoldCardFromTable,
      cardToHold.id
    );

    expect(game.getPlayerState(FIRST_PLAYER.id)).toBe(EPLayerState.OutOfAction);

    expect(game.getPlayer(FIRST_PLAYER.id).cardsHolded[0].id).toBe(
      cardToHold.id
    );
    expect(game.table[EDeckLevel.First].cards[0].id).toBe(newCardFromDeck?.id);
    expect(game.getPlayer(FIRST_PLAYER.id).gems).toEqual({
      [EGemColor.Blue]: 0,
      [EGemColor.Black]: 0,
      [EGemColor.Green]: 0,
      [EGemColor.Gold]: 1,
      [EGemColor.Red]: 0,
      [EGemColor.White]: 0,
    });
  });

  it(`will make player state ${EPLayerState.TooManyGems} if tokens exceeds limit after gold gems taken`, () => {
    const game = new Game({
      ...GAME_CONFIG,
      players: [
        {
          ...GAME_CONFIG.players[0],
          gems: {
            [EGemColor.Blue]: 8,
            [EGemColor.Red]: 2,
          },
        },
      ],
    });

    game.dispatch(
      FIRST_PLAYER.id,
      EPlayerAction.HoldCardFromTable,
      game.table[EDeckLevel.First].cards[0].id
    );

    expect(game.getPlayerState(FIRST_PLAYER.id)).toBe(EPLayerState.TooManyGems);
  });

  it(`will throw an error if player tries to hold more than ${PLAYER_CARDS_HOLDED_MAX} cards`, () => {
    const game = new Game({
      ...GAME_CONFIG,
      players: [
        {
          ...GAME_CONFIG.players[0],
          cardsHolded: [...MOCKED_CARDS_POOL.slice(0, 3)],
        },
      ],
    });

    expect(() =>
      game.dispatch(
        FIRST_PLAYER.id,
        EPlayerAction.HoldCardFromTable,
        game.table[EDeckLevel.First].cards[0].id
      )
    ).toThrow();
  });

  it('let player to hold top card from deck', () => {
    const game = new Game(GAME_CONFIG);

    const cardToHold = game.table[EDeckLevel.First].deck.lookTop();

    game.dispatch(
      FIRST_PLAYER.id,
      EPlayerAction.HoldCardFromDeck,
      EDeckLevel.First
    );

    expect(game.getPlayerState(FIRST_PLAYER.id)).toBe(EPLayerState.OutOfAction);
    expect(game.getPlayer(FIRST_PLAYER.id).cardsHolded[0].id).toBe(
      cardToHold?.id
    );
    expect(game.getPlayer(FIRST_PLAYER.id).gems).toEqual({
      [EGemColor.Blue]: 0,
      [EGemColor.Black]: 0,
      [EGemColor.Green]: 0,
      [EGemColor.Gold]: 1,
      [EGemColor.Red]: 0,
      [EGemColor.White]: 0,
    });
  });

  it(`will throw an error if player tries to hold more than ${PLAYER_CARDS_HOLDED_MAX} cards from deck`, () => {
    const game = new Game({
      ...GAME_CONFIG,
      players: [
        {
          ...GAME_CONFIG.players[0],
          cardsHolded: [...MOCKED_CARDS_POOL.slice(0, 3)],
        },
      ],
    });

    expect(() =>
      game.dispatch(
        FIRST_PLAYER.id,
        EPlayerAction.HoldCardFromDeck,
        EDeckLevel.First
      )
    ).toThrow();
  });

  it('can show available actions for player', () => {
    const game = new Game(GAME_CONFIG);

    expect(game.getPlayerAvailableActions(FIRST_PLAYER.id)).toEqual(
      expect.arrayContaining([
        EPlayerAction.TakeGems,
        // EPlayerAction.TakeGemsOverLimit,
        EPlayerAction.BuyCard,
        EPlayerAction.EndTurn,
        EPlayerAction.BuyHoldedCard,
        EPlayerAction.HoldCardFromTable,
        EPlayerAction.HoldCardFromDeck,
      ])
    );
    expect(game.getPlayerAvailableActions(SECOND_PLAYER.id)).toHaveLength(0);
  });

  it('finds a winner - player with the biggerst score', () => {
    const onGameEndMocked = jest.fn();
    const game = new Game({
      ...GAME_CONFIG,
      onGameEnd: onGameEndMocked,
      players: [
        {
          ...PLAYERS[0],
        },
        {
          ...PLAYERS[1],
          gems: {
            [EGemColor.Gold]: 10,
          },
          cardsBought: {
            [EGemColor.Black]: [
              {
                color: EGemColor.Black,
                id: 'CARD_1',
                score: 14,
                lvl: EDeckLevel.Third,
                cost: {},
              },
            ],
          },
        },
        {
          id: 'PL_3',
          name: 'Player3',
        },
      ],
    });

    game.dispatch(FIRST_PLAYER.id, EPlayerAction.EndTurn);
    game.dispatch(
      PLAYERS[1].id,
      EPlayerAction.BuyCard,
      game.table[EDeckLevel.Second].cards[0].id
    );
    game.dispatch(PLAYERS[1].id, EPlayerAction.EndTurn);
    game.dispatch('PL_3', EPlayerAction.EndTurn);

    expect(game.getState()).toBe(EGameBasicState.GameEnded);
    expect(onGameEndMocked).toBeCalledWith(
      expect.objectContaining({
        winner: PLAYERS[1].id,
        players: [
          { score: 16, id: 'player_2', cardsBoughtCount: 2 },
          { score: 0, id: 'player_1', cardsBoughtCount: 0 },
          { score: 0, id: 'PL_3', cardsBoughtCount: 0 },
        ],
      })
    );
  });

  it('finds a winner between players with equal score by smallest count of bought cards', () => {
    const onGameEndMocked = jest.fn();
    const game = new Game({
      ...GAME_CONFIG,
      onGameEnd: onGameEndMocked,
      players: [
        {
          ...PLAYERS[0],
          cardsBought: {
            [EGemColor.Black]: [
              {
                color: EGemColor.Black,
                id: 'CARD_1',
                score: 10,
                lvl: EDeckLevel.Third,
                cost: {},
              },
              {
                color: EGemColor.Black,
                id: 'CARD_2',
                score: 2,
                lvl: EDeckLevel.Third,
                cost: {},
              },
              {
                color: EGemColor.Black,
                id: 'CARD_3',
                score: 3,
                lvl: EDeckLevel.Third,
                cost: {},
              },
            ],
          },
        },
        {
          ...PLAYERS[1],
          cardsBought: {
            [EGemColor.Black]: [
              {
                color: EGemColor.Black,
                id: 'CARD_4',
                score: 15,
                lvl: EDeckLevel.Third,
                cost: {},
              },
            ],
          },
        },
        {
          id: 'PL_3',
          name: 'Player3',
          cardsBought: {
            [EGemColor.Black]: [
              {
                color: EGemColor.Black,
                id: 'CARD_5',
                score: 14,
                lvl: EDeckLevel.Third,
                cost: {},
              },
              {
                color: EGemColor.Black,
                id: 'CARD_6',
                score: 1,
                lvl: EDeckLevel.Third,
                cost: {},
              },
            ],
          },
        },
      ],
    });

    game.dispatch(FIRST_PLAYER.id, EPlayerAction.EndTurn);
    game.dispatch(PLAYERS[1].id, EPlayerAction.EndTurn);
    game.dispatch('PL_3', EPlayerAction.EndTurn);

    expect(game.getState()).toBe(EGameBasicState.GameEnded);
    expect(onGameEndMocked).toBeCalledWith(
      expect.objectContaining({
        winner: PLAYERS[1].id,
        players: [
          { score: 15, id: 'player_2', cardsBoughtCount: 1 },
          { score: 15, id: 'PL_3', cardsBoughtCount: 2 },
          { score: 15, id: 'player_1', cardsBoughtCount: 3 },
        ],
      })
    );
  });

  it('has NULL winner if score and cards bought count are equal among winning players', () => {
    const onGameEndMocked = jest.fn();
    const game = new Game({
      ...GAME_CONFIG,
      onGameEnd: onGameEndMocked,
      players: [
        {
          ...PLAYERS[0],
          cardsBought: {
            [EGemColor.Black]: [
              {
                color: EGemColor.Black,
                id: 'CARD_1',
                score: 16,
                lvl: EDeckLevel.Third,
                cost: {},
              },
            ],
          },
        },
        {
          ...PLAYERS[1],
          cardsBought: {
            [EGemColor.Black]: [
              {
                color: EGemColor.Black,
                id: 'CARD_2',
                score: 16,
                lvl: EDeckLevel.Third,
                cost: {},
              },
            ],
          },
        },
        {
          id: 'PL_3',
          name: 'Player3',
          cardsBought: {
            [EGemColor.Black]: [
              {
                color: EGemColor.Black,
                id: 'CARD_5',
                score: 16,
                lvl: EDeckLevel.Third,
                cost: {},
              },
            ],
          },
        },
      ],
    });

    game.dispatch(FIRST_PLAYER.id, EPlayerAction.EndTurn);
    game.dispatch(PLAYERS[1].id, EPlayerAction.EndTurn);
    game.dispatch('PL_3', EPlayerAction.EndTurn);

    expect(game.getState()).toBe(EGameBasicState.GameEnded);
    expect(onGameEndMocked).toBeCalledWith(
      expect.objectContaining({
        winner: null,
        players: expect.arrayContaining([
          { score: 16, id: 'player_2', cardsBoughtCount: 1 },
          { score: 16, id: 'player_1', cardsBoughtCount: 1 },
          { score: 16, id: 'PL_3', cardsBoughtCount: 1 },
        ]),
      })
    );
  });

  it('lets to earn a noble', () => {
    const game = new Game({
      ...GAME_CONFIG,
      players: [
        {
          ...PLAYERS[0],
          cardsBought: {
            [EGemColor.White]: [
              {
                color: EGemColor.White,
                id: 'CARD_1',
                score: 1,
                lvl: EDeckLevel.Third,
                cost: {},
              },
              {
                color: EGemColor.White,
                id: 'CARD_2',
                score: 1,
                lvl: EDeckLevel.Third,
                cost: {},
              },
            ],
          },
          gems: {
            [EGemColor.Gold]: 10,
          },
        },
        PLAYERS[1],
      ],
    });

    game.dispatch(FIRST_PLAYER.id, EPlayerAction.BuyCard, 'second_three');

    expect(game.getPlayer(FIRST_PLAYER.id).nobles[0]).toEqual(MOCKED_NOBLES[1]);
    expect(game.table.nobles).toEqual([MOCKED_NOBLES[0]]);
  });

  it('counts score from nobles earned', () => {
    const onGameEndMocked = jest.fn();
    const game = new Game({
      ...GAME_CONFIG,
      onGameEnd: onGameEndMocked,
      players: [
        { ...PLAYERS[0] },
        {
          id: 'ID_TWO',
          name: 'Two',
          cardsBought: {
            [EGemColor.Black]: [
              {
                color: EGemColor.Black,
                cost: {},
                id: 'CARD',
                lvl: EDeckLevel.First,
                score: 2,
              },
            ],
          },
          nobles: [
            { score: 3, requirements: { [EGemColor.Black]: 1 }, id: 'N' },
          ],
        },
      ],
    });

    expect(game.getGameResults()).toEqual(
      expect.objectContaining({
        players: [
          {
            cardsBoughtCount: 1,
            id: 'ID_TWO',
            score: 5,
          },
          {
            cardsBoughtCount: 0,
            id: 'player_1',
            score: 0,
          },
        ],
        winner: 'ID_TWO',
      })
    );
  });
});
