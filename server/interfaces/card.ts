import { ETokenColor } from "./token";

export type TCardCost = {
  [key in ETokenColor]: number
}

export interface ICardShape {
  id: string;
  color: ETokenColor;
  score: number;
  cost: TCardCost
}

// const card_one: ICardShape = {
//   id: '1',
//   color: ECardColor.Red,
//   score: 7,
//   cost: {
//     [ECardColor.Blue]: 1,
//     [ECardColor.Brown]: 4,
//     [ECardColor.White]: 0,
//     [ECardColor.Red]: 0,
//     [ECardColor.Green]: 0,
//   }
// }

