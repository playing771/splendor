import { ICardShape, TCardCost } from '../../interfaces/card'
import { EDeckLevel } from '../../interfaces/devDeck';
import { ETokenColor } from '../../interfaces/token';

export class Card implements ICardShape {
  id: string;
  color: ETokenColor;
  score: number;
  cost: TCardCost;
  lvl: EDeckLevel;

  constructor({ id, score, color, cost, lvl }: ICardShape) {
    this.id = id;
    this.score = score;
    this.color = color;
    this.cost = cost;
    this.lvl = lvl
  }
}

export const createCard = (config: ICardShape)=> {
  return new Card(config);
}
