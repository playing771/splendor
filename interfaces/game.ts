import { Player } from "../server/modules/Player";
import { Nullable } from "../utils/typescript";
import { ICardShape } from "./card";
import { TGameTableConfig, TGameTableSafeState, TGameTableShape } from "./gameTable";
import { IPlayerShape } from "./player";

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

export interface IGameMessage {
  availableActions: EPlayerAction[];
  table: TGameTableSafeState<ICardShape>;
  players: IPlayerShape[];
  playerState: IPlayerShape;
  isPlayerActive: boolean;
  gameResults: IGameResult;
}
export type IGameResult = {
  winner: Nullable<string>,
  players: Array<{
    score: number,
    cardsBoughtCount: number,
    id: string
  }>
}