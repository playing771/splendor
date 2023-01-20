import { Nullable } from "../utils/typescript"

export enum EUserRole {
  Player = 'Player',
  Spectator = 'Spectator'
}

export interface IUser {
  id: string,
  name: string
  role: Nullable<EUserRole>
}