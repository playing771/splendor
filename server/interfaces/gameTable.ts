import { DevDeck } from '../modules/DevDeck';
import { EDevDeckLevel, IDevDeckShape } from './devDeck';

export type TGameTableShape<C> = {
  [key in EDevDeckLevel]: {
    deck: IDevDeckShape<C>;
    cards: Array<C>;
  };
};

export type TGameTableConfig<C> = {
  [key in EDevDeckLevel]: Array<C>;
};
