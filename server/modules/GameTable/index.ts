import { EDevDeckLevel, IDevDeckShape } from '../../interfaces/devDeck';
import {
  TGameTableConfig,
  TGameTableRowShape,
  TGameTableShape,
} from '../../interfaces/gameTable';
import { ETokenColor } from '../../interfaces/token';
import { DevDeck } from '../DevDeck';

export class GameTable<C> implements TGameTableShape<C> {
  [EDevDeckLevel.First]: TGameTableRowShape<C>;
  [EDevDeckLevel.Second]: TGameTableRowShape<C>;
  [EDevDeckLevel.Third]: TGameTableRowShape<C>;

  [ETokenColor.Blue]: number;
  [ETokenColor.Black]: number;
  [ETokenColor.Gold]: number;
  [ETokenColor.Green]: number;
  [ETokenColor.Red]: number;
  [ETokenColor.White]: number;

  constructor(config: TGameTableConfig<C>) {
    
    // Rows initialize    
    Object.values(EDevDeckLevel).forEach((level) => {
      const initialCards = config[level];
      
      const deck = new DevDeck({
        level,
        cards: initialCards,
        name: `${level} level deck`,
      })

      const topcards = deck.getTopCards(config.initialCardsOnTableCount);
      this[level] = {
        cards: topcards,
        deck,
      };
    });

    Object.values(ETokenColor).forEach((color: ETokenColor) => {
      this[color] = config[color];
    });

    
  }
}
