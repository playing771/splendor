import { EPLayerState, EPlayerAction } from "../../../interfaces/game";
import { addStateLogger } from "../StateMachine/addStateLogger";


export const STATES_AVAILABLE_FOR_ACTION: { [key in EPLayerState]: boolean } = {
  [EPLayerState.Idle]: false,
  [EPLayerState.Active]: true,
  [EPLayerState.OutOfAction]: true,
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
          target: EPLayerState.OutOfAction
        },
        [EPlayerAction.TakeTokensOverLimit]: {
          target: EPLayerState.TooManyTokens
        },
        [EPlayerAction.BuyCard]: {
          target: EPLayerState.OutOfAction
        },
        [EPlayerAction.EndTurn]: {
          target: EPLayerState.Idle
        }
      }
    },
    [EPLayerState.TooManyTokens]: {
      transitions: {
        [EPlayerAction.ReturnTokens]: {
          target: EPLayerState.OutOfAction
        }
      }
    },
    [EPLayerState.OutOfAction]: {
      transitions: {
        [EPlayerAction.EndTurn]: {
          target: EPLayerState.Idle
        }
      }
    }
  }

  addStateLogger(playerSMDefinition, 'PLAYER_STATE:');


  return playerSMDefinition
}

