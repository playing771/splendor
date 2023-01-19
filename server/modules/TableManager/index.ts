import { EDeckLevel } from '../../../interfaces/devDeck';
import { TGameTableShape } from '../../../interfaces/gameTable';
import { ITableManagerShape } from '../../../interfaces/tableManager';
import { EGemColor } from '../../../interfaces/gem';
import { Nullable } from '../../../utils/typescript';

export class TableManager<C extends { id: string }>
  implements ITableManagerShape<C>
{
  table: TGameTableShape<C>;

  constructor(table: TGameTableShape<C>) {
    this.table = table;
  }

  public addGems(color: EGemColor, count: number) {
    this.table.gems[color] += count;
  }

  public removeGems(color: EGemColor, count: number) {
    const targetTokenCount = this.table.gems[color];
    if (count > targetTokenCount) {
      throw Error('No more gem');
    }

    this.table.gems[color] = targetTokenCount - count;
    return count;
  }

  public giveCardFromDeck(level: EDeckLevel): C | null {
    return this.table[level].deck.getTop();
  }

  public giveCardFromTable(cardId: string): C {
    const [card, index, level] = this.findCardOnTable(cardId);
    const topCardFromDeck = this.table[level].deck.getTop();

    if (topCardFromDeck !== null) {
      this.table[level].cards[index] = topCardFromDeck;
    }
    return card;
  }

  public findCardOnTable(cardId: string) {
    const lvls = Object.values(EDeckLevel);
    let cardIndex: number = -1;
    let deckLvl: Nullable<EDeckLevel> = null;
    for (let index = 0; index < lvls.length; index++) {

      const targetLvl = lvls[index];
      const cardInLvlIndex = this.table[targetLvl].cards.findIndex(
        (card) => card.id === cardId
      );

      if (cardInLvlIndex !== -1) {
        cardIndex = cardInLvlIndex;
        deckLvl = targetLvl
        break;
      }
    }

    if (cardIndex === -1 || deckLvl === null) throw Error(`cant find a card with ID ${cardId}`);

    const card = this.table[deckLvl].cards[cardIndex];

    return [card, cardIndex, deckLvl] as const;
  }

  public giveNoble(index: number) {
    const noble = this.table.nobles[index];

    this.table.nobles.splice(index, 1);

    return noble;
  }
}
