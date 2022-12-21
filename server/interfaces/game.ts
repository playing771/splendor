import { TGameTableShape } from "./gameTable";
import { IPlayerShape } from "./player";
import { ITableManagerShape } from "./tableManager";

export interface IGameShape<C> {
  table: TGameTableShape<C>;
  tableManager: ITableManagerShape<C>;
  players: IPlayerShape[];
  id: string;
  
}


