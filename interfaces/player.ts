import { ICardShape, TCardCost } from "./card";
import { EGemColor } from "./gem";

export type TPlayerGems = {
  [key in EGemColor]: number;
}

export type TPlayerCardsBought = {
  [key in EGemColor]: ICardShape[];
}

export interface IPlayerShape {
  name: string;
  id: string;
  gems: TPlayerGems,
  cardsBought: { [key in EGemColor]: ICardShape[] };
  cardsHolded: ICardShape[];
  gemsCount:number;
}

export interface IPlayerConfig {
  name: string;
  id: string;
  gems?: Partial<TPlayerGems>;
  cardsBought?: Partial<TPlayerCardsBought>;
}