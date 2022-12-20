import { EDevDeckLevel, IDevDeckShape } from '../../interfaces/devDeck';
import { TGameTableConfig, TGameTableRowShape, TGameTableShape } from '../../interfaces/gameTable';
import { ETokenColor } from '../../interfaces/token';
import { DevDeck } from '../DevDeck';

export class GameTable<C> implements TGameTableShape<C> {
  [EDevDeckLevel.First]: TGameTableRowShape<C>;
  [EDevDeckLevel.Second]: TGameTableRowShape<C>;
  [EDevDeckLevel.Third]: TGameTableRowShape<C>;

  [ETokenColor.Blue]: number;
  [ETokenColor.Brown]: number;
  [ETokenColor.Gold]: number;
  [ETokenColor.Green]: number;
  [ETokenColor.Red]: number;
  [ETokenColor.White]: number;
  

  constructor(config: TGameTableConfig<C>) {
    // Rows initialize
    Object.values(EDevDeckLevel).forEach((level: EDevDeckLevel)=>{

      const initialCards = config[level];

      this[level] = {
        cards: [],
        deck: new DevDeck({level, cards: initialCards, name: `${level} level deck`})
      }
    })

    Object.values(ETokenColor).forEach((color: ETokenColor) => {
      this[color] = config[color]
    })
  }
}