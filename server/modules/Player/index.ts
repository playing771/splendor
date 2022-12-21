import { ICardShape } from "../../interfaces/card";
import {ETokenColor} from '../../interfaces/token';
import { IPlayerShape, TPlayerTokens } from "../../interfaces/player";

export class Player implements IPlayerShape {
  tokens: TPlayerTokens;
  cardsBought: ICardShape[];
  cardsHolded: ICardShape[];
  name: string;
  id: string;

  constructor(name: string, id: string){
   this.tokens = Object.values(ETokenColor).reduce((acc, color)=> {
      acc[color] = 0;
      return acc;
    },{} as TPlayerTokens);

    this.cardsBought = [];
    this.cardsHolded = [];
    this.name = name;
    this.id = id;
  }
  getTokens(color: ETokenColor, count: number): void {
    this.tokens[color] += count;
  }
  spendTokens(color: ETokenColor, count: number): void {
    if (count > this.tokens[color]) {
      throw Error(`Player (id=${this.id}) doesn't have ${count} tokens`)
    }
    this.tokens[color] -= count;
  }

  
}