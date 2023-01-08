import { ICardShape } from "../../../interfaces/card";
import { EDeckLevel } from "../../../interfaces/devDeck";
import { ETokenColor } from "../../../interfaces/token";

export const MOCKED_CARDS_POOL: ICardShape[] = [
  {
    id: "first_one",
    color: ETokenColor.Blue,
    cost: {
      [ETokenColor.Blue]: 0,
      [ETokenColor.Black]: 1,
      [ETokenColor.Gold]: 0,
      [ETokenColor.Green]: 1,
      [ETokenColor.Red]: 1,
      [ETokenColor.White]: 0,
    },
    score: 0,
    lvl: EDeckLevel.First
  },
  {
    id: "first_two",
    color: ETokenColor.Black,
    cost: {
      [ETokenColor.Blue]: 1,
      [ETokenColor.Black]: 0,
      [ETokenColor.Gold]: 0,
      [ETokenColor.Green]: 1,
      [ETokenColor.Red]: 1,
      [ETokenColor.White]: 0,
    },
    score: 1,
    lvl: EDeckLevel.First
  },
  {
    id: "first_three",
    color: ETokenColor.Red,
    cost: {
      [ETokenColor.Blue]: 1,
      [ETokenColor.Black]: 1,
      [ETokenColor.Gold]: 0,
      [ETokenColor.Green]: 1,
      [ETokenColor.Red]: 1,
      [ETokenColor.White]: 1,
    },
    score: 1,
    lvl: EDeckLevel.First
  },
  {
    id: "first_four",
    color: ETokenColor.Blue,
    cost: {
      [ETokenColor.Blue]: 1,
      [ETokenColor.Black]: 1,
      [ETokenColor.Gold]: 0,
      [ETokenColor.Green]: 1,
      [ETokenColor.Red]: 1,
      [ETokenColor.White]: 1,
    },
    score: 0,
    lvl: EDeckLevel.First
  },
  {
    id: "first_five",
    color: ETokenColor.White,
    cost: {
      [ETokenColor.Blue]: 1,
      [ETokenColor.Black]: 1,
      [ETokenColor.Gold]: 0,
      [ETokenColor.Green]: 1,
      [ETokenColor.Red]: 0,
      [ETokenColor.White]: 0,
    },
    score: 0,
    lvl: EDeckLevel.First
  },
  {
    id: "second_one",
    color: ETokenColor.Red,
    cost: {
      [ETokenColor.Blue]: 0,
      [ETokenColor.Black]: 2,
      [ETokenColor.Gold]: 0,
      [ETokenColor.Green]: 1,
      [ETokenColor.Red]: 1,
      [ETokenColor.White]: 0,
    },
    score: 1,
    lvl: EDeckLevel.Second
  },
  {
    id: "second_two",
    color: ETokenColor.White,
    cost: {
      [ETokenColor.Blue]: 0,
      [ETokenColor.Black]: 1,
      [ETokenColor.Gold]: 0,
      [ETokenColor.Green]: 1,
      [ETokenColor.Red]: 1,
      [ETokenColor.White]: 2,
    },
    score: 1,
    lvl: EDeckLevel.Second
  },
  {
    id: "second_three",
    color: ETokenColor.Green,
    cost: {
      [ETokenColor.Blue]: 2,
      [ETokenColor.Black]: 1,
      [ETokenColor.Gold]: 0,
      [ETokenColor.Green]: 1,
      [ETokenColor.Red]: 1,
      [ETokenColor.White]: 0,
    },
    score: 2,
    lvl: EDeckLevel.Second
  },
  {
    id: "second_four",
    color: ETokenColor.Blue,
    cost: {
      [ETokenColor.Blue]: 0,
      [ETokenColor.Black]: 2,
      [ETokenColor.Gold]: 0,
      [ETokenColor.Green]: 1,
      [ETokenColor.Red]: 1,
      [ETokenColor.White]: 0,
    },
    score: 2,
    lvl: EDeckLevel.Second
  },
  {
    id: "second_five",
    color: ETokenColor.Black,
    cost: {
      [ETokenColor.Blue]: 0,
      [ETokenColor.Black]: 1,
      [ETokenColor.Gold]: 0,
      [ETokenColor.Green]: 2,
      [ETokenColor.Red]: 1,
      [ETokenColor.White]: 0,
    },
    score: 2,
    lvl: EDeckLevel.Second
  },
  {
    id: "third_one",
    color: ETokenColor.Green,
    cost: {
      [ETokenColor.Blue]: 1,
      [ETokenColor.Black]: 1,
      [ETokenColor.Gold]: 0,
      [ETokenColor.Green]: 2,
      [ETokenColor.Red]: 2,
      [ETokenColor.White]: 3,
    },
    score: 4,
    lvl: EDeckLevel.Third
  },
  {
    id: "third_two",
    color: ETokenColor.Blue,
    cost: {
      [ETokenColor.Blue]: 1,
      [ETokenColor.Black]: 1,
      [ETokenColor.Gold]: 0,
      [ETokenColor.Green]: 2,
      [ETokenColor.Red]: 3,
      [ETokenColor.White]: 1,
    },
    score: 4,
    lvl: EDeckLevel.Third
  },
  {
    id: "third_three",
    color: ETokenColor.White,
    cost: {
      [ETokenColor.Blue]: 1,
      [ETokenColor.Black]: 1,
      [ETokenColor.Gold]: 0,
      [ETokenColor.Green]: 2,
      [ETokenColor.Red]: 2,
      [ETokenColor.White]: 1,
    },
    score: 4,
    lvl: EDeckLevel.Third
  },
  {
    id: "third_four",
    color: ETokenColor.Black,
    cost: {
      [ETokenColor.Blue]: 3,
      [ETokenColor.Black]: 1,
      [ETokenColor.Gold]: 0,
      [ETokenColor.Green]: 3,
      [ETokenColor.Red]: 2,
      [ETokenColor.White]: 1,
    },
    score: 4,
    lvl: EDeckLevel.Third
  },
  {
    id: "third_five",
    color: ETokenColor.Green,
    cost: {
      [ETokenColor.Blue]: 1,
      [ETokenColor.Black]: 1,
      [ETokenColor.Gold]: 0,
      [ETokenColor.Green]: 2,
      [ETokenColor.Red]: 2,
      [ETokenColor.White]: 1,
    },
    score: 4,
    lvl: EDeckLevel.Third
  }
];