import { ICardShape } from "../../../../../interfaces/card";
import { EDevDeckLevel } from "../../../../../interfaces/devDeck";
import { ETokenColor } from "../../../../../interfaces/token";

export const DeckLevelRow = ({
  cardsCountInDeck,
  cards,
  lvl,
}: {
  cardsCountInDeck: number;
  cards: ICardShape[];
  lvl: EDevDeckLevel;
}) => {
  return (
    <div className="DeckLevelRow">
      <div className={`Deck Deck__${lvl}`}>{cardsCountInDeck}</div>
      {cards.map(({ score, cost, color, id }) => {
        const costs = Object.entries(cost).filter(
          ([_, value]) => value > 0
        ) as [ETokenColor, number][];

        return (
          <div key={id} className="Card">
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