import { ICardShape, TCardCost } from '../../interfaces/card'
import { ETokenColor } from '../../interfaces/token';

export class Card implements ICardShape {
  id: string;
  color: ETokenColor;
  score: number;
  cost: TCardCost;

  constructor({ id, score, color, cost }: ICardShape) {
    this.id = id;
    this.score = score;
    this.color = color;
    this.cost = cost;
  }
}

export const createCard = (config: ICardShape)=> {
  return new Card(config);
}
