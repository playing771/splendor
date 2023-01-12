import { Player } from '.';
import { ICardShape } from '../../../interfaces/card';
import { EDeckLevel } from '../../../interfaces/devDeck';
import { EGemColor } from '../../../interfaces/gem';

const CARD_MOCKED_ONE: ICardShape = {
  color: EGemColor.Blue,
  cost: {
    [EGemColor.Red]: 1,
    [EGemColor.Blue]: 1,
  },
  id: 'CARD_ID_1',
  score: 0,
  lvl: EDeckLevel.First
};

const CARD_MOCKED_TWO: ICardShape = {
  color: EGemColor.Blue,
  cost: {
    [EGemColor.Red]: 1,
    [EGemColor.Blue]: 1,
  },
  id: 'CARD_ID_2',
  score: 0,
  lvl: EDeckLevel.First
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

  it('can buy a card for gold', ()=> {
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
  })
});
