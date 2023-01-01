import { TStateMachineDefinition } from "./models";

const createLogStateTranzition =
  (state: string, variant: 'to' | 'from', context: string) => () =>
    console.log(`${context} ${state} ${variant === 'to' ? 'BEGINS' : 'ENDS'}`);

export const addStateLogger = (smDefinition: TStateMachineDefinition, context: string = '') => {
  return
  // mutating actions object
  Object.keys(smDefinition).forEach((state) => {
    // persisting original onExit onEnter callbacks
    const originalOnExit = smDefinition[state].actions?.onExit;
    const originalOnEnter = smDefinition[state].actions?.onEnter;
    smDefinition[state].actions = {
      onExit: () => {
        createLogStateTranzition(state, 'from', context)();
        originalOnExit && originalOnExit()
      },
      onEnter: () => {
        createLogStateTranzition(state, 'to', context)();
        originalOnEnter && originalOnEnter();
      },
    };
  })
}