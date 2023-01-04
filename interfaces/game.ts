import { ICardShape } from "./card";
import { TGameTableConfig, TGameTableShape } from "./gameTable";
import { IPlayerConfig, IPlayerShape } from "./player";
import { ITableManagerShape } from "./tableManager";

export interface IGameShape<C> {
  // players: IPlayerShape[];
  id: string;
}

export interface IGameConfig {
  tableConfig: TGameTableConfig<ICardShape>
}
