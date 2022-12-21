import { EDevDeckLevel } from '../../interfaces/devDeck';
import { TGameTableShape } from '../../interfaces/gameTable';
import { ITableManagerShape } from '../../interfaces/tableManager';
import { ETokenColor } from '../../interfaces/token';

export class TableManager<C> implements ITableManagerShape<C> {
  table: TGameTableShape<C>;

  takeToken(color: ETokenColor, count: number) {
    this.table[color] += count;
  }

  giveToken(color: ETokenColor, count: number) {
    const targetTokenCount = this.table[color];
    if (count > targetTokenCount) {
      throw Error('No more token');
    }

    this.table[color] = targetTokenCount - count;
    return count;
  }

  giveCardFromDeck(level: EDevDeckLevel): C {
    return this.table[level].deck.getTop();
  }

  giveCardFromTable(level: EDevDeckLevel, index: number): C {
    const currentCard = this.table[level].cards[index];
    this.table[level].cards[index] = this.table[level].deck.getTop();
    return currentCard;
  }

  buyCard(): C {
    throw new Error('Method not implemented.');
  }
  holdCard(): C {
    throw new Error('Method not implemented.');
  }
  
  constructor(table: TGameTableShape<C>) {
    this.table = table;
  }
}
