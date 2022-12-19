import { ICardShape } from "../../interfaces/card";
import { BaseDeck } from "./BaseDeck"

const CARDS_MOCKED = [{ id: "one" }, { id: "two" }]

describe('Deck functionality', () => {

  it('is created with name', () => {
    const deck = new BaseDeck({ name: 'Deck', cards: [] });
    expect(deck.name).toBe('Deck');
  })

  // it('is created with cards provided', () => {
  //   const deck = new BaseDeck({ cards: CARDS_MOCKED, name: 'TestDeck' });
  //   expect(deck.cards).toHaveLength(CARDS_MOCKED.length);
  //   expect(deck.cards[1].id).toBe(CARDS_MOCKED[1].id);
  // })

  // it('can give top card', () => {
  //   const deck = new BaseDeck({ cards: CARDS_MOCKED });
  //   expect(deck.giveTop().name).toBe(CARDS_MOCKED[0].name)
  //   expect(deck.giveTop().name).toBe(CARDS_MOCKED[1].name)
  //   expect(deck.giveTop().name).toBe(CARDS_MOCKED[2].name)
  // })

  // it('can give N cards from top', () => {
  //   const deck = new BaseDeck({ cards: CARDS_MOCKED });

  //   const cardsGiven = deck.giveCards(2);

  //   expect(cardsGiven).toHaveLength(2);
  //   expect(cardsGiven[1].name).toBe(CARDS_MOCKED[1].name)
  // })
})