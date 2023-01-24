import React from 'react';

import cn from 'classnames'

import styles from './styles.module.scss';
import { EGemColor, EGemColorPickable } from '../../../../interfaces/gem';


interface IProps {
  color: EGemColorPickable;
  count: number;
  className?: string
}

export const RequirementCard = ({ color, count, className }: IProps) => {
  return <div
    className={cn(
      styles.RequirementCard,
      styles[`RequirementCard__${color}`],
      // styles[`Gem__${size}`],
      className
    )}
  >

    <span className={styles.RequirementCard_value}>{count}</span>


  </div>;
};
