import { EDeckLevel } from '../../../interfaces/devDeck';
import {
  TGameTableConfig,
  TGameTableRowSafeShape,
  TGameTableRowShape,
  TGameTableSafeState,
  TGameTableShape,
} from '../../../interfaces/gameTable';
import { ETokenColor } from '../../../interfaces/token';
import { DevDeck } from '../DevDeck';

export class GameTable<C> implements TGameTableShape<C> {
  [EDeckLevel.First]: TGameTableRowShape<C>;
  [EDeckLevel.Second]: TGameTableRowShape<C>;
  [EDeckLevel.Third]: TGameTableRowShape<C>;
  
  tokens: TGameTableShape<C>['tokens']

  constructor(config: TGameTableConfig<C>) {
    const { willShuffleDecks = true } = config;
    // Rows initialize    
    Object.values(EDeckLevel).forEach((level) => {
      const initialCards = config[level];

      const deck = new DevDeck({
        level,
        cards: initialCards,
        name: `${level} level deck`,
      })

      if (willShuffleDecks) {
        deck.shuffle();
      }

      // draw initial cards in play      
      const topcards = deck.getTopCards(config.initialCardsOnTableCount);
      this[level] = {
        cards: topcards,
        deck,
      };
    });
  
    this.tokens = Object.values(ETokenColor).reduce((acc, color) => {
      acc[color] = config[color];

      return acc
    }, {} as TGameTableShape<C>['tokens']);

  }


  getSafeState(): TGameTableSafeState<C> {
    return {
      ...this.getSafeDecksState(),
      tokens: this.getTokensState()
    }
  }

  private getTokensState() {
    return Object.values(ETokenColor).reduce((acc, color) => {
      acc[color] = this.tokens[color];
      return acc;
    }, {} as { [key in ETokenColor]: number })
  }

  private getSafeDecksState() {
    return Object.values(EDeckLevel).reduce((acc, lvl) => {
      acc[lvl] = {
        deck: this[lvl].deck.cards.length,
        cards: this[lvl].cards
      }
      return acc;
    }, {} as { [key in EDeckLevel]: TGameTableRowSafeShape<C> })
  }

}
