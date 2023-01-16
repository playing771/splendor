import { ICardShape } from "../../../../../interfaces/card";
import { EDeckLevel } from "../../../../../interfaces/devDeck";
import { EGemColor } from "../../../../../interfaces/gem";
import { Card } from "../Card";
import { CardWithActions } from "../Card/CardWithActions";

export const DeckLevelRow = ({
  cardsCountInDeck,
  cards,
  lvl,
  onClick,
  onHoldCardFromDeck
}: {
  cardsCountInDeck: number;
  cards: ICardShape[];
  lvl: EDeckLevel;
  onClick: (cardId:string, cardInfo: ICardShape)=>void;
  onHoldCardFromDeck: (deckLvl: EDeckLevel)=> void;
}) => {

  return (
    <div className="DeckLevelRow">
      <div className={`Deck Deck__${lvl}`} onClick={()=>onHoldCardFromDeck(lvl)}>{cardsCountInDeck}</div>
      {cards.map((cardData) => {
        return <Card key={cardData.id} onClick={onClick} {...cardData}/>
      })}
    </div>
  );
};