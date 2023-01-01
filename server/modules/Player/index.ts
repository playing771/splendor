import { ICardShape, TCardCost } from '../../interfaces/card';
import { ETokenColor } from '../../interfaces/token';
import {
  IPlayerConfig,
  IPlayerShape,
  TPlayerCardsBought,
  TPlayerTokens,
} from '../../interfaces/player';
import { countTokens } from '../Game/countTokens';
import { getKeys } from '../../../utils/typescript';

export class Player implements IPlayerShape {
  tokens: TPlayerTokens;
  cardsBought: TPlayerCardsBought;
  cardsHolded: ICardShape[];
  name: string;
  id: string;

  constructor({
    name,
    id,
    tokens: initialTokens = {} as TPlayerTokens,
    cardsBought: initialCardsBought = {} as TPlayerCardsBought
  }: IPlayerConfig) {
    this.tokens = Object.values(ETokenColor).reduce((acc, color) => {
      acc[color] = initialTokens[color] || 0;
      return acc;
    }, {} as TPlayerTokens);

    this.cardsBought = Object.values(ETokenColor).reduce((acc, color) => {
      acc[color] = initialCardsBought[color] || [];
      return acc;
    }, {} as TPlayerCardsBought);

    this.cardsHolded = [];
    this.name = name;
    this.id = id;
  }

  getTokens(color: ETokenColor, count: number): void {
    this.tokens[color] += count;
  }

  spendTokens(color: ETokenColor, count: number): void {
    if (count > this.tokens[color]) {
      throw Error(
        `Player (id=${this.id}) doesn't have ${count} ${color} tokens `
      );
    }
    this.tokens[color] -= count;
  }

  payCost(cost: TCardCost) {
    const extraTokens = this.tokensFromCardsBought;
    for (const color of getKeys(cost)) {
      const tokensToSpend = Math.max(
        (cost[color] || 0) - (extraTokens[color] || 0),
        0
      );

      this.spendTokens(color, tokensToSpend);
    }
  }

  buyCard(card: ICardShape) {
    const { cost, color } = card;
    this.payCost(cost);
    this.cardsBought[color].push(card);
  }

  private calculateTokensFromBoughtCards(color: ETokenColor) {
    return this.cardsBought[color].length;
  }

  get tokensCount() {
    return countTokens(this.tokens);
  }

  get cardsHoldedCount() {
    return this.cardsHolded.length;
  }

  get tokensFromCardsBought() {
    return getKeys(this.cardsBought).reduce((acc, color) => {
      acc[color] = this.calculateTokensFromBoughtCards(color);
      return acc;
    }, {} as TCardCost);
  }
}
