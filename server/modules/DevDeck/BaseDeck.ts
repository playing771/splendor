import { IBaseDeckShape, IBaseDeckConfig } from "../../interfaces/baseDeck";

export class BaseDeck<C> implements IBaseDeckShape<C> {
  cards: Array<C>;
  name: string;

  constructor({ cards, name }: IBaseDeckConfig<C>) {
    this.cards = [...cards];
    this.name = name;
  }

  getTop() {
    if (this.cards.length === 0) {
      throw Error("No more cards")
    }
    const topCard = this.cards.pop();
    return topCard || null;
  }

  getTopCards(count: number) {
    const arr: C[] = []
    for (let i = 0; i < count; i++) {
      const topCard = this.getTop();
      if (topCard !== null) {
        arr.push(topCard)
      } else {
        break;
      }

    }
    return arr;
  }

  shuffle() {
    // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = this.cards[i];
      this.cards[i] = this.cards[j];
      this.cards[j] = temp;
    }
  }
}