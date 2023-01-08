import React, { memo } from 'react';
import { ICardShape } from '../../../../../interfaces/card';
import { ETokenColor } from '../../../../../interfaces/token';

import './styles.css';

interface IProps extends ICardShape {
  onClick?: (cardId: string) => void;
}

export const Card = memo(({ id, color, cost, score, onClick }: IProps) => {
  const handleCardClick = (cardId: string) => () => {
    onClick && onClick(cardId);
  };

  const costs = Object.entries(cost).filter(([_, value]) => value > 0) as [
    ETokenColor,
    number
  ][];

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
});
