import { EDeckLevel } from "./devDeck";
import { EGemColor, EGemColorPickable } from "./gem";

export type TCardCost = {
  [key in EGemColorPickable]?: number
}

export interface ICardShape {
  id: string;
  color: EGemColor;
  score: number;
  cost: TCardCost
  lvl: EDeckLevel
}

