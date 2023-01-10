import { EPLayerState, EPlayerAction } from '../../../interfaces/game';
import { TPlayerTokens } from '../../../interfaces/player';
import { addStateLogger } from '../StateMachine/addStateLogger';
import { TStateMachineDefinition } from '../StateMachine/models';

export const STATES_AVAILABLE_FOR_ACTION: { [key in EPLayerState]: boolean } = {
  [EPLayerState.Idle]: false,
  [EPLayerState.Active]: true,
  [EPLayerState.OutOfAction]: true,
  [EPLayerState.TooManyGems]: true,
};

export const createPlayerSMDefinition = (actions: {
  move: () => void;
  // buyCard: (cardId?: string) => void;
  // takeTokens: (gems: Partial<TPlayerTokens>) => void;
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
          // action: (gems) => actions.takeTokens(gems as Partial<TPlayerTokens>),
        },
        [EPlayerAction.TakeGemsOverLimit]: {
          target: EPLayerState.TooManyGems,
        },
        [EPlayerAction.BuyCard]: {
          target: EPLayerState.OutOfAction,
        },
        [EPlayerAction.EndTurn]: {
          target: EPLayerState.Idle,
          // action: actions.activateNextPlayer
        },
      },
    },
    [EPLayerState.TooManyGems]: {
      transitions: {
        [EPlayerAction.ReturnGems]: {
          target: EPLayerState.OutOfAction,
        },
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
