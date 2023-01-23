import { v4 as uuidv4 } from 'uuid';
import { IGameStateDTO, IMessage } from '../../../interfaces/api';
import { EPlayerAction } from '../../../interfaces/game';
import { EGemColor } from '../../../interfaces/gem';
import { TPlayerGems } from '../../../interfaces/player';
import { EUserRole, IUser } from '../../../interfaces/user';
import { Nullable } from '../../../utils/typescript';

export class GameBot implements IUser {
  id: string;
  name: string;
  role: Nullable<EUserRole>;
  dispatch: (
    gameId: string,
    action: EPlayerAction,
    userId: string,
    data?: unknown
  ) => any;
  gameId: string;
  gameState: IGameStateDTO;

  constructor(
    name: string,
    dispatch: (
      gameId: string,
      action: EPlayerAction,
      userId: string,
      data?: unknown
    ) => any
  ) {
    this.id = uuidv4();
    this.name = name;
    this.role = EUserRole.Player;
    this.dispatch = dispatch;
    this.updateGameState = this.updateGameState.bind(this);
  }

  public updateGameState(state: IMessage<IGameStateDTO>) {
    try {
      console.log('GameBot updateGameState', state);
      if (!state.data) {
        throw Error(`Wrong contract in messaging with bot`);
      }
      this.gameState = state.data;
      this.act();
    } catch (error) {
      console.log('BOT ERROR:', error);
    }
  }

  public attachToGame(gameId: string) {
    this.gameId = gameId;
  }

  get canAct() {
    return this.gameState.isPlayerActive;
  }

  get canTakeGems() {
    return (
      this.canAct &&
      this.gameState.availableActions.includes(EPlayerAction.TakeGems)
    );
  }

  get canOnlyEndTurn() {
    return (
      this.canAct &&
      this.gameState.availableActions.length === 1 &&
      this.gameState.availableActions.includes(EPlayerAction.EndTurn)
    );
  }

  private act() {
    const _dispatch = (action: EPlayerAction, data?: unknown) =>
      this.dispatch(this.gameId, action, this.id, data);

    if (this.canOnlyEndTurn) {
      _dispatch(EPlayerAction.EndTurn);
    }

    if (this.canTakeGems) {
      _dispatch(EPlayerAction.TakeGems, {
        [EGemColor.Black]: 1,
      } as TPlayerGems);
    }
  }
}
