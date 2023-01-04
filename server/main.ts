import { ICardShape } from '../interfaces/card';
import { EDevDeckLevel } from '../interfaces/devDeck';
import { IGameConfig } from '../interfaces/game';
import { ETokenColor } from '../interfaces/token';
import { getCardsFromCSV } from './modules/Card/getCardsFromCSV';
import { populateCardsByLevelFromPool } from './modules/DevDeck/populateCardByLevelFromPool';
import { Game } from './modules/Game';

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

const game = new Game({
  players: [{ id: 'fd', name: 'Max' }],
  ...DEFAULT_GAME_SETUP,
});



game.move();

console.log(game.getPlayerAvailableActions('fd'))

// game.act()