import { v4 as uuidv4 } from 'uuid';
import { EPlayerAction, IGameConfig } from '../../interfaces/game';
import { ETokenColor } from '../../interfaces/token';
import { getCardsFromCSV } from '../modules/Card/getCardsFromCSV';
import { populateCardsByLevelFromPool } from '../modules/DevDeck/populateCardByLevelFromPool';
import { Game } from '../modules/Game';
import { DEFAULT_GAME_SETUP } from '../modules/Game/constants';
import { connectionService } from './ConnectionService';
import { userService, UserService } from './UserService';






export class GameService {
  public games: Game[]

  constructor(games: Game[] = []) {
    this.games = games;
  }

  create() {
    const users = userService.users;
    const game = new Game({
      players: users,
      ...DEFAULT_GAME_SETUP,
    });
    this.games.push(game)
    return this.games[this.games.length - 1];
  }

  remove(id: string) {
    this.games = this.games.filter((game) => game.id !== id);
  }

  get(id: string) {
    const game = this.games.find((game) => game.id === id);
    if (!game) throw Error(`no game with ID ${id}`)
    return game;
  }

  dispatch(action: EPlayerAction, userId: string) {
    const ws = connectionService.get(userId)

    if (!ws) throw Error(`no connection for user ID ${userId}`)


    const currentGame = this.games[0]; // TODO: 

    currentGame.dispatchPlayerAction(userId, action);
    const safeState = currentGame.getSafeState();
    const connections = connectionService.getAll();

    for (const connection of connections) {
      const availableActions = currentGame.getPlayerAvailableActions(userId);
      const message = {
        actions: availableActions,
        state: safeState
      }
      ws.send(JSON.stringify(message));
    }
    
    
    
  }
}

export const gameService = new GameService();