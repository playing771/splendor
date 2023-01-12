import { EPLayerState, EPlayerAction } from '../../../interfaces/game';
import { addStateLogger } from '../StateMachine/addStateLogger';
import { TStateMachineDefinition } from '../StateMachine/models';

export const createPlayerSMDefinition = (actions: {
  move: () => void;
  // buyCard: (cardId?: string) => void;
  // takeTokens: (gems: Partial<TPlayerGems>) => void;
  // activateNextPlayer: () => void;
}) => {
  const playerSMDefinition: TStateMachineDefinition<
    EPLayerState,
    EPlayerAction
  > = {
    [EPLayerState.Idle]: {
      actions: {
        onEnter: actions.move, // after start of IDLE call next turn of the game state machine
      },
      transitions: {
        [EPlayerAction.StartTurn]: {
          target: EPLayerState.Active,
        },
      },
    },
    [EPLayerState.Active]: {
      transitions: {
        [EPlayerAction.TakeGems]: {
          target: EPLayerState.OutOfAction,
        },
        [EPlayerAction.TakeGemsOverLimit]: {
          target: EPLayerState.TooManyGems,
        },
        [EPlayerAction.BuyCard]: {
          target: EPLayerState.OutOfAction,
        },
        [EPlayerAction.BuyHoldedCard]: {
          target: EPLayerState.OutOfAction,
        },
        [EPlayerAction.HoldCardFromTable]: {
          target: EPLayerState.OutOfAction
        },
        [EPlayerAction.HoldCardFromDeck]: {
          target: EPLayerState.OutOfAction
        },
        [EPlayerAction.EndTurn]: {
          target: EPLayerState.Idle,
        },
      },
    },
    [EPLayerState.TooManyGems]: {
      transitions: {
        [EPlayerAction.ReturnGems]: {
          target: EPLayerState.OutOfAction,
        },
        [EPlayerAction.TakeGemsOverLimit]: {
          target: EPLayerState.TooManyGems
        }
      },
    },
    [EPLayerState.OutOfAction]: {
      transitions: {
        [EPlayerAction.EndTurn]: {
          target: EPLayerState.Idle,
          // action: actions.move
        },
      },
    },
  };

  // addStateLogger(playerSMDefinition, 'PLAYER_STATE:');

  return playerSMDefinition;
};
