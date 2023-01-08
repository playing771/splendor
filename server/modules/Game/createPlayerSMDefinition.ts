import { EPLayerState, EPlayerAction } from '../../../interfaces/game';
import { TPlayerTokens } from '../../../interfaces/player';
import { addStateLogger } from '../StateMachine/addStateLogger';
import { TStateMachineDefinition } from '../StateMachine/models';

export const STATES_AVAILABLE_FOR_ACTION: { [key in EPLayerState]: boolean } = {
  [EPLayerState.Idle]: false,
  [EPLayerState.Active]: true,
  [EPLayerState.OutOfAction]: true,
  [EPLayerState.TooManyTokens]: true,
};

export const createPlayerSMDefinition = (actions: {
  move: () => boolean;
  buyCard: (cardId?: string) => boolean;
  // takeTokens: (tokens: Partial<TPlayerTokens>) => boolean;
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
        [EPlayerAction.TakeTokens]: {
          target: EPLayerState.OutOfAction,
          // action: (tokens) => actions.takeTokens(tokens as Partial<TPlayerTokens>),
        },
        [EPlayerAction.TakeTokensOverLimit]: {
          target: EPLayerState.TooManyTokens,
        },
        [EPlayerAction.BuyCard]: {
          target: EPLayerState.OutOfAction,
          action: (cardId) => actions.buyCard(cardId as string),
        },
        [EPlayerAction.EndTurn]: {
          target: EPLayerState.Idle,
          // action: actions.activateNextPlayer
        },
      },
    },
    [EPLayerState.TooManyTokens]: {
      transitions: {
        [EPlayerAction.ReturnTokens]: {
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

  addStateLogger(playerSMDefinition, 'PLAYER_STATE:');

  return playerSMDefinition;
};
