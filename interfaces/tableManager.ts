import { EDeckLevel } from "./devDeck";
import { TGameTableShape } from "./gameTable";
import { ETokenColor } from "./token";

export interface ITableManagerShape<C>{
  table: TGameTableShape<C>;
}