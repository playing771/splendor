import { IBaseDeck, IBaseDeckConfig } from "../../interfaces/baseDeck";
import { ICardShape } from "../../interfaces/card";

export class BaseDeck<C> implements IBaseDeck<C> {
  cards: Array<C>;
  name: string;

  constructor({ cards, name }: IBaseDeckConfig<C>) {
    this.cards = cards;
    this.name = name;
  }

  getTopCard() {
    return this.cards.shift();
  }
}