import { ICardShape } from "../interfaces/card";
import { EDevDeckLevel } from "../interfaces/devDeck";
import { ETokenColor } from "../interfaces/token";

export const CARDS_MAP_BY_LEVEL: { [key in EDevDeckLevel]: ICardShape[] } = {
  [EDevDeckLevel.First]: [
    {
      id: "first_one",
      color: ETokenColor.Blue,
      cost: {
        [ETokenColor.Blue]: 0,
        [ETokenColor.Brown]: 1,
        [ETokenColor.Gold]: 0,
        [ETokenColor.Green]: 1,
        [ETokenColor.Red]: 1,
        [ETokenColor.White]: 0,
      },
      score: 0
    },
    {
      id: "first_two",
      color: ETokenColor.Brown,
      cost: {
        [ETokenColor.Blue]: 1,
        [ETokenColor.Brown]: 0,
        [ETokenColor.Gold]: 0,
        [ETokenColor.Green]: 1,
        [ETokenColor.Red]: 1,
        [ETokenColor.White]: 0,
      },
      score: 1
    },
    {
      id: "first_three",
      color: ETokenColor.Red,
      cost: {
        [ETokenColor.Blue]: 1,
        [ETokenColor.Brown]: 1,
        [ETokenColor.Gold]: 0,
        [ETokenColor.Green]: 1,
        [ETokenColor.Red]: 1,
        [ETokenColor.White]: 1,
      },
      score: 1
    },
    {
      id: "first_four",
      color: ETokenColor.Blue,
      cost: {
        [ETokenColor.Blue]: 1,
        [ETokenColor.Brown]: 1,
        [ETokenColor.Gold]: 0,
        [ETokenColor.Green]: 1,
        [ETokenColor.Red]: 1,
        [ETokenColor.White]: 1,
      },
      score: 0
    },
    {
      id: "first_five",
      color: ETokenColor.White,
      cost: {
        [ETokenColor.Blue]: 1,
        [ETokenColor.Brown]: 1,
        [ETokenColor.Gold]: 0,
        [ETokenColor.Green]: 1,
        [ETokenColor.Red]: 1,
        [ETokenColor.White]: 0,
      },
      score: 0
    }
  ],
  [EDevDeckLevel.Second]: [
    {
      id: "second_one",
      color: ETokenColor.Red,
      cost: {
        [ETokenColor.Blue]: 0,
        [ETokenColor.Brown]: 2,
        [ETokenColor.Gold]: 0,
        [ETokenColor.Green]: 1,
        [ETokenColor.Red]: 1,
        [ETokenColor.White]: 0,
      },
      score: 1
    },
    {
      id: "second_two",
      color: ETokenColor.White,
      cost: {
        [ETokenColor.Blue]: 0,
        [ETokenColor.Brown]: 1,
        [ETokenColor.Gold]: 0,
        [ETokenColor.Green]: 1,
        [ETokenColor.Red]: 1,
        [ETokenColor.White]: 2,
      },
      score: 1
    },
    {
      id: "second_three",
      color: ETokenColor.Green,
      cost: {
        [ETokenColor.Blue]: 2,
        [ETokenColor.Brown]: 1,
        [ETokenColor.Gold]: 0,
        [ETokenColor.Green]: 1,
        [ETokenColor.Red]: 1,
        [ETokenColor.White]: 0,
      },
      score: 2
    },
    {
      id: "second_four",
      color: ETokenColor.Blue,
      cost: {
        [ETokenColor.Blue]: 0,
        [ETokenColor.Brown]: 2,
        [ETokenColor.Gold]: 0,
        [ETokenColor.Green]: 1,
        [ETokenColor.Red]: 1,
        [ETokenColor.White]: 0,
      },
      score: 2
    },
    {
      id: "second_five",
      color: ETokenColor.Brown,
      cost: {
        [ETokenColor.Blue]: 0,
        [ETokenColor.Brown]: 1,
        [ETokenColor.Gold]: 0,
        [ETokenColor.Green]: 2,
        [ETokenColor.Red]: 1,
        [ETokenColor.White]: 0,
      },
      score: 2
    }
  ],
  [EDevDeckLevel.Third]: [
    {
      id: "third_one",
      color: ETokenColor.Green,
      cost: {
        [ETokenColor.Blue]: 1,
        [ETokenColor.Brown]: 1,
        [ETokenColor.Gold]: 0,
        [ETokenColor.Green]: 2,
        [ETokenColor.Red]: 2,
        [ETokenColor.White]: 3,
      },
      score: 4
    },
    {
      id: "third_two",
      color: ETokenColor.Blue,
      cost: {
        [ETokenColor.Blue]: 1,
        [ETokenColor.Brown]: 1,
        [ETokenColor.Gold]: 0,
        [ETokenColor.Green]: 2,
        [ETokenColor.Red]: 3,
        [ETokenColor.White]: 1,
      },
      score: 4
    },
    {
      id: "third_three",
      color: ETokenColor.White,
      cost: {
        [ETokenColor.Blue]: 1,
        [ETokenColor.Brown]: 1,
        [ETokenColor.Gold]: 0,
        [ETokenColor.Green]: 2,
        [ETokenColor.Red]: 2,
        [ETokenColor.White]: 1,
      },
      score: 4
    },
    {
      id: "third_four",
      color: ETokenColor.Brown,
      cost: {
        [ETokenColor.Blue]: 3,
        [ETokenColor.Brown]: 1,
        [ETokenColor.Gold]: 0,
        [ETokenColor.Green]: 3,
        [ETokenColor.Red]: 2,
        [ETokenColor.White]: 1,
      },
      score: 4
    },
    {
      id: "third_five",
      color: ETokenColor.Green,
      cost: {
        [ETokenColor.Blue]: 1,
        [ETokenColor.Brown]: 1,
        [ETokenColor.Gold]: 0,
        [ETokenColor.Green]: 2,
        [ETokenColor.Red]: 2,
        [ETokenColor.White]: 1,
      },
      score: 4
    }
  ],
}