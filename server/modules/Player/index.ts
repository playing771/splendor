import { ICardShape, TCardCost } from '../../../interfaces/card';
import { EGemColor } from '../../../interfaces/gem';
import {
  IPlayerConfig,
  IPlayerShape,
  TPlayerCardsBought,
  TPlayerGems,
} from '../../../interfaces/player';
import { countTokens } from '../Game/countTokens';
import { getKeys } from '../../../utils/typescript';
import { PLAYER_CARDS_HOLDED_MAX } from '../Game/constants';

export class Player implements IPlayerShape {
  gems: TPlayerGems;
  cardsBought: TPlayerCardsBought;
  cardsHolded: ICardShape[];
  name: string;
  id: string;

  constructor({
    name,
    id,
    gems: initialTokens = {} as TPlayerGems,
    cardsBought: initialCardsBought = {} as TPlayerCardsBought,
    cardsHolded = []
  }: IPlayerConfig) {
    this.gems = Object.values(EGemColor).reduce((acc, color) => {
      acc[color] = initialTokens[color] || 0;
      return acc;
    }, {} as TPlayerGems);

    this.cardsBought = Object.values(EGemColor).reduce((acc, color) => {
      acc[color] = initialCardsBought[color] || [];
      return acc;
    }, {} as TPlayerCardsBought);

    this.cardsHolded = cardsHolded;
    this.name = name;
    this.id = id;
  }

  getGems(color: EGemColor, count: number): void {
    this.gems[color] += count;
  }

  spendTokens(color: EGemColor, count: number): void {
    this.gems[color] -= count;
  }

  payCost(cost: TCardCost) {
    const extraGems = this.gemsFromCardsBought;

    const gemsSpent = Object.values(EGemColor).reduce((acc, color) => {
      acc[color] = 0;
      return acc;
    }, {} as TPlayerGems);

    for (const color of getKeys(cost)) {

      let nonGoldTokensToSpend = Math.max(
        (cost[color] || 0) - (extraGems[color] || 0),
        0
      );
        
      if (nonGoldTokensToSpend > this.gems[color]) {

        const goldTokensToSpend = nonGoldTokensToSpend - this.gems[color];

        if (goldTokensToSpend > this.gems[EGemColor.Gold]) {
          throw Error(
            `Player (id=${this.id}) doesn't have ${nonGoldTokensToSpend} ${color} gems or enough ${EGemColor.Gold} gems`
          );
        }
        
        this.spendTokens(EGemColor.Gold,goldTokensToSpend);
        gemsSpent[EGemColor.Gold] += goldTokensToSpend;

        nonGoldTokensToSpend -= goldTokensToSpend;
      }

      this.spendTokens(color, nonGoldTokensToSpend);
      gemsSpent[color] += nonGoldTokensToSpend;
    }
    
    return gemsSpent;
  }

  buyCard(card: ICardShape) {
    const { cost, color } = card;
    const gemsSpent = this.payCost(cost);
    this.cardsBought[color].push(card);

    return gemsSpent;
  }

  holdCard(card: ICardShape) {
    if (this.cardsHolded.length >= PLAYER_CARDS_HOLDED_MAX) {
      throw Error(`Cant hold a card: ${this.cardsHolded.length} exceeds ${PLAYER_CARDS_HOLDED_MAX} of cards holded limit`);
    }
    this.cardsHolded.push(card);
  }

  private calculateTokensFromBoughtCards(color: EGemColor) {
    return this.cardsBought[color].length;
  }

  get gemsCount() {
    return countTokens(this.gems);
  }

  get cardsHoldedCount() {
    return this.cardsHolded.length;
  }

  get gemsFromCardsBought() {
    return getKeys(this.cardsBought).reduce((acc, color) => {
      acc[color] = this.calculateTokensFromBoughtCards(color);
      return acc;
    }, {} as TCardCost);
  }

  get state(): IPlayerShape {
    return {
      id: this.id,
      cardsBought: this.cardsBought,
      cardsHolded: this.cardsHolded,
      name: this.name,
      gems: this.gems,
      gemsCount: this.gemsCount
    }
  }
}
