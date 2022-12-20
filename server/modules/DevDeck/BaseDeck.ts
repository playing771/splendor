import { IBaseDeckShape, IBaseDeckConfig } from "../../interfaces/baseDeck";

export class BaseDeck<C> implements IBaseDeckShape<C> {
  cards: Array<C>;
  name: string;

  constructor({ cards, name }: IBaseDeckConfig<C>) {
    
    this.cards = [...cards];
    this.name = name;
  }

  getTop()  {
    if(this.cards.length === 0){
      throw Error("No more cards")
    }  
    return this.cards.pop()!;
  }

  getTopCards(count: number) {
    const arr =[]
    for (let i = 0; i < count; i++) {
      arr.push(this.getTop())
    }
    return arr;
  }
}