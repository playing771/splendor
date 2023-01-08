import { ICardShape } from "../../../../../interfaces/card";
import { EDeckLevel } from "../../../../../interfaces/devDeck";
import { ETokenColor } from "../../../../../interfaces/token";
import { Card } from "../Card";

export const DeckLevelRow = ({
  cardsCountInDeck,
  cards,
  lvl,
  onCardClick
}: {
  cardsCountInDeck: number;
  cards: ICardShape[];
  lvl: EDeckLevel;
  onCardClick: (cardId: string) => void
}) => {

  const handleCardClick = (cardId: string) => {
    onCardClick(cardId)
  }

  return (
    <div className="DeckLevelRow">
      <div className={`Deck Deck__${lvl}`}>{cardsCountInDeck}</div>
      {cards.map((cardData) => {
        return <Card  {...cardData} onClick={handleCardClick}/>
      })}
    </div>
  );
};