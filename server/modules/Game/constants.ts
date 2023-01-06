import { IGameConfig } from "../../../interfaces/game";
import { ETokenColor } from "../../../interfaces/token";
import { getCardsFromCSV } from "../Card/getCardsFromCSV";
import { populateCardsByLevelFromPool } from "../DevDeck/populateCardByLevelFromPool";

export const TOKENS_LIMIT = 10;

const cardsPool = getCardsFromCSV();

export const DEFAULT_GAME_SETUP: IGameConfig = {
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