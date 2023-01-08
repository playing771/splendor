import { DevDeck } from '../server/modules/DevDeck';
import { EDeckLevel, IDevDeckShape } from './devDeck';
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
} & { [key in EDeckLevel]: TGameTableRowSafeShape<C> }

export type TGameTableShape<C> = {
  [EDeckLevel.First]: TGameTableRowShape<C>;
  [EDeckLevel.Second]: TGameTableRowShape<C>;
  [EDeckLevel.Third]: TGameTableRowShape<C>;
  tokens: {
    [key in ETokenColor]: number;
  }
};

export type TGameTableConfig<C> = {
  [EDeckLevel.First]: Array<C>;
  [EDeckLevel.Second]: Array<C>;
  [EDeckLevel.Third]: Array<C>;

  [ETokenColor.Blue]: number,
  [ETokenColor.Black]: number,
  [ETokenColor.Gold]: number,
  [ETokenColor.Green]: number,
  [ETokenColor.Red]: number,
  [ETokenColor.White]: number,
  initialCardsOnTableCount: number,
  willShuffleDecks?: boolean
};
