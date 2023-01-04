import { Player } from '.';
import { ICardShape } from '../../../interfaces/card';
import { EDevDeckLevel } from '../../../interfaces/devDeck';
import { ETokenColor } from '../../../interfaces/token';

const CARD_MOCKED_ONE: ICardShape = {
  color: ETokenColor.Blue,
  cost: {
    [ETokenColor.Red]: 1,
    [ETokenColor.Blue]: 1,
  },
  id: 'CARD_ID_1',
  score: 0,
  lvl: EDevDeckLevel.First
};

const CARD_MOCKED_TWO: ICardShape = {
  color: ETokenColor.Blue,
  cost: {
    [ETokenColor.Red]: 1,
    [ETokenColor.Blue]: 1,
  },
  id: 'CARD_ID_2',
  score: 0,
  lvl: EDevDeckLevel.First
};

describe('Player functionality', () => {
  it('can buy a card', () => {
    const player = new Player({
      name: 'max',
      id: 'ID_1',
      tokens: {
        [ETokenColor.Blue]: 2,
        [ETokenColor.Red]: 2,
      },
    });

    player.buyCard(CARD_MOCKED_ONE);

    expect(player.cardsBought[CARD_MOCKED_ONE.color][0].id).toBe(
      CARD_MOCKED_ONE.id
    );
    expect(player.tokens[ETokenColor.Blue]).toBe(1);
    expect(player.tokens[ETokenColor.Red]).toBe(1);
  });

  it('can buy a card for a cost minus tokens from bought cards', () => {
    const player = new Player({
      name: 'max',
      id: 'ID_1',
      tokens: {
        [ETokenColor.Blue]: 2,
        [ETokenColor.Red]: 2,
      },
      cardsBought: { [ETokenColor.Blue]: [CARD_MOCKED_ONE] },
    });

    player.buyCard(CARD_MOCKED_TWO);

    expect(player.cardsBought[CARD_MOCKED_TWO.color][1].id).toBe(
      CARD_MOCKED_TWO.id
    );
    expect(player.tokens[ETokenColor.Blue]).toBe(2);
    expect(player.tokens[ETokenColor.Red]).toBe(1);
  });
});
