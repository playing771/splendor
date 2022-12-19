import { IBaseDeckShape, IBaseDeckConfig } from "../../interfaces/baseDeck";

export class BaseDeck<C> implements IBaseDeckShape<C> {
  cards: Array<C>;
  name: string;

  constructor({ cards, name }: IBaseDeckConfig<C>) {
    this.cards = [...cards];
    this.name = name;
  }

  getTop() {
    return this.cards.pop();
  }
}