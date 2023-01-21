import { memo, ReactNode } from 'react';
import { ICardShape } from '../../../../interfaces/card';
import { EGemColor } from '../../../../interfaces/gem';
import { Gem } from '../Gem';

import cn from 'classnames';

import styles from './styles.module.scss';

export interface ICardProps extends ICardShape {
  size?: 'sm' | 'lg'
  className?: string;
  children?: ReactNode;
  onClick?: (cardId: string, cardInfo: ICardShape) => void
}

export const Card = memo(
  ({ size = 'sm', className, children, onClick, ...cardInfo }: ICardProps) => {
    const { color, cost, id, score } = cardInfo;
    const costs = Object.entries(cost).filter(([_, value]) => value > 0) as [
      EGemColor,
      number
    ][];

    const handleCardClick = () => {
      onClick && onClick(id, cardInfo);
    }

    return (
      <div key={id} className={cn(styles.Card, styles[`Card__${color}`], styles[`Card__${size}`], className)} onClick={handleCardClick}>
        <div className={styles.Card_info}>
          <div className={cn(styles.Card_header)}>
            {/* <span>{score}</span> */}
            
            {/* <Gem color={color} size={size} className={styles.Card_gem}/> */}

          </div>
          <div className={styles.Card_cost}>
            {costs.map(([color, value]) => {
              return (
                <div className={styles.GemCost} key={color}>
                  <Gem
                    key={color}
                    color={color}
                    size={size === 'lg' ? 'sm' : 'xs'}
                    value={value}
                  />
                  {/* <span className={styles.GemCost_value}>{value}</span> */}
                </div>
              );
            })}
          </div>
          {children}
          <span className={styles.Card_score}>{score}</span>
        </div>
      </div>
    );
  }
);
