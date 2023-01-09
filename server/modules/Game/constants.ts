import { IGameConfig } from "../../../interfaces/game";
import { EGemColor } from "../../../interfaces/gem";
import { getCardsFromCSV } from "../Card/getCardsFromCSV";
import { populateCardsByLevelFromPool } from "../DevDeck/populateCardByLevelFromPool";

export const TOKENS_LIMIT = 10;

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