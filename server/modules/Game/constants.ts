import { IGameConfig } from "../../../interfaces/game";
import { EGemColor } from "../../../interfaces/gem";
import { getCardsFromCSV } from "../Card/getCardsFromCSV";
import { populateCardsByLevelFromPool } from "../DevDeck/populateCardByLevelFromPool";

export const PLAYER_MAX_GEMS_LIMIT = 10;
export const TAKE_GEM_LIMIT = 3;
export const TAKE_GEM_LIMIT_SAME_COLOR = 2;
export const GEMS_IN_STOCK_LIMIT = 4;

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