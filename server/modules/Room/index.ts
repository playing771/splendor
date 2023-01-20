import { ERoomState, IRoomConfig, IRoomShape } from '../../../interfaces/room';
import { Nullable } from '../../../utils/typescript';
import { v4 as uuidv4 } from 'uuid';
import { EUserRole, IUser } from '../../../interfaces/user';

export class Room implements IRoomShape {
  id: string;
  name: string;
  users: IUser[];
  owner: IUser;
  state: ERoomState;
  gameId: Nullable<string>;

  constructor({ id, users, name, owner, gameId }: IRoomConfig) {
    this.id = id || uuidv4();
    this.users = users || [];
    this.owner = owner;
    this.name = name || '';
    this.gameId = gameId || null;
    this.state = ERoomState.Pending;
  }

  public joinAsPlayer(user: IUser) {
    this.users.push(user);
  }

  public joinAsSpectator(user: IUser) {
    this.users.push(user);
  }

  public leave(userId: string) {
    const targetPlayerIndex = this.users.findIndex(
      (player) => player.id === userId
    );
    if (~targetPlayerIndex) {
      this.users.splice(targetPlayerIndex, 1);
    }
  }

  public startGame(gameId: string) {
    if (this.state !== ERoomState.Pending) {
      throw Error(
        `Cant start a game in room ${this.id} in ${this.state} state`
      );
    }
    this.state = ERoomState.Started;
    this.gameId = gameId;
  }

  public endGame() {
    if (this.state !== ERoomState.Pending) {
      throw Error(`Cant end a game in room ${this.id} in ${this.state} state`);
    }
    this.state = ERoomState.Finished;
  }

  public hasPlayer(userId:string) {
    return this.players.some(player=>player.id === userId);
  }

  public hasSpectator(userId:string) {
    return this.spectators.some(player=>player.id === userId);
  }
  
  public hasUser(userId:string) {
    return this.users.some((user)=>user.id === userId);
  }

  get players(){
    return this.users.filter((user)=>user.role === EUserRole.Player);
  }

  get spectators(){
    return this.users.filter((user)=>user.role === EUserRole.Spectator);
  }
}
