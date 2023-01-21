import React, { ComponentType, ReactElement } from 'react';
import { EGemColor } from '../../../../interfaces/gem';

import cn from 'classnames';

import styles from './styles.module.scss';
import { GemIcon } from './GemIcon';

export interface IGemProps {
  color: EGemColor;
  size?: 'xxs' | 'xs' | 'sm' | 'lg';
  value?: number;
  className?:string;
}

export const Gem = ({ color, className, size = 'sm', value }: IGemProps) => {
  return (
    <div
      className={cn(
        styles.Gem,
        styles[`Gem__${color}`],
        styles[`Gem__${size}`],
        className
      )}
    >
      {typeof value !== 'undefined' ? (
        <>
          <span className={styles.Gem_value}>{value}</span>
          <div className={styles.Gem_miniature}>
            <GemIcon color={color} />
          </div>
        </>
      ) : (
        <GemIcon color={color} />
      )}
    </div>
  );
};
