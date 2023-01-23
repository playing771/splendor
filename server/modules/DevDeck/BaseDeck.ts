import { IBaseDeckShape, IBaseDeckConfig } from '../../../interfaces/baseDeck';
import { shuffle } from '../../utils/array'

export class BaseDeck<C> implements IBaseDeckShape<C> {
  cards: Array<C>;
  name: string;

  constructor({ cards, name }: IBaseDeckConfig<C>) {
    this.cards = [...cards];
    this.name = name || '';
  }

  getTop() {
    const topCard = this.cards.pop();
    return topCard || null;
  }

  lookTop() {
    const topCard = this.cards[this.cards.length - 1];
    return topCard || null;
  }

  getTopCards(count: number) {
    const arr: C[] = [];
    for (let i = 0; i < count; i++) {
      const topCard = this.getTop();
      if (topCard !== null) {
        arr.push(topCard);
      } else {
        break;
      }
    }
    return arr;
  }

  shuffle() {
    this.cards = shuffle(this.cards);
  }
}