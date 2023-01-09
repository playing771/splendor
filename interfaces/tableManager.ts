import { EDeckLevel } from "./devDeck";
import { TGameTableShape } from "./gameTable";
import { EGemColor } from "./gem";

export interface ITableManagerShape<C>{
  table: TGameTableShape<C>;
}