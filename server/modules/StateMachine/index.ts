import { IStateMachine, TStateMachineDefinition } from "./models";



export const createStateMachine = <S extends PropertyKey, T extends PropertyKey>(initialState: S, smDefinition: TStateMachineDefinition<S, T>) => {
  const stateMachine: IStateMachine<S,T> = {
    value: initialState,
    dispatchTransition: (event: T) => {
      const currentState = stateMachine.value;
      const currentStateMachineDefinition = smDefinition[currentState];

      const targetTransition = currentStateMachineDefinition.transitions[event];
      if (!targetTransition) {
        throw Error(`no transition for event: ${event as string} in currentState: ${currentState as string}`)
      }
      
      const targetStateMachineState = targetTransition.target;
      const targetStateMachineDefinition = smDefinition[targetStateMachineState];
      
      
      
      currentStateMachineDefinition.actions?.onExit && currentStateMachineDefinition.actions.onExit();
      stateMachine.value = targetStateMachineState;
      targetStateMachineDefinition.actions?.onEnter && targetStateMachineDefinition.actions.onEnter();
      targetTransition.action && targetTransition.action();
      // console.log('stateMachine',stateMachine);
      
    },
    definition: smDefinition
  }

  return stateMachine;
}
