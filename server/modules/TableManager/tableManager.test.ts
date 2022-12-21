import { GameTable } from '.';
import { EDevDeckLevel } from '../../interfaces/devDeck';
import { TGameTableConfig } from '../../interfaces/gameTable';
import { ETokenColor } from '../../interfaces/token';
import { TableManager } from './TableManager';

const TABLE_CONFIG: TGameTableConfig<{ id: string }> = {
  initialCountCard: 4,
  [EDevDeckLevel.First]: [
    { id: 'one_first' },
    { id: 'two_first' },
    { id: 'tree_first' },
    { id: 'four_first' },
    { id: 'five_first' },
  ],
  [EDevDeckLevel.Second]: [
    { id: 'one_second' },
    { id: 'two_second' },
    { id: 'tree_second' },
    { id: 'four_second' },
    { id: 'five_second' },
  ],
  [EDevDeckLevel.Third]: [
    { id: 'one_third' },
    { id: 'two_third' },
    { id: 'tree_third' },
    { id: 'four_third' },
    { id: 'five_third' },
  ],
  [ETokenColor.Blue]: 5,
  [ETokenColor.Brown]: 5,
  [ETokenColor.Gold]: 5,
  [ETokenColor.Green]: 5,
  [ETokenColor.Red]: 5,
  [ETokenColor.White]: 5,
};


describe('Table functional', () => {
  it('Test give card from deck 1', () => {
    const table = new GameTable(TABLE_CONFIG);
    const tableManager = new TableManager(table);
    
    expect(tableManager.giveCardFromDeck(EDevDeckLevel.First).id).toBe(
      'one_first'
    );
  });

  it('Test give card from deck 2', () => {
    const table = new GameTable(TABLE_CONFIG);
    const tableManager = new TableManager(table);

    expect(tableManager.giveCardFromDeck(EDevDeckLevel.Second).id).toBe(
      'one_second'
    )
  });

  it('Test give card from table', () => {
    const table = new GameTable(TABLE_CONFIG);
    const tableManager = new TableManager(table);

    expect(tableManager.giveCardFromTable(EDevDeckLevel.Second, 3).id).toBe(
      'two_second'
    )
    expect(tableManager.table[EDevDeckLevel.Second].cards[3].id).toBe('one_second');
    expect(tableManager.table[EDevDeckLevel.Second].deck.cards).toHaveLength(0);
  });
  
  it('Test give token from table', ()=> {
    const table = new GameTable(TABLE_CONFIG);
    const tableManager = new TableManager(table);

    expect(tableManager.giveToken(ETokenColor.Blue, 2)).toBe(2)
    expect(tableManager.table.blue).toBe(3)
  })

  it('Test take token from table', ()=> {
    const table = new GameTable(TABLE_CONFIG);
    const tableManager = new TableManager(table);
    tableManager.takeToken(ETokenColor.Blue, 1)

    expect(tableManager.table.blue).toBe(6)
  })

});
