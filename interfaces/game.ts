import { ICardShape } from "./card";
import { TGameTableConfig, TGameTableShape } from "./gameTable";

export interface IGameShape<C> {
  id: string;
  table: TGameTableShape<C>
}

export interface IGameConfig {
  tableConfig: TGameTableConfig<ICardShape>
}

export enum EPLayerState {
  Idle = "PLAYER_IDLE",
  Active = 'PLAYER_ACTIVE',
  TooManyTokens = 'PLAYER_TOO_MANY_TOKENS',
  OutOfAction = 'PLAYER_OUT_OF_ACTIONS'
}

export enum EPlayerAction {
  StartTurn = 'START_TURN',
  BuyCard = 'BUY_CARD',
  TakeTokens = 'TAKE_TOKENS',
  TakeTokensOverLimit = 'TAKE_TOKENS_OVER_LIMIT',
  ReturnTokens = 'RETURN_TOKENS',
  EndTurn = 'END_TURN'
}