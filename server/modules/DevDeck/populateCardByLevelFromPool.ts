import { ICardShape } from "../../../interfaces/card";
import { EDeckLevel } from "../../../interfaces/devDeck";

export const populateCardsByLevelFromPool = (cardsPool: ICardShape[]) => {
  return Object.values(EDeckLevel).reduce((acc, lvl) => {
    acc[lvl] = cardsPool.filter((card)=>card.lvl === lvl);
    return acc;
  }, {

  } as { [key in EDeckLevel]: ICardShape[] })
}