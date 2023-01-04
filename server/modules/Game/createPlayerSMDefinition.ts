import { addStateLogger } from "../StateMachine/addStateLogger";

export enum EPLayerState {
  Idle = "PLAYER_IDLE",
  Active = 'PLAYER_ACTIVE',
  TooManyTokens = 'PLAYER_TOO_MANY_TOKENS',
  OutOfACtion = 'PLAYER_OUT_OF_ACTIONS'
}

export enum EPlayerAction {
  StartTurn = 'START_TURN',
  BuyCard = 'BUY_CARD',
  TakeTokens = 'TAKE_TOKENS',
  TakeTokensOverLimit = 'TAKE_TOKENS_OVER_LIMIT',
  ReturnTokens = 'RETURN_TOKENS',
  EndTurn = 'END_TURN'
}


export const STATES_AVAILABLE_FOR_ACTION: { [key in EPLayerState]: boolean } = {
  [EPLayerState.Idle]: false,
  [EPLayerState.Active]: true,
  [EPLayerState.OutOfACtion]: true,
  [EPLayerState.TooManyTokens]: true
}

export const createPlayerSMDefinition = () => {
  const playerSMDefinition = {
    [EPLayerState.Idle]: {
      transitions: {
        [EPlayerAction.StartTurn]: {
          target: EPLayerState.Active
        }
      }
    },
    [EPLayerState.Active]: {
      transitions: {
        [EPlayerAction.TakeTokens]: {
          target: EPLayerState.OutOfACtion
        },
        [EPlayerAction.TakeTokensOverLimit]: {
          target: EPLayerState.TooManyTokens
        },
        [EPlayerAction.BuyCard]: {
          target: EPLayerState.OutOfACtion
        },
        [EPlayerAction.EndTurn]: {
          target: EPLayerState.Idle
        }
      }
    },
    [EPLayerState.TooManyTokens]: {
      transitions: {
        [EPlayerAction.ReturnTokens]: {
          target: EPLayerState.OutOfACtion
        }
      }
    },
    [EPLayerState.OutOfACtion]: {
      transitions: {
        [EPlayerAction.EndTurn]: {
          target: EPLayerState.Idle
        }
      }
    }
  }

  // addStateLogger(playerSMDefinition, 'PLAYER_STATE:');


  return playerSMDefinition
}

