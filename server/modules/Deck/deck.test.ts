import { Deck } from "."

const CARDS_MOCKED = [{ id: '1', name: 'FirstCard' }, { id: '2', name: 'SecondCard' }, { id: '3', name: 'ThirdCard' }]

describe('Deck functionality', () => {

  it('is created with name', () => {
    const deck = new Deck({ name: 'Deck' });
    expect(deck.name).toBe('Deck')
  })

  it('is created with cards provided', () => {
    const deck = new Deck({ cards: CARDS_MOCKED });
    expect(deck.cards).toHaveLength(CARDS_MOCKED.length);
    expect(deck.cards[1].name).toBe(CARDS_MOCKED[1].name);
  })

  it('can give top card', () => {
    const deck = new Deck({ cards: CARDS_MOCKED });
    expect(deck.giveTop().name).toBe(CARDS_MOCKED[0].name)
    expect(deck.giveTop().name).toBe(CARDS_MOCKED[1].name)
    expect(deck.giveTop().name).toBe(CARDS_MOCKED[2].name)
  })

  it('can give N cards from top', () => {
    const deck = new Deck({ cards: CARDS_MOCKED });

    const cardsGiven = deck.giveCards(2);
    
    expect(cardsGiven).toHaveLength(2);
    expect(cardsGiven[1].name).toBe(CARDS_MOCKED[1].name)
  })
})