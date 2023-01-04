import { ICardShape } from '../interfaces/card';
import { EDevDeckLevel } from '../interfaces/devDeck';
import { IGameConfig, IGameShape } from '../interfaces/game';
import { ETokenColor } from '../interfaces/token';
import { Api } from './api';
import { getCardsFromCSV } from './modules/Card/getCardsFromCSV';
import { populateCardsByLevelFromPool } from './modules/DevDeck/populateCardByLevelFromPool';
import { Game } from './modules/Game';





Api()

// game.act()