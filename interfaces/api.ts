import { Player } from "../server/modules/Player";
import { ICardShape } from "./card";
import { EPlayerAction, IGameMessage } from "./game";
import { TGameTableSafeState } from "./gameTable";
import { IUser } from '../server/services/UserService'

export interface IGameStateDTO extends IGameMessage {

}

export interface IGameAvailableActionsDTO {
  availableActions: EPlayerAction[]
}

export interface ILoginDTO extends IUser {

}

export interface IRoomUsersDTO {
  users: IUser[]
}