import { ICardShape } from "../../../../../interfaces/card";
import { EDeckLevel } from "../../../../../interfaces/devDeck";
import { EGemColor } from "../../../../../interfaces/gem";
import { Card } from "../Card";
import { CardWithActions } from "../Card/CardWithActions";

export const DeckLevelRow = ({
  cardsCountInDeck,
  cards,
  lvl,
  onBuyCard,
  onHoldCard,
  onHoldCardFromDeck
}: {
  cardsCountInDeck: number;
  cards: ICardShape[];
  lvl: EDeckLevel;
  onBuyCard: (cardId: string) => void;
  onHoldCard: (cardId: string) => void;
  onHoldCardFromDeck: (deckLvl: EDeckLevel)=> void;
}) => {

  return (
    <div className="DeckLevelRow">
      <div className={`Deck Deck__${lvl}`} onClick={()=>onHoldCardFromDeck(lvl)}>{cardsCountInDeck}</div>
      {cards.map((cardData) => {
        return <CardWithActions key={cardData.id} {...cardData} onBuyClick={onBuyCard} onHoldClick={onHoldCard}/>
      })}
    </div>
  );
};