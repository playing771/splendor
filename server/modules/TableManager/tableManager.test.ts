import { GameTable } from '../GameTable';
import { TableManager } from '.';
import { EDeckLevel } from '../../../interfaces/devDeck';
import { TGameTableConfig } from '../../../interfaces/gameTable';
import { EGemColor } from '../../../interfaces/gem';

const TABLE_CONFIG: TGameTableConfig<{ id: string }> = {
  initialCardsOnTableCount: 4,
  [EDeckLevel.First]: [
    { id: 'one_first' },
    { id: 'two_first' },
    { id: 'tree_first' },
    { id: 'four_first' },
    { id: 'five_first' },
  ],
  [EDeckLevel.Second]: [
    { id: 'one_second' },
    { id: 'two_second' },
    { id: 'tree_second' },
    { id: 'four_second' },
    { id: 'five_second' },
  ],
  [EDeckLevel.Third]: [
    { id: 'one_third' },
    { id: 'two_third' },
    { id: 'tree_third' },
    { id: 'four_third' },
    { id: 'five_third' },
  ],
  [EGemColor.Blue]: 5,
  [EGemColor.Black]: 5,
  [EGemColor.Gold]: 5,
  [EGemColor.Green]: 5,
  [EGemColor.Red]: 5,
  [EGemColor.White]: 5,
  willShuffleDecks: false
};


describe('Table functional', () => {
  it('give card from deck 1', () => {
    const table = new GameTable(TABLE_CONFIG);
    const tableManager = new TableManager(table);
    
    expect(tableManager.giveCardFromDeck(EDeckLevel.First)?.id).toBe(
      'one_first'
    );
  });

  it('give card from deck 2', () => {
    const table = new GameTable(TABLE_CONFIG);
    const tableManager = new TableManager(table);

    expect(tableManager.giveCardFromDeck(EDeckLevel.Second)?.id).toBe(
      'one_second'
    )
  });

  it('give card from table', () => {
    const table = new GameTable(TABLE_CONFIG);
    const tableManager = new TableManager(table);
  
    expect(tableManager.giveCardFromTable('two_second').id).toBe(
      'two_second'
    )
    expect(tableManager.table[EDeckLevel.Second].cards[3].id).toBe('one_second');
    expect(tableManager.table[EDeckLevel.Second].deck.cards).toHaveLength(0);
  });
  
  it('give gem from table', ()=> {
    const table = new GameTable(TABLE_CONFIG);
    const tableManager = new TableManager(table);

    expect(tableManager.removeGems(EGemColor.Blue, 2)).toBe(2)
    expect(tableManager.table.gems[EGemColor.Blue]).toBe(3)
  })

  it('take gem from table', ()=> {
    const table = new GameTable(TABLE_CONFIG);
    const tableManager = new TableManager(table);
    tableManager.addGems(EGemColor.Blue, 1)

    expect(tableManager.table.gems[EGemColor.Blue]).toBe(6)
  })

});
