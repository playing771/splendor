import { ICardShape } from "../../../interfaces/card";
import { EDeckLevel } from "../../../interfaces/devDeck";
import { EGemColor } from "../../../interfaces/gem";

export const MOCKED_CARDS_POOL: ICardShape[] = [
  {
    id: "first_one",
    color: EGemColor.Blue,
    cost: {
      [EGemColor.Blue]: 0,
      [EGemColor.Black]: 1,
      [EGemColor.Gold]: 0,
      [EGemColor.Green]: 1,
      [EGemColor.Red]: 1,
      [EGemColor.White]: 0,
    },
    score: 0,
    lvl: EDeckLevel.First
  },
  {
    id: "first_two",
    color: EGemColor.Black,
    cost: {
      [EGemColor.Blue]: 1,
      [EGemColor.Black]: 0,
      [EGemColor.Gold]: 0,
      [EGemColor.Green]: 1,
      [EGemColor.Red]: 1,
      [EGemColor.White]: 0,
    },
    score: 1,
    lvl: EDeckLevel.First
  },
  {
    id: "first_three",
    color: EGemColor.Red,
    cost: {
      [EGemColor.Blue]: 1,
      [EGemColor.Black]: 1,
      [EGemColor.Gold]: 0,
      [EGemColor.Green]: 1,
      [EGemColor.Red]: 1,
      [EGemColor.White]: 1,
    },
    score: 1,
    lvl: EDeckLevel.First
  },
  {
    id: "first_four",
    color: EGemColor.Blue,
    cost: {
      [EGemColor.Blue]: 1,
      [EGemColor.Black]: 1,
      [EGemColor.Gold]: 0,
      [EGemColor.Green]: 1,
      [EGemColor.Red]: 1,
      [EGemColor.White]: 1,
    },
    score: 0,
    lvl: EDeckLevel.First
  },
  {
    id: "first_five",
    color: EGemColor.White,
    cost: {
      [EGemColor.Blue]: 1,
      [EGemColor.Black]: 1,
      [EGemColor.Gold]: 0,
      [EGemColor.Green]: 1,
      [EGemColor.Red]: 0,
      [EGemColor.White]: 0,
    },
    score: 0,
    lvl: EDeckLevel.First
  },
  {
    id: "second_one",
    color: EGemColor.Red,
    cost: {
      [EGemColor.Blue]: 0,
      [EGemColor.Black]: 2,
      [EGemColor.Gold]: 0,
      [EGemColor.Green]: 1,
      [EGemColor.Red]: 1,
      [EGemColor.White]: 0,
    },
    score: 1,
    lvl: EDeckLevel.Second
  },
  {
    id: "second_two",
    color: EGemColor.White,
    cost: {
      [EGemColor.Blue]: 0,
      [EGemColor.Black]: 1,
      [EGemColor.Gold]: 0,
      [EGemColor.Green]: 1,
      [EGemColor.Red]: 1,
      [EGemColor.White]: 2,
    },
    score: 1,
    lvl: EDeckLevel.Second
  },
  {
    id: "second_three",
    color: EGemColor.Green,
    cost: {
      [EGemColor.Blue]: 2,
      [EGemColor.Black]: 1,
      [EGemColor.Gold]: 0,
      [EGemColor.Green]: 1,
      [EGemColor.Red]: 1,
      [EGemColor.White]: 0,
    },
    score: 2,
    lvl: EDeckLevel.Second
  },
  {
    id: "second_four",
    color: EGemColor.Blue,
    cost: {
      [EGemColor.Blue]: 0,
      [EGemColor.Black]: 2,
      [EGemColor.Gold]: 0,
      [EGemColor.Green]: 1,
      [EGemColor.Red]: 1,
      [EGemColor.White]: 0,
    },
    score: 2,
    lvl: EDeckLevel.Second
  },
  {
    id: "second_five",
    color: EGemColor.Black,
    cost: {
      [EGemColor.Blue]: 0,
      [EGemColor.Black]: 1,
      [EGemColor.Gold]: 0,
      [EGemColor.Green]: 2,
      [EGemColor.Red]: 1,
      [EGemColor.White]: 0,
    },
    score: 2,
    lvl: EDeckLevel.Second
  },
  {
    id: "third_one",
    color: EGemColor.Green,
    cost: {
      [EGemColor.Blue]: 1,
      [EGemColor.Black]: 1,
      [EGemColor.Gold]: 0,
      [EGemColor.Green]: 2,
      [EGemColor.Red]: 2,
      [EGemColor.White]: 3,
    },
    score: 4,
    lvl: EDeckLevel.Third
  },
  {
    id: "third_two",
    color: EGemColor.Blue,
    cost: {
      [EGemColor.Blue]: 1,
      [EGemColor.Black]: 1,
      [EGemColor.Gold]: 0,
      [EGemColor.Green]: 2,
      [EGemColor.Red]: 3,
      [EGemColor.White]: 1,
    },
    score: 4,
    lvl: EDeckLevel.Third
  },
  {
    id: "third_three",
    color: EGemColor.White,
    cost: {
      [EGemColor.Blue]: 1,
      [EGemColor.Black]: 1,
      [EGemColor.Gold]: 0,
      [EGemColor.Green]: 2,
      [EGemColor.Red]: 2,
      [EGemColor.White]: 1,
    },
    score: 4,
    lvl: EDeckLevel.Third
  },
  {
    id: "third_four",
    color: EGemColor.Black,
    cost: {
      [EGemColor.Blue]: 3,
      [EGemColor.Black]: 1,
      [EGemColor.Gold]: 0,
      [EGemColor.Green]: 3,
      [EGemColor.Red]: 2,
      [EGemColor.White]: 1,
    },
    score: 4,
    lvl: EDeckLevel.Third
  },
  {
    id: "third_five",
    color: EGemColor.Green,
    cost: {
      [EGemColor.Blue]: 1,
      [EGemColor.Black]: 1,
      [EGemColor.Gold]: 0,
      [EGemColor.Green]: 2,
      [EGemColor.Red]: 2,
      [EGemColor.White]: 1,
    },
    score: 4,
    lvl: EDeckLevel.Third
  }
];