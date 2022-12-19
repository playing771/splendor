import { ECardColor, ICardShape, TCardCost } from '../../interfaces/card'

export class Card implements ICardShape {
  id: string;
  color: ECardColor;
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
