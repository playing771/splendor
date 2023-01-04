import { EPlayerAction } from '../../../interfaces/game';
import { IPlayerShape } from '../../../interfaces/player';
import { addStateLogger } from '../StateMachine/addStateLogger';
import { TStateMachineDefinition } from '../StateMachine/models';

// export type TGameState = 'INITIALIZATION' | 'GAME_ENDED';
export enum EGameBasicState {
  Initialization = 'INITIALIZATION',
  // RoundStarted = 'ROUND_STARTED',
  GameEnded = 'GAME_ENDED',
}
export type TGameEvent = 'next' | 'start' | 'end';

export const createGameSMDefinition = (
  players: IPlayerShape[],
  actionCreators: {
    [EPlayerAction.StartTurn]: (playerId: string) => () => void;
    [EPlayerAction.EndTurn]: (playerId: string) => () => void;
  }
) => {
  const playerIds = players.map((player) => player.id);
  const firstPlayerId = playerIds[0];

  // generating state machine definition for turns with correct players count
  const gameSMDefinition = playerIds.reduce((acc, current, index) => {
    const nextPlayerIndex = index + 1;
    const isLastPlyer = nextPlayerIndex === players.length;
    const nextState = isLastPlyer
      ? players[0].id
      : playerIds[nextPlayerIndex];

    acc[current] = {
      actions: {
        onEnter: actionCreators[EPlayerAction.StartTurn](current),
        onExit: actionCreators[EPlayerAction.EndTurn](current),
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
          target: firstPlayerId
        },
      },
    },
    // [EGameBasicState.RoundStarted]: {
    //   transitions: {
    //     next: {
    //       target: firstPlayerId,
    //     },
    //   },
    // },
    [EGameBasicState.GameEnded]: {
      transitions: {
        end: {
          target: EGameBasicState.Initialization,
        },
      },
    },
  };

  addStateLogger(finalGameSMDefinition, 'GAME_STATE:');

  return finalGameSMDefinition;
};
