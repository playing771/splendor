import { Player } from "../server/modules/Player";
import { ICardShape } from "./card";
import { EPlayerAction } from "./game";
import { TGameTableSafeState } from "./gameTable";
import { IUser } from '../server/services/UserService'

export interface IGameStateDTO {
  table: TGameTableSafeState<ICardShape>;
  players: Player[];
}

export interface IGameAvailableActionsDTO {
  availableActions: EPlayerAction[]
}

export interface ILoginDTO extends IUser {

}

export interface IRoomUsersDTO {
  users: IUser[]
}