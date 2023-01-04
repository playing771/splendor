import { IBaseDeckConfig, IBaseDeckShape } from "./baseDeck";

export enum EDevDeckLevel {
  First = "First", // green 
  Second = "Second", // yellow
  Third = "Third" // blue
}

export interface IDevDeckConfig<C> extends IBaseDeckConfig<C> {
  level: EDevDeckLevel
}

export interface IDevDeckShape<C> extends IBaseDeckShape<C> {
  level: EDevDeckLevel
}