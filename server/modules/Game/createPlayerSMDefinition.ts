import { addStateLogger } from "../StateMachine/addStateLogger";

export enum EPLayerState {
  Idle = "PLAYER_IDLE",
  Active = 'PLAYER_ACTIVE',
  OutOfACtion = 'PLAYER_OUT_OF_ACTIONS'
}

export enum EPlayerActions {
  BuyCard = 'BUY_CARD',
  StartTurn = 'START_TURN',
  EndTurn = 'END_TURN'
}

export const createPlayerSMDefinition = ()=> {
  const playerSMDefinition = {
    [EPLayerState.Idle]: {
      transitions: {
        [EPlayerActions.StartTurn]: {
          target: EPLayerState.Active
        }
      }
    },
    [EPLayerState.Active]: {
      transitions: {
        [EPlayerActions.BuyCard]: {
          target: EPLayerState.OutOfACtion
        },
        [EPlayerActions.EndTurn]: {
          target: EPLayerState.Idle
        }
      }
    },
    [EPLayerState.OutOfACtion]: {
      transitions: {
        [EPlayerActions.EndTurn]: {
          target: EPLayerState.Idle
        }
      }
    }
  }

  addStateLogger(playerSMDefinition, 'PLAYER_STATE:');

  
  return playerSMDefinition
}