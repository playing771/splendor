import { TGameTableShape } from "./gameTable";
import { ETokenColor } from "./token";

export interface ITableManagerShape<C>{
  table: TGameTableShape<C>;
  takeToken(color: ETokenColor, count:number): void;
  giveToken(color: ETokenColor, count:number): number;
  buyCard(): C;
  holdCard(): C;
}