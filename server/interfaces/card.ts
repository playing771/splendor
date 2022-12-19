export enum ECardColor {
  Red = 'red',
  Blue = 'blue',
  White = 'white',
  Brown = 'brown',
  Green = 'green',
}

export type TCardCost = {
  [key in ECardColor]: number
}

export interface ICardShape {
  id: string;
  color: ECardColor;
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

