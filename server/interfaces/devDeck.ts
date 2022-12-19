import { IBaseDeckConfig, IBaseDeckShape } from "./baseDeck";

export enum EDevDeckLevel {
  First, // green 
  Second, // yellow
  Third // blue
}


export interface IDevDeckConfig<C> extends IBaseDeckConfig<C> {
  level: EDevDeckLevel
}

export interface IDevDeckShape<C> extends IBaseDeckShape<C> {
  level: EDevDeckLevel
}