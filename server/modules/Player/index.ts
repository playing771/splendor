import { ICardShape, TCardCost } from '../../../interfaces/card';
import { EGemColor } from '../../../interfaces/gem';
import {
  IPlayerConfig,
  IPlayerShape,
  TPlayerCardsBought,
  TPlayerGems,
} from '../../../interfaces/player';
import { getKeys } from '../../../utils/typescript';
import { PLAYER_CARDS_HOLDED_MAX } from '../../../gameRules';
import { INobleShape } from '../../../interfaces/noble';
import { PlayerResources } from './PlayerResources';

export class Player extends PlayerResources implements IPlayerShape {
  // gems: TPlayerGems;
  // cardsBought: TPlayerCardsBought;
  // cardsHolded: ICardShape[];
  name: string;
  id: string;
  // nobles: INobleShape[];

  constructor({
    name,
    id,
    gems = {},
    cardsBought = {} as TPlayerCardsBought,
    cardsHolded = [] as ICardShape[],
    nobles = [] as INobleShape[],
  }: IPlayerConfig) {
    super({ cardsBought, cardsHolded, nobles, gems: gems as TPlayerGems });

    // this.gems = Object.values(EGemColor).reduce((acc, color) => {
    //   acc[color] = initialTokens[color] || 0;
    //   return acc;
    // }, {} as TPlayerGems);

    // this.cardsBought = Object.values(EGemColor).reduce((acc, color) => {
    //   acc[color] = initialCardsBought[color] || [];
    //   return acc;
    // }, {} as TPlayerCardsBought);

    // this.cardsHolded = cardsHolded;
    this.name = name;
    this.id = id;
    // this.nobles = nobles;
  }

  public getGems(color: EGemColor, count: number): void {
    this.gems[color] += count;
  }

  public spendGems(color: EGemColor, count: number): void {
    this.gems[color] -= count;
  }

  public calculateGemsToSpend(cost: TCardCost) {
    const extraGems = this.gemsFromCardsBought;

    const gemsToSpend = Object.values(EGemColor).reduce((acc, color) => {
      acc[color] = 0;
      return acc;
    }, {} as TPlayerGems);

    for (const color of getKeys(cost)) {
      let nonGoldTokensToSpend = Math.max(
        (cost[color] || 0) - (extraGems[color] || 0),
        0
      );

      if (nonGoldTokensToSpend > this.gems[color] - gemsToSpend[color]) {
        const goldTokensToSpend =
          nonGoldTokensToSpend - this.gems[color] - gemsToSpend[color];

        if (
          goldTokensToSpend >
          this.gems[EGemColor.Gold] - gemsToSpend[EGemColor.Gold]
        ) {
          throw Error(
            `Player (id=${this.id}) doesn't have ${nonGoldTokensToSpend} ${color} gems or enough ${EGemColor.Gold} gems`
          );
        }

        gemsToSpend[EGemColor.Gold] += goldTokensToSpend;

        nonGoldTokensToSpend -= goldTokensToSpend;
      }

      gemsToSpend[color] += nonGoldTokensToSpend;
    }

    return gemsToSpend;
  }

  public buyCard(card: ICardShape) {
    const { cost, color } = card;
    const gemsToSpent = this.calculateGemsToSpend(cost);
    Object.entries(gemsToSpent).forEach(([color, count]) => {
      this.spendGems(color as EGemColor, count);
    });
    this.cardsBought[color].push(card);

    return gemsToSpent;
  }

  public buyHoldedCard(card: ICardShape) {
    const gemsSpent = this.buyCard(card);
    this.cardsHolded = this.cardsHolded.filter(
      (holdedCard) => holdedCard.id !== card.id
    );

    return gemsSpent;
  }

  public holdCard(card: ICardShape) {
    if (this.cardsHolded.length >= PLAYER_CARDS_HOLDED_MAX) {
      throw Error(
        `Cant hold a card: ${this.cardsHolded.length} exceeds ${PLAYER_CARDS_HOLDED_MAX} of cards holded limit`
      );
    }
    this.cardsHolded.push(card);
  }

  public earnNoble(noble: INobleShape) {
    this.nobles.push(noble);
  }

  // private calculateGemsFromBoughtCards(color: EGemColor) {
  //   return this.cardsBought[color].length;
  // }

  // private calculateScoreFromBoughtCards(color: EGemColor) {
  //   return this.cardsBought[color].reduce((total, card) => total += card.score, 0);
  // }

  // get gemsCount() {
  //   return countTokens(this.gems);
  // }

  // get cardsHoldedCount() {
  //   return this.cardsHolded.length;
  // }

  // get cardsBoughtCount() {
  //   return Object.values(this.cardsBought).reduce((count, arr) => count += arr.length, 0);
  // }

  // get gemsFromCardsBought() {
  //   return getKeys(this.cardsBought).reduce((acc, color) => {
  //     acc[color] = this.calculateGemsFromBoughtCards(color);
  //     return acc;
  //   }, {} as TCardCost);
  // }

  // get score() {
  //   const cardsScore = getKeys(this.cardsBought).reduce((total, color) => {
  //     return total += this.calculateScoreFromBoughtCards(color)
  //   }, 0);

  //   const noblesScore = this.nobles.reduce((total, noble) => total += noble.score, 0)
  //   return cardsScore + noblesScore
  // }

  get state(): IPlayerShape {
    return {
      id: this.id,
      cardsBought: this.cardsBought,
      cardsHolded: this.cardsHolded,
      name: this.name,
      gems: this.gems,
      gemsCount: this.gemsCount,
      nobles: this.nobles,
    };
  }
}
