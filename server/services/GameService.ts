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
    this.games.push(game);
    return this.games[this.games.length - 1];
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
    const safeState = currentGame.getSafeState();
    const availableActions = currentGame.getPlayerAvailableActions(userId);
    const gameState = {
      actions: availableActions,
      state: safeState,
      isYourTurn: currentGame.checkPlayerIsActive(userId),
    };

    return gameState;
  }

  dispatch(action: EPlayerAction, userId: string, data?: any) {
    const ws = connectionService.get(userId);

    if (!ws) throw Error(`no connection for user ID ${userId}`);

    const currentGame = this.games[0]; // TODO:

    switch (action) {
      case EPlayerAction.TakeTokens:
        currentGame.giveTokensToPlayer(userId, data);
        break;

      default:
        // TODO: make same as TakeTokens
        currentGame.dispatchPlayerAction(userId, action, data);
        break;
    }

    for (const { id } of currentGame.players) {
      const connection = connectionService.get(id);

      const gameState = this.getGameState(id);
      const message = JSON.stringify(gameState);

      connection.send(message);
    }
  }
}

export const gameService = new GameService();
