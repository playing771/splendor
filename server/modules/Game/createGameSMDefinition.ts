import { EPlayerAction } from '../../../interfaces/game';
import { IPlayerShape } from '../../../interfaces/player';
import { addStateLogger } from '../StateMachine/addStateLogger';
import { TStateMachineDefinition } from '../StateMachine/models';

export enum EGameBasicState {
  Initialization = 'INITIALIZATION',
  RoundStarted = 'ROUND_STARTED',
  GameEnded = 'GAME_ENDED',
}
export type TGameEvent = 'next' | 'start' | 'end';

export const createGameSMDefinition = (
  players: IPlayerShape[],
  actions: {
    move: () => void;
    startTurn: (playerId: string) => () => void;
    endTurn: (playerId: string) => () => void;
    updateRoundCounter: ()=>void;
  }
) => {
  const playerIds = players.map((player) => player.id);
  const firstPlayerId = playerIds[0];

  // generating state machine definition for turns with correct players count
  const gameSMDefinition = playerIds.reduce((acc, current, index) => {
    const nextPlayerIndex = index + 1;
    const isLastPlyer = nextPlayerIndex === players.length;
    const nextPLayerIdState = isLastPlyer
      ? EGameBasicState.RoundStarted
      : playerIds[nextPlayerIndex];

    acc[current] = {
      actions: {
        // activate current player under active GAME STATE
        // onEnter: actions.startTurn(current),
        // onExit: actions.endTurn(current)
      },
      transitions: {
        next: {
          target: nextPLayerIdState,
          // should start ACTIVE state only for players. So for last player we need to skip this action, because next is RoundStarted state)
          action: isLastPlyer
            ? undefined
            : actions.startTurn(nextPLayerIdState), 
        },
        end: {
          target: EGameBasicState.GameEnded,
        },
      },
    };
    return acc;
  }, {} as TStateMachineDefinition<string, TGameEvent>);

  // adding INITIALIZATION and GAME_ENDED states to generated definition
  const finalGameSMDefinition: TStateMachineDefinition<
    string | EGameBasicState,
    TGameEvent
  > = {
    ...gameSMDefinition,
    [EGameBasicState.Initialization]: {
      actions: {
        // onExit: () => console.log('End of Initialization'),
      },
      transitions: {
        start: {
          target: EGameBasicState.RoundStarted,
        },
      },
    },
    [EGameBasicState.RoundStarted]: {
      actions: {
        onExit: actions.updateRoundCounter,
        onEnter: actions.move, // we need this state only for ONE player setup, so just skip it to FIRST player state
      },
      transitions: {
        next: {
          target: firstPlayerId,
          action: actions.startTurn(firstPlayerId),
        },
      },
    },
    [EGameBasicState.GameEnded]: {
      transitions: {
      },
    },
  };

  // addStateLogger(finalGameSMDefinition, 'GAME_STATE:');

  return finalGameSMDefinition;
};
