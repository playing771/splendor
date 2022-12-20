import { EDevDeckLevel, IDevDeckShape } from '../../interfaces/devDeck';
import { TGameTableConfig, TGameTableShape } from '../../interfaces/gameTable';
import { DevDeck } from '../DevDeck';

export class GameTable<C> implements TGameTableShape<C> {
  [EDevDeckLevel.First]: { deck: IDevDeckShape<C>; cards: C[] };
  [EDevDeckLevel.Second]: { deck: IDevDeckShape<C>; cards: C[] };
  [EDevDeckLevel.Third]: { deck: IDevDeckShape<C>; cards: C[] };

  constructor(config: TGameTableConfig<C>) {
    Object.values(EDevDeckLevel).forEach((level: EDevDeckLevel)=>{

      const initialCards = config[level];

      this[level] = {
        cards: [],
        deck: new DevDeck({level, cards: initialCards, name: `${level} level deck`})
      }
    })
  }
}
