import { EPLayerState, IGameConfig } from "../../../interfaces/game";
import { EGemColor } from "../../../interfaces/gem";
import { getCardsFromCSV } from "../Card/getCardsFromCSV";
import { populateCardsByLevelFromPool } from "../DevDeck/populateCardByLevelFromPool";

export const PLAYER_GEMS_MAX = 10;
export const PLAYER_CARDS_HOLDED_MAX = 3;

export const TAKE_GEM_LIMIT = 3;
export const TAKE_GEM_LIMIT_SAME_COLOR = 2;
export const GEMS_IN_STOCK_LIMIT = 4;

export const GOLD_GEMS_FOR_CARD_HOLD = 1;

export const SCORE_TO_END_GAME = 15;

export const STATES_AVAILABLE_FOR_ACTION: { [key in EPLayerState]: boolean } = {
  [EPLayerState.Idle]: false,
  [EPLayerState.Active]: true,
  [EPLayerState.OutOfAction]: true,
  [EPLayerState.TooManyGems]: true,
};


const cardsPool = getCardsFromCSV();

export const DEFAULT_GAME_SETUP: IGameConfig = {
  tableConfig: {
    initialCardsOnTableCount: 4,

    [EGemColor.Black]: 8,
    [EGemColor.Blue]: 8,
    [EGemColor.Gold]: 5,
    [EGemColor.Green]: 8,
    [EGemColor.Red]: 8,
    [EGemColor.White]: 8,

    ...populateCardsByLevelFromPool(cardsPool),
  },
};