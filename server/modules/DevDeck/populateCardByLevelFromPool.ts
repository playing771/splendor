import { ICardShape } from "../../../interfaces/card";
import { EDevDeckLevel } from "../../../interfaces/devDeck";

export const populateCardsByLevelFromPool = (cardsPool: ICardShape[]) => {
  return Object.values(EDevDeckLevel).reduce((acc, lvl) => {
    acc[lvl] = cardsPool.filter((card)=>card.lvl === lvl);
    return acc;
  }, {

  } as { [key in EDevDeckLevel]: ICardShape[] })
}