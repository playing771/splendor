import { createStateMachine } from '.';
import { TStateMachineDefinition } from './models';

type TState = 'IDLE' | 'ACTIVE' | 'FINISHED';
type TTransition = 'activate' | 'finish' | 'sleep';

const smDefinition: TStateMachineDefinition<TState, TTransition> = {
  IDLE: {
    transitions: {
      activate: {
        target: 'ACTIVE',
      },
    },
  },
  ACTIVE: {
    transitions: {
      finish: {
        action: () => true,
        target: 'FINISHED',
      },
    },
  },
  FINISHED: {
    transitions: {
      sleep: {
        action: () => true,
        target: 'IDLE',
      },
    },
  },
} as const;

describe('StateMachine functionality', () => {
  it('has initial state', () => {
    const sm = createStateMachine('IDLE', smDefinition);
    expect(sm.value).toBe('IDLE');
  });

  it('changes state after dispatchTransition', () => {
    const sm = createStateMachine('IDLE', smDefinition);
    sm.dispatchTransition('activate');
    expect(sm.value).toBe('ACTIVE');
    sm.dispatchTransition('finish');
    expect(sm.value).toBe('FINISHED');
    sm.dispatchTransition('sleep');
    expect(sm.value).toBe('IDLE');
    sm.dispatchTransition('activate');
    expect(sm.value).toBe('ACTIVE');
  });

  it('calls actions before/after dispatchTransition state', () => {
    const onExitMocked = jest.fn();
    const onEnterMocked = jest.fn();
    const onActionMocked = jest.fn().mockReturnValue(true);

    smDefinition.IDLE.actions = {
      onExit: onExitMocked,
    };
    smDefinition.ACTIVE.actions = {
      onEnter: onEnterMocked,
    };

    smDefinition.IDLE.transitions.activate!.action = onActionMocked;

    const sm = createStateMachine('IDLE', smDefinition);
    sm.dispatchTransition('activate');

    expect(onExitMocked).toBeCalled();
    expect(onActionMocked).toBeCalled();
    expect(onEnterMocked).toBeCalled();
    jest.clearAllMocks();
  });
});
