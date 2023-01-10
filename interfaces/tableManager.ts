import { TGameTableShape } from "./gameTable";

export interface ITableManagerShape<C>{
  table: TGameTableShape<C>;
}