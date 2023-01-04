import { ICardShape, TCardCost } from "./card";
import { ETokenColor } from "./token";

export type TPlayerTokens = {
  [key in ETokenColor]: number;
}

export type TPlayerCardsBought = {
  [key in ETokenColor]: ICardShape[];
}

export interface IPlayerShape {
  name: string;
  id: string;
  tokens: TPlayerTokens,
  cardsBought: { [key in ETokenColor]: ICardShape[] };
  cardsHolded: ICardShape[];
  tokensCount:number;
}

export interface IPlayerConfig {
  name: string;
  id: string;
  tokens?: Partial<TPlayerTokens>;
  cardsBought?: Partial<TPlayerCardsBought>;
}