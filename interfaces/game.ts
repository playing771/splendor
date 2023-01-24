import { Nullable } from "../utils/typescript";
import { ICardShape } from "./card";
import { TGameTableConfig, TGameTableShape } from "./gameTable";

export interface IGameShape<C> {
  id: string;
  roomId?:string;
  table: TGameTableShape<C>
  round: number;
}

export interface IGameConfig {
  setup: Map<number,IGameSetup>,
  tableConfig: TGameTableConfig<ICardShape>
  hasAutostart?:boolean;
  onGameEnd?: (
    result: IGameResult
  ) => void;
  onGameStart?: (gameId: string)=>void;
}

export enum EPLayerState {
  Idle = "PLAYER_IDLE",
  Active = 'PLAYER_ACTIVE',
  TooManyGems = 'PLAYER_TOO_MANY_GEMS',
  OutOfAction = 'PLAYER_OUT_OF_ACTIONS'
}

export enum EPlayerAction {
  StartTurn = 'START_TURN',
  BuyCard = 'BUY_CARD',
  BuyHoldedCard = 'BUY_HOLDED_CARD',
  HoldCardFromTable = 'HOLD_CARD_FROM_TABLE',
  HoldCardFromDeck = 'HOLD_CARD_FROM_DECK',
  TakeGems = 'TAKE_GEMS',
  TakeGemsOverLimit = 'TAKE_GEMS_OVER_LIMIT',
  ReturnGems = 'RETURN_GEMS',
  EndTurn = 'END_TURN'
}

export type IGameResult = {
  round: number,
  winner: Nullable<string>,
  players: Array<{
    score: number,
    cardsBoughtCount: number,
    id: string
  }>
}

export interface IGameSetup {
  gems: number;
  nobles: number;
}

export type PlayerId = string;

export type TGameState = PlayerId | EGameBasicState;

export enum EGameBasicState {
  Initialization = 'INITIALIZATION',
  RoundStarted = 'ROUND_STARTED',
  GameEnded = 'GAME_ENDED',
}
export type TGameEvent = 'next' | 'start' | 'end';