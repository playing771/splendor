import { ICardShape } from "./card";
import { ETokenColor } from "./token";

export type TPlayerTokens = {
  [key in ETokenColor]: number;
}

export interface IPlayerShape {
  name: string;
  id: string;
  tokens: TPlayerTokens,
  cardsBought: ICardShape[];
  cardsHolded: ICardShape[];

  getTokens(color: ETokenColor, count: number): void;
  spendTokens(color: ETokenColor, count: number): void;
}