import { Player } from '.';
import { ICardShape } from '../../../interfaces/card';
import { EDeckLevel } from '../../../interfaces/devDeck';
import { EGemColor } from '../../../interfaces/gem';

const HOLDED_CARD: ICardShape = {
  color: EGemColor.Red,
  cost: {
    [EGemColor.Blue]: 1,
    [EGemColor.Red]: 1,
  },
  id: 'HOLDED_CARD',
  lvl: EDeckLevel.First,
  score: 0,
};

const CARD_MOCKED_ONE: ICardShape = {
  color: EGemColor.Blue,
  cost: {
    [EGemColor.Red]: 1,
    [EGemColor.Blue]: 1,
  },
  id: 'CARD_ID_1',
  score: 0,
  lvl: EDeckLevel.First,
};

const CARD_MOCKED_TWO: ICardShape = {
  color: EGemColor.Blue,
  cost: {
    [EGemColor.Red]: 1,
    [EGemColor.Blue]: 1,
  },
  id: 'CARD_ID_2',
  score: 0,
  lvl: EDeckLevel.First,
};

describe('Player functionality', () => {
  it('can buy a card', () => {
    const player = new Player({
      name: 'max',
      id: 'ID_1',
      gems: {
        [EGemColor.Blue]: 2,
        [EGemColor.Red]: 2,
      },
    });

    expect(player.buyCard(CARD_MOCKED_ONE)).toEqual({
      [EGemColor.Gold]: 0,
      [EGemColor.Red]: 1,
      [EGemColor.Black]: 0,
      [EGemColor.Green]: 0,
      [EGemColor.White]: 0,
      [EGemColor.Blue]: 1,
    });

    expect(player.cardsBought[CARD_MOCKED_ONE.color][0].id).toBe(
      CARD_MOCKED_ONE.id
    );
    expect(player.gems[EGemColor.Blue]).toBe(1);
    expect(player.gems[EGemColor.Red]).toBe(1);
  });

  it('can buy a holded card', () => {
    const player = new Player({
      name: 'max',
      id: 'ID_1',
      gems: {
        [EGemColor.Blue]: 2,
        [EGemColor.Red]: 2,
      },
      cardsHolded: [HOLDED_CARD],
    });

    expect(player.buyHoldedCard(HOLDED_CARD)).toEqual({
      [EGemColor.Red]: 1,
      [EGemColor.Blue]: 1,
      [EGemColor.Gold]: 0,
      [EGemColor.Black]: 0,
      [EGemColor.Green]: 0,
      [EGemColor.White]: 0,
    });

    expect(player.cardsBought[HOLDED_CARD.color][0].id).toBe(HOLDED_CARD.id);
    expect(player.gems[EGemColor.Blue]).toBe(1);
    expect(player.gems[EGemColor.Red]).toBe(1);
  });

  it('can buy a card for a cost minus gems from bought cards', () => {
    const player = new Player({
      name: 'max',
      id: 'ID_1',
      gems: {
        [EGemColor.Blue]: 2,
        [EGemColor.Red]: 2,
      },
      cardsBought: { [EGemColor.Blue]: [CARD_MOCKED_ONE] },
    });

    expect(player.buyCard(CARD_MOCKED_TWO)).toEqual({
      [EGemColor.Gold]: 0,
      [EGemColor.Red]: 1,
      [EGemColor.Black]: 0,
      [EGemColor.Green]: 0,
      [EGemColor.White]: 0,
      [EGemColor.Blue]: 0,
    });

    expect(player.cardsBought[CARD_MOCKED_TWO.color][1].id).toBe(
      CARD_MOCKED_TWO.id
    );
    expect(player.gems[EGemColor.Blue]).toBe(2);
    expect(player.gems[EGemColor.Red]).toBe(1);
  });

  it('can buy a card for gold', () => {
    const player = new Player({
      name: 'max',
      id: 'ID_1',
      gems: {
        [EGemColor.Gold]: 2,
        [EGemColor.Red]: 1,
      },
    });

    expect(player.buyCard(CARD_MOCKED_TWO)).toEqual({
      [EGemColor.Gold]: 1,
      [EGemColor.Red]: 1,
      [EGemColor.Black]: 0,
      [EGemColor.Green]: 0,
      [EGemColor.White]: 0,
      [EGemColor.Blue]: 0,
    });
    expect(player.cardsBought[CARD_MOCKED_TWO.color][0].id).toBe(
      CARD_MOCKED_TWO.id
    );
    expect(player.gems[EGemColor.Gold]).toBe(1);
  });

  it('throws an error if gems are not enough to pay cost', () => {
    const initialGemsHolded = {
      [EGemColor.Gold]: 1,
      [EGemColor.Red]: 1,
      [EGemColor.Blue]: 1,
      [EGemColor.White]: 1,
      [EGemColor.Black]: 0,
      [EGemColor.Green]: 0,
    }
    const player = new Player({
      name: 'max',
      id: 'ID_1',
      gems: initialGemsHolded,
    });
    const cardToBuy = {
      color: EGemColor.Black, id: 'SOME', lvl: EDeckLevel.First, score: 0, cost: {
        [EGemColor.Red]: 1,
        [EGemColor.Blue]: 1,
        [EGemColor.Green]: 1,
        [EGemColor.Black]: 1,
      }
    };

    expect(() => player.buyCard(cardToBuy)).toThrow();
    expect(player.gems).toEqual(initialGemsHolded)
  })

  it('has score calculated by cards and nobles owned', () => {
    const player = new Player({
      name: 'max',
      id: 'ID_1',
      cardsBought: {
        [EGemColor.Black]: [
          {
            color: EGemColor.Black,
            score: 4,
            cost: {},
            id: 'SOME',
            lvl: EDeckLevel.First,
          },
        ],
      },
      nobles: [{ requirements: { [EGemColor.Black]: 1 }, score: 2, id: 'ID' }],
    });

    expect(player.score).toBe(6);
  });

  it('has getAllGemsAvailable', () => {
    const player = new Player({
      name: 'max',
      id: 'ID_1',
      gems: {
        [EGemColor.Gold]: 1,
        [EGemColor.Red]: 1,
      },
      cardsBought: {
        [EGemColor.Black]: [
          {
            color: EGemColor.Black,
            score: 1,
            cost: {},
            id: 'SOME',
            lvl: EDeckLevel.First,
          },
        ],
        [EGemColor.Red]: [
          {
            color: EGemColor.Red,
            score: 1,
            cost: {},
            id: 'TWO',
            lvl: EDeckLevel.First,
          },
          {
            color: EGemColor.Red,
            score: 1,
            cost: {},
            id: 'ONE',
            lvl: EDeckLevel.First,
          },
        ],
      },
      nobles: [{ requirements: { [EGemColor.Black]: 1 }, score: 2, id: 'ID' }],
    });

    expect(player.getAllGemsAvailable).toEqual({
      [EGemColor.Black]: 1,
      [EGemColor.Gold]: 1,
      [EGemColor.Red]: 3,
      [EGemColor.Green]: 0,
      [EGemColor.Blue]: 0,
      [EGemColor.White]: 0,
    });
  });
});
