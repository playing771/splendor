import { Nullable } from "../utils/typescript";
import { IUser } from "./user";

export enum ERoomState {
  Started = 'Started',
  Pending = 'Pending',
  Finished = 'Finished'
}

export interface IRoomShape {
  id: string;
  name: string;
  owner: IUser;
  users: IUser[];
  // spectators: IUser[];
  state: ERoomState;
  gameId: Nullable<string>;
}

export interface IRoomConfig extends Partial<IRoomShape> {
  owner: IUser;
}