import { v4 as uuidv4 } from 'uuid';
import { IGameConfig } from '../../interfaces/game';
import { ETokenColor } from '../../interfaces/token';
import { getCardsFromCSV } from '../modules/Card/getCardsFromCSV';
import { populateCardsByLevelFromPool } from '../modules/DevDeck/populateCardByLevelFromPool';
import { Game } from '../modules/Game';
import { userService, UserService } from './UserService';


const cardsPool = getCardsFromCSV();

const DEFAULT_GAME_SETUP: IGameConfig = {
  tableConfig: {
    initialCardsOnTableCount: 4,

    [ETokenColor.Black]: 8,
    [ETokenColor.Blue]: 8,
    [ETokenColor.Gold]: 5,
    [ETokenColor.Green]: 8,
    [ETokenColor.Red]: 8,
    [ETokenColor.White]: 8,

    ...populateCardsByLevelFromPool(cardsPool),
  },
};

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
    return this.games[this.games.length -1];
  }

  remove(id: string) {
    this.games = this.games.filter((usr)=>usr.id !== id);
  }

  get(id: string) {
    const game = this.games.find((usr)=>usr.id === id);
    if (!game) throw Error(`no game with ID ${id}`)
    return game;
  }
}

export const gameService = new GameService();