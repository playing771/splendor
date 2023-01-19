import { ICardShape, TCardCost } from "./card";
import { EGemColor } from "./gem";
import { INobleShape } from "./noble";

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
  nobles: INobleShape[]
}

export interface IPlayerConfig {
  name: string;
  id: string;
  gems?: Partial<TPlayerGems>;
  cardsBought?: Partial<TPlayerCardsBought>;
  cardsHolded?: ICardShape[]
  nobles?: INobleShape[]
}