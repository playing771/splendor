import { Nullable } from "../utils/typescript";
import { ICardShape } from "./card";
import { EPlayerAction, IGameResult } from "./game";
import { TGameTableSafeState } from "./gameTable";
import { IPlayerShape } from "./player";
import { IUser } from "./user";

export enum EMessageType {
  GameStateChange = 'GAME_STATE_CHANGE',
  RoomStateChange = 'ROOM_STATE_CHANGE',
  RoomsChange = 'RoomsChange',
  GetGameState = 'GET_GAME_STATE',
  GameStarted = 'GAME_STARTED'
}
export interface IMessage<T> {
  type: EMessageType,
  data?: T
}
export interface IGameStateDTO {
  availableActions: EPlayerAction[];
  table: TGameTableSafeState<ICardShape>;
  players: IPlayerShape[];
  playerState: Nullable<IPlayerShape>;
  activePlayer: string;
  isPlayerActive: boolean;
  gameResults: IGameResult;
  round: number;
}

export interface IGameAvailableActionsDTO {
  availableActions: EPlayerAction[]
}

export interface ILoginDTO extends IUser {

}

export interface IRoomUsersDTO {
  users: IUser[]
}