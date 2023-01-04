import { DevDeck } from '../server/modules/DevDeck';
import { EDevDeckLevel, IDevDeckShape } from './devDeck';
import { ETokenColor } from './token';

export type TGameTableRowShape<C> = {
  deck: IDevDeckShape<C>;
  cards: Array<C>;
}

export type TGameTableRowSafeShape<C> = {
  deck: number;
  cards: Array<C>;
}

export type TGameTableSafeState<C> = {
  tokens: { [key in ETokenColor]: number };
} & { [key in EDevDeckLevel]: TGameTableRowSafeShape<C> }

export type TGameTableShape<C> = {
  [EDevDeckLevel.First]: TGameTableRowShape<C>;
  [EDevDeckLevel.Second]: TGameTableRowShape<C>;
  [EDevDeckLevel.Third]: TGameTableRowShape<C>;
  tokens: {
    [key in ETokenColor]: number;
  }
};

export type TGameTableConfig<C> = {
  [EDevDeckLevel.First]: Array<C>;
  [EDevDeckLevel.Second]: Array<C>;
  [EDevDeckLevel.Third]: Array<C>;

  [ETokenColor.Blue]: number,
  [ETokenColor.Black]: number,
  [ETokenColor.Gold]: number,
  [ETokenColor.Green]: number,
  [ETokenColor.Red]: number,
  [ETokenColor.White]: number,
  initialCardsOnTableCount: number,
  willShuffleDecks?: boolean
};