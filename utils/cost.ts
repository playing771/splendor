import { ICardShape, TCardCost } from '../interfaces/card';
import { EGemColor, EGemColorPickable } from '../interfaces/gem';
import { TPlayerCardsBought, TPlayerGems } from '../interfaces/player';
import { getKeys } from './typescript';

interface IGemsDiff {
  gems: TCardCost;
  hasDiff: boolean;
}

/**
 *  Gold, Red, Blue, White, Black, Green
 */
export const createPlayerGems = (
  ...args: [number, number, number, number, number, number]
): TPlayerGems => {
  return {
    [EGemColor.Gold]: args[0],
    [EGemColor.Red]: args[1],
    [EGemColor.Blue]: args[2],
    [EGemColor.White]: args[3],
    [EGemColor.Black]: args[4],
    [EGemColor.Green]: args[5],
  };
};

export const getGemsDiff = (cost: TCardCost, gems: TPlayerGems): IGemsDiff => {
  let hasDiff = false;
  const gemsDiff = getKeys(EGemColor).reduce((acc, color) => {
    if (
      typeof gems[color] !== 'undefined' ||
      typeof cost[color as EGemColorPickable] !== 'undefined'
    ) {
      const diff = (gems[color] || 0) - (cost[color as EGemColorPickable] || 0);
      acc[color as EGemColorPickable] = diff;
    }
    return acc;
  }, {} as TCardCost);
  return { hasDiff, gems: gemsDiff };
};

export const canAffordToPayCost = (cost: TCardCost, gems: TPlayerGems) => {
  let gold = gems[EGemColor.Gold];
  const canAfford = Object.keys(cost).every((color) => {
    const diff =
      gems[color as EGemColorPickable] -
      (cost[color as EGemColorPickable] || 0);
    if (diff >= 0) {
      return true;
    } else {
      if (diff + gold >= 0) {
        gold = gold + diff;
        return true;
      }
    }
    return false;
  });
  return canAfford;
};

export const gemsFromCardsBought = (cardsBought: TPlayerCardsBought) => {
  return getKeys(cardsBought).reduce((acc, color) => {
    acc[color] = cardsBought[color].length;
    return acc;
  }, {} as TCardCost);
};

export const getAllGemsAvailable = (
  cardsBought?: TPlayerCardsBought,
  gems: TPlayerGems = createPlayerGems(0, 0, 0, 0, 0, 0)
) => {
  const gemsFromCards = cardsBought ? gemsFromCardsBought(cardsBought) : {};

  return getKeys(EGemColorPickable).reduce(
    (acc, color) => {
      acc[color] += gemsFromCards[color] || 0;
      return acc;
    },
    { ...gems }
  );
};
