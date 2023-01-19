import { DevDeck } from '../server/modules/DevDeck';
import { EDeckLevel, IDevDeckShape } from './devDeck';
import { TPlayerGems } from './player';
import { EGemColor } from './gem';
import { INobleShape } from './noble';

export type TGameTableRowShape<C> = {
  deck: IDevDeckShape<C>;
  cards: Array<C>;
}

export type TGameTableRowSafeShape<C> = {
  deck: number;
  cards: Array<C>;
}

export type TGameTableSafeState<C> = {
  gems: TPlayerGems;
} & { [key in EDeckLevel]: TGameTableRowSafeShape<C> }

export type TGameTableShape<C> = {
  [EDeckLevel.First]: TGameTableRowShape<C>;
  [EDeckLevel.Second]: TGameTableRowShape<C>;
  [EDeckLevel.Third]: TGameTableRowShape<C>;
  gems: {
    [key in EGemColor]: number;
  }
  nobles: INobleShape[]
};

export type TGameTableConfig<C> = {
  [EDeckLevel.First]: Array<C>;
  [EDeckLevel.Second]: Array<C>;
  [EDeckLevel.Third]: Array<C>;

  [EGemColor.Blue]: number,
  [EGemColor.Black]: number,
  [EGemColor.Gold]: number,
  [EGemColor.Green]: number,
  [EGemColor.Red]: number,
  [EGemColor.White]: number,
  initialCardsOnTableCount: number,
  noblesInPlay: number,
  willShuffleDecks?: boolean,
  nobles: INobleShape[]
};
