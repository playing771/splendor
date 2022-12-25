import { IPlayerShape } from '../../interfaces/player';
import { addStateLogger } from '../StateMachine/addStateLogger';
import { TStateMachineDefinition } from '../StateMachine/models';

// export type TGameState = 'INITIALIZATION' | 'GAME_ENDED';
export enum EGameBasicState {
  Initialization = 'INITIALIZATION',
  RoundStarted = 'ROUND_STARTED',
  GameEnded = 'GAME_ENDED',
}
export type TTurnEvent = 'next' | 'start' | 'end';

export const createGameSMDefinition = (
  players: IPlayerShape[],
  actionCreators: {
    startTurn: (playerId: string) => () => void;
    endTurn: (playerId: string) => () => void;
  }
) => {
  const playerIds = players.map((player) => player.id);
  const firstPlayerId = playerIds[0];


  // generating state machine definition for turns with correct players count
  const definition = playerIds.reduce((acc, current, index) => {
    const nextPlayerIndex = index + 1;
    const isLastPlyer = nextPlayerIndex === players.length;
    const nextState = isLastPlyer
      ? EGameBasicState.RoundStarted
      : playerIds[nextPlayerIndex];

    acc[current] = {
      actions: {
        onEnter: actionCreators.startTurn(current),
        onExit: actionCreators.endTurn(current)
      },
      transitions: {
        next: {
          target: nextState,
        },
        end: {
          target: EGameBasicState.GameEnded,
        },
      },
    };
    return acc;
  }, {} as TStateMachineDefinition<string, TTurnEvent>);

  // adding INITIALIZATION and GAME_ENDED states to generated definition
  const finalDefinition: TStateMachineDefinition<
    string | EGameBasicState,
    TTurnEvent
  > = {
    ...definition,
    [EGameBasicState.Initialization]: {
      actions: {
        onExit: () => console.log('Test'),
      },
      transitions: {
        start: {
          target: EGameBasicState.RoundStarted,
        },
      },
    },
    [EGameBasicState.RoundStarted]: {
      transitions: {
        next: {
          target: firstPlayerId,
        },
      },
    },
    [EGameBasicState.GameEnded]: {
      transitions: {
        end: {
          target: EGameBasicState.Initialization,
        },
      },
    },
  };

  addStateLogger(finalDefinition, 'GAME_STATE:');

  return finalDefinition;
};
