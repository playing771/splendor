import { IGameStateDTO } from '../../interfaces/api';
import { EPlayerAction } from '../../interfaces/game';
import { Game } from '../modules/Game';
import { DEFAULT_GAME_SETUP } from '../modules/Game/constants';
import { connectionService } from './ConnectionService';
import { userService } from './UserService';

export class GameService {
  public games: Game[];

  constructor(games: Game[] = []) {
    this.games = games;
  }

  create() {
    const users = userService.users;
    const game = new Game({
      players: users,
      ...DEFAULT_GAME_SETUP,
    });
    this.games = [game]; // TODO:
    return this.games[this.games.length - 1];
  }

  spectate(userId:string){
    const game = this.games[0];
    if (!game.spectators.includes(userId)){
      game.spectators.push(userId);
    }
  }

  remove(id: string) {
    this.games = this.games.filter((game) => game.id !== id);
  }

  get(id: string) {
    const game = this.games.find((game) => game.id === id);
    if (!game) throw Error(`no game with ID ${id}`);
    return game;
  }

  getGameState(userId: string) {
    const currentGame = this.games[0]; // TODO:
    if (!currentGame) {
      throw Error('Game doesnt exists')
    }
    const { players, table } = currentGame.getSafeState();
    const isPlayer = currentGame.players.some((player)=>player.id === userId);
    const availableActions = isPlayer? currentGame.getPlayerAvailableActions(userId): [];

    const playerState = isPlayer? currentGame.getPlayer(userId).state: null;

    const state: IGameStateDTO = {
      availableActions,
      players,
      table,
      playerState,
      isPlayerActive: currentGame.checkPlayerIsActive(userId),
      gameResults: currentGame.getGameResults()
    };

    return state;
  }

  dispatch(action: EPlayerAction, userId: string, data?: any) {
    const ws = connectionService.get(userId);

    if (!ws) throw Error(`no connection for user ID ${userId}`);

    const currentGame = this.games[0]; // TODO:

    currentGame.dispatch(userId, action, data);

    const observers = currentGame.players.map((player)=>player.id).concat(currentGame.spectators);

    for (const id of observers) {
      const connection = connectionService.get(id);

      const gameState = this.getGameState(id);
      const message = JSON.stringify(gameState);

      connection.send(message);
    }
  }
}

export const gameService = new GameService();
