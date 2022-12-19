import { ICardShape } from "../../interfaces/card";

const GREEN_DECK = ['1','2','3'];
const YELLOW_DECK = ['5','6','8'];
export class Deck {
  public name: string = '';
  public cards: ICardShape[];

  constructor({ name = '', cards = [] }: { name?: string, cards?: ICardShape[] }) {
    this.name = name;
    this.cards = cards.slice() // making array copy;
  }

  public giveTop() {
    return this.cards.shift();
  }

  public giveCards(count: number) {
    return this.cards.splice(0, count);
  }
}


const deck = new Deck({})