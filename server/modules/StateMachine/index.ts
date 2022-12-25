import { IStateMachine, TStateMachineDefinition } from "./models";



export const createStateMachine = <S extends PropertyKey, T extends PropertyKey>(initialState: S, smDefinition: TStateMachineDefinition<S, T>) => {
  const stateMachine: IStateMachine<S,T> = {
    value: initialState,
    transition: (event: T) => {
      const currentState = stateMachine.value;
      const currentStateMachineDefinition = smDefinition[currentState];

      const targetTransition = currentStateMachineDefinition.transitions[event];
      if (!targetTransition) {
        throw Error(`no transition for event ${event as string}`)
      }

      const targetStateMachineState = targetTransition.target;
      const targetStateMachineDefinition = smDefinition[targetStateMachineState];

      targetTransition.action();
      currentStateMachineDefinition.actions?.onExit && currentStateMachineDefinition.actions.onExit();
      targetStateMachineDefinition.actions?.onEnter && targetStateMachineDefinition.actions.onEnter();

      stateMachine.value = targetStateMachineState;
    }
  }

  return stateMachine;
}

enum EState {
  IDLE,
  ACTIVE,
  OUT_OF_ACTIONS
}

const sm = createStateMachine(EState.IDLE, {
  [EState.ACTIVE]: {
    actions: {
      onEnter: () => {
        console.log('ACTIVE: onEtner')
      },
      onExit: () => {
        console.log('ACTIVE: onExit')
      },
    },
    transitions: {
      buyCard: {
        target: EState.OUT_OF_ACTIONS,
        action: () => {
          console.log('transition action buyCard in ACTIVE state')
        }
      },
      skipTurn: {
        target: EState.OUT_OF_ACTIONS,
        action: () => {
          console.log('transition action skipTurn in ACTIVE state')
        }
      }
    }
  },

  [EState.OUT_OF_ACTIONS]: {
    actions: {
      onEnter: () => {
        console.log('OUT_OF_ACTIONS: onEtner')
      },
      onExit: () => {
        console.log('OUT_OF_ACTIONS: onExit')
      },
    },
    transitions: {
      endTurn: {
        target: EState.IDLE,
        action: () => {
          console.log('transition action endTurn in OUT_OF_ACTIONS state')
        }
      }
    }
  },

  [EState.IDLE]: {
    actions: {
      onEnter: () => {
        console.log('IDLE: onEtner')
      },
      onExit: () => {
        console.log('IDLE: onExit')
      },
    },
    transitions: {
      startTurn: {
        target: EState.ACTIVE,
        action: () => {
          console.log('transition action startTurn in IDLE state')
        }
      }
    }
  }
})