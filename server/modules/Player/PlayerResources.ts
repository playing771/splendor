import { ICardShape, TCardCost } from '../../../interfaces/card';
import { EGemColor } from '../../../interfaces/gem';
import { INobleShape } from '../../../interfaces/noble';
import { TPlayerCardsBought, TPlayerGems } from '../../../interfaces/player';
import { getKeys } from '../../../utils/typescript';
import { countTokens } from '../Game/countTokens';

export abstract class PlayerResources {
  cardsBought: TPlayerCardsBought;
  cardsHolded: ICardShape[];
  nobles: INobleShape[];
  gems: TPlayerGems;

  constructor({
    cardsBought: initialCardsBought = {} as TPlayerCardsBought,
    cardsHolded = [] as ICardShape[],
    nobles = [] as INobleShape[],
    gems: initialGems = {} as TPlayerGems
  }: {
    cardsBought: Partial<TPlayerCardsBought>;
    cardsHolded: ICardShape[];
    nobles: INobleShape[];
    gems: TPlayerGems
  }) {

    this.gems = Object.values(EGemColor).reduce((acc, color) => {
      acc[color] = initialGems[color] || 0;
      return acc;
    }, {} as TPlayerGems);

    this.cardsBought = Object.values(EGemColor).reduce((acc, color) => {
      acc[color] = initialCardsBought[color] || [];
      return acc;
    }, {} as TPlayerCardsBought);

    this.cardsHolded = cardsHolded;
    this.nobles = nobles;
  }

  private calculateGemsFromBoughtCards(color: EGemColor) {
    return this.cardsBought[color].length;
  }

  private calculateScoreFromBoughtCards(color: EGemColor) {
    return this.cardsBought[color].reduce(
      (total, card) => (total += card.score),
      0
    );
  }

  get gemsCount() {
    return countTokens(this.gems);
  }

  get cardsHoldedCount() {
    return this.cardsHolded.length;
  }

  get cardsBoughtCount() {
    return Object.values(this.cardsBought).reduce(
      (count, arr) => (count += arr.length),
      0
    );
  }

  get gemsFromCardsBought() {
    return getKeys(this.cardsBought).reduce((acc, color) => {
      acc[color] = this.calculateGemsFromBoughtCards(color);
      return acc;
    }, {} as TCardCost);
  }

  get getAllGemsAvailable(){
    const gemsFromCards = this.gemsFromCardsBought;
    
    return getKeys(EGemColor).reduce((acc, color)=> {
      acc[color] += gemsFromCards[color] || 0;
      return acc
    }, {...this.gems})
  }

  get score() {
    const cardsScore = getKeys(this.cardsBought).reduce((total, color) => {
      return (total += this.calculateScoreFromBoughtCards(color));
    }, 0);

    const noblesScore = this.nobles.reduce(
      (total, noble) => (total += noble.score),
      0
    );
    return cardsScore + noblesScore;
  }
}
