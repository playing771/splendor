import { EPLayerState, IGameConfig, IGameSetup } from "../../../interfaces/game";
import { populateCardsByLevelFromPool } from "../DevDeck/populateCardByLevelFromPool";
import { getCardsFromCSV, getNoblesFromCSV } from '../../utils/csv';
import { INITIAL_CARDS_ON_TABLE_COUNT } from "../../../gameRules";

export const STATES_AVAILABLE_FOR_ACTION: { [key in EPLayerState]: boolean } = {
  [EPLayerState.Idle]: false,
  [EPLayerState.Active]: true,
  [EPLayerState.OutOfAction]: true,
  [EPLayerState.TooManyGems]: true,
};


const cardsPool = getCardsFromCSV();
const noblesPool = getNoblesFromCSV();

export const GAME_SETUP: Map<number, IGameSetup> = new Map();
GAME_SETUP.set(1, { gems: 7, nobles: 4 });
GAME_SETUP.set(2, { gems: 4, nobles: 3 });
GAME_SETUP.set(3, { gems: 5, nobles: 4 });
GAME_SETUP.set(4, { gems: 7, nobles: 5 });

export const DEFAULT_GAME_CONFIG: IGameConfig = {
  setup: GAME_SETUP,
  tableConfig: {
    initialCardsOnTableCount: INITIAL_CARDS_ON_TABLE_COUNT,
    nobles: noblesPool,
    decks: {
      ...populateCardsByLevelFromPool(cardsPool),
    }
  },
};