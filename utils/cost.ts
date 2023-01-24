import { TCardCost } from '../interfaces/card';
import { EGemColor } from '../interfaces/gem';
import { TPlayerGems } from '../interfaces/player';
import { getKeys } from './typescript';

interface IGemsDiff {
  gems: TCardCost;
  hasDiff: boolean;
}

/**
 *  Gold, Red, Blue, White, Black, Green
 */
export const createPlayerGems = (...args: number[]): TPlayerGems => {
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
      typeof cost[color] !== 'undefined'
    ) {
      const diff = (gems[color] || 0) - (cost[color] || 0);
      acc[color] = diff;
    }
    return acc;
  }, {} as TCardCost);
  return { hasDiff, gems: gemsDiff };
};
