import { EDevDeckLevel } from '../../../interfaces/devDeck';
import { TGameTableShape } from '../../../interfaces/gameTable';
import { ITableManagerShape } from '../../../interfaces/tableManager';
import { ETokenColor } from '../../../interfaces/token';

export class TableManager<C> implements ITableManagerShape<C> {
  table: TGameTableShape<C>;

  constructor(table: TGameTableShape<C>) {
    this.table = table;
  }

  takeTokens(color: ETokenColor, count: number) {
    this.table.tokens[color] += count;
  }

  giveTokens(color: ETokenColor, count: number) {
    const targetTokenCount = this.table.tokens[color];
    if (count > targetTokenCount) {
      throw Error('No more token');
    }

    this.table.tokens[color] = targetTokenCount - count;
    return count;
  }

  giveCardFromDeck(level: EDevDeckLevel): C | null {
    return this.table[level].deck.getTop();
  }

  public giveCardFromTable(level: EDevDeckLevel, index: number): C {
    const currentCard = this.table[level].cards[index];
    const topCardFromDeck = this.table[level].deck.getTop();
    if (topCardFromDeck !== null) {
      this.table[level].cards[index] = topCardFromDeck;
    }
    return currentCard;
  }

  buyCard(): C {
    throw new Error('Method not implemented.');
  }
  holdCard(): C {
    throw new Error('Method not implemented.');
  }
}
