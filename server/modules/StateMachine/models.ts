export type TStateMachineDefinition<S extends PropertyKey = string, T extends PropertyKey = string> = {
  [key in S]: IStateMachineState<S, T>
}

export interface IStateMachineState<S, T extends PropertyKey> {
  actions?: IStateMachineActions
  transitions: Partial<{
    [key in T]: IStateMachineTransition<S>
  }>
}

export interface IStateMachineActions {
  onEnter?: () => void;
  onExit?: () => void;
}

export interface IStateMachineTransition<S> {
  target: S,
  action?: (data?: string) => boolean;
}

export interface IStateMachine<S extends PropertyKey = string,T extends PropertyKey = string> {
  value: S;
  dispatchTransition: (event: T, data?: string) => void;
  definition: TStateMachineDefinition<S,T>
}