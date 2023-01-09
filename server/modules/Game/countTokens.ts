import { EGemColor } from '../../../interfaces/gem';

export const countTokens = (gems: { [key in EGemColor]?: number }) =>
  Object.values(gems).reduce((summ, count) => (summ += count), 0);
