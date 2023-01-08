import { IBaseDeckConfig, IBaseDeckShape } from "./baseDeck";

export enum EDeckLevel {
  First = "First", // green 
  Second = "Second", // yellow
  Third = "Third" // blue
}

export interface IDevDeckConfig<C> extends IBaseDeckConfig<C> {
  level: EDeckLevel
}

export interface IDevDeckShape<C> extends IBaseDeckShape<C> {
  level: EDeckLevel
}