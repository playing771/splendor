import { ETokenColor } from '../../interfaces/token';

export const countTokens = (tokens: { [key in ETokenColor]?: number }) =>
  Object.values(tokens).reduce((summ, count) => (summ += count), 0);
