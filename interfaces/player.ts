import { ICardShape, TCardCost } from "./card";
import { EGemColor } from "./gem";

export type TPlayerTokens = {
  [key in EGemColor]: number;
}

export type TPlayerCardsBought = {
  [key in EGemColor]: ICardShape[];
}

export interface IPlayerShape {
  name: string;
  id: string;
  gems: TPlayerTokens,
  cardsBought: { [key in EGemColor]: ICardShape[] };
  cardsHolded: ICardShape[];
  tokensCount:number;
}

export interface IPlayerConfig {
  name: string;
  id: string;
  gems?: Partial<TPlayerTokens>;
  cardsBought?: Partial<TPlayerCardsBought>;
}