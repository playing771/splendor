import { createStateMachine } from "."
import { TStateMachineDefinition } from "./models";

type TState = 'IDLE' | 'ACTIVE' | 'FINISHED';
type TTransition = 'activate' | 'finish' | 'sleep';

const smDefinition: TStateMachineDefinition<TState, TTransition> = {
  IDLE: {
    transitions: {
      activate: {
        action: () => null,
        target: 'ACTIVE'
      }
    }
  },
  ACTIVE: {
    transitions: {
      finish: {
        action: () => null,
        target: 'FINISHED'
      }
    }
  },
  FINISHED: {
    transitions: {
      sleep: {
        action: () => null,
        target: 'IDLE'
      }
    }
  },
} as const

describe('StateMachine functionality', () => {

  it('has initial state', () => {
    const sm = createStateMachine('IDLE', smDefinition);
    expect(sm.value).toBe('IDLE')
  })

  it('changes state after transition', () => {
    const sm = createStateMachine('IDLE', smDefinition);
    sm.transition('activate');
    expect(sm.value).toBe('ACTIVE');
    sm.transition('finish');
    expect(sm.value).toBe('FINISHED');
    sm.transition('sleep');
    expect(sm.value).toBe('IDLE');
    sm.transition('activate');
    expect(sm.value).toBe('ACTIVE');
  })

  it('calls actions before/after transition state', () => {
    const onExitMocked = jest.fn();
    const onEnterMocked = jest.fn();
    const onActionMocked = jest.fn();

    smDefinition.IDLE.actions = {
      onExit: onExitMocked
    }
    smDefinition.ACTIVE.actions = {
      onEnter: onEnterMocked
    }
    smDefinition.IDLE.transitions.activate!.action = onActionMocked;
  
    const sm = createStateMachine('IDLE', smDefinition);
    sm.transition('activate');

    expect(onExitMocked).toBeCalled();
    expect(onActionMocked).toBeCalled();
    expect(onEnterMocked).toBeCalled();
    jest.clearAllMocks();
  })
})