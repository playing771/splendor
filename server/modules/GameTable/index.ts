import { EDeckLevel } from '../../../interfaces/devDeck';
import {
  TGameTableConfig,
  TGameTableRowSafeShape,
  TGameTableRowShape,
  TGameTableSafeState,
  TGameTableShape,
} from '../../../interfaces/gameTable';
import { EGemColor } from '../../../interfaces/gem';
import { INobleShape } from '../../../interfaces/noble';
import { DevDeck } from '../DevDeck';
import { BaseDeck } from '../DevDeck/BaseDeck';

export class GameTable<C> implements TGameTableShape<C> {
  [EDeckLevel.First]: TGameTableRowShape<C>;
  [EDeckLevel.Second]: TGameTableRowShape<C>;
  [EDeckLevel.Third]: TGameTableRowShape<C>;
  
  gems: TGameTableShape<C>['gems']
  nobles: INobleShape[];

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
  
    this.gems = Object.values(EGemColor).reduce((acc, color) => {
      acc[color] = config[color];

      return acc
    }, {} as TGameTableShape<C>['gems']);
    const noblesDeck = new BaseDeck({cards: config.nobles});

    if (willShuffleDecks) {
      noblesDeck.shuffle();
    }
    
    this.nobles = noblesDeck.getTopCards(config.noblesInPlay);
  }
  
  [EDeckLevel.First]: TGameTableRowShape<C>;
  [EDeckLevel.Second]: TGameTableRowShape<C>;
  [EDeckLevel.Third]: TGameTableRowShape<C>;


  getSafeState(): TGameTableSafeState<C> {
    return {
      ...this.getSafeDecksState(),
      gems: this.getTokensState()
    }
  }

  private getTokensState() {
    return Object.values(EGemColor).reduce((acc, color) => {
      acc[color] = this.gems[color];
      return acc;
    }, {} as { [key in EGemColor]: number })
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
