import { ICardShape } from '../interfaces/card';
import { EDeckLevel } from '../interfaces/devDeck';
import { EPlayerAction, IGameConfig, IGameShape } from '../interfaces/game';
import { ETokenColor } from '../interfaces/token';
import { Api } from './api';
import { getCardsFromCSV } from './modules/Card/getCardsFromCSV';
import { populateCardsByLevelFromPool } from './modules/DevDeck/populateCardByLevelFromPool';
import { Game } from './modules/Game';
import { DEFAULT_GAME_SETUP } from './modules/Game/constants';

Api();

const game = new Game({
  ...DEFAULT_GAME_SETUP,
  players: [
    {
      id: 'ONE',
      name: 'max',
    },
    // {
    //   id: 'TWO',
    //   name: 'andy',
    // },
  ],
});

// game.move()
game.dispatchPlayerAction('ONE', EPlayerAction.EndTurn);
game.dispatchPlayerAction('ONE', EPlayerAction.EndTurn);


// game.dispatchPlayerAction('TWO', EPlayerAction.EndTurn);
// game.dispatchPlayerAction('ONE', EPlayerAction.EndTurn);


// console.log(game.smPlayers)
// console.log(game.sm);
