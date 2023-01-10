import React, { memo, ReactNode } from 'react';
import { ICardShape } from '../../../../../interfaces/card';
import { EGemColor } from '../../../../../interfaces/gem';
import { concatClassNames } from '../../../utils/concatClassNames';

import './styles.css';

export interface ICardProps extends ICardShape {
  className?:string;
  children?: ReactNode;
}

export const Card = memo(({ id, color, cost, score, className, children }: ICardProps) => {
  const costs = Object.entries(cost).filter(([_, value]) => value > 0) as [
    EGemColor,
    number
  ][];

  return (
    <div key={id} className={concatClassNames("Card", className)}>
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
      {children}
    </div>
  );
});
