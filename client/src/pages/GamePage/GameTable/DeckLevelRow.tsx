import { ICardShape } from "../../../../../interfaces/card";
import { EDeckLevel } from "../../../../../interfaces/devDeck";
import { ETokenColor } from "../../../../../interfaces/token";

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

  const handleCardClick = (cardId: string) => () => {
    onCardClick(cardId)
  }

  return (
    <div className="DeckLevelRow">
      <div className={`Deck Deck__${lvl}`}>{cardsCountInDeck}</div>
      {cards.map(({ score, cost, color, id }, index) => {
        const costs = Object.entries(cost).filter(
          ([_, value]) => value > 0
        ) as [ETokenColor, number][];

        return (
          <div key={id} className="Card" onClick={handleCardClick(id)}>
            <div className="Card_header">
              <span className="Card_headerScore">{score}</span>
              <span className="Card_headerColor">{color}</span>
            </div>
            <div className="Card_cost">
              {costs.map(([color, value]) => {
                return (
                  <div
                    key={color}
                    className={`Card_costItem Card_costItem__${color}`}
                  >
                    {value}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};