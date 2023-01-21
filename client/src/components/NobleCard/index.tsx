import { CSSProperties, memo, ReactNode } from 'react';
import { ICardShape } from '../../../../interfaces/card';
import { EGemColor } from '../../../../interfaces/gem';
import { Gem } from '../Gem';

import cn from 'classnames';

import styles from './styles.module.scss';
import { INobleShape } from '../../../../interfaces/noble';

export interface INobleProps extends INobleShape {
  className?: string
  size?: 'xs' | 'sm'
  style?: CSSProperties
}

export const NobleCard = ({ className, requirements, score, size = 'sm', style }: INobleProps) => {
  const gems = Object.entries(requirements);
  return <div className={cn(styles.Noble, styles[`Noble__${size}`], className)} style={style}>
    <div className={styles.Noble_info}>
      {/* <div className={cn(styles.Noble_header)}>
      <span>{score}</span>
    </div> */}
      <div className={styles.Noble_requirements}>
        {gems.map(([color, value]) => {
          return (
            <div className={styles.Requirement} key={color}>
              <Gem
                key={color}
                color={color as EGemColor}
                size={size === 'sm'? 'xs': 'xxs'}
                value={value}
              />
            </div>
          );
        })}
      </div>

      <span className={styles.Noble_score}>{score}</span>
    </div>
  </div>
};
