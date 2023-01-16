import React, { ComponentType, ReactElement } from 'react';
import { EGemColor } from '../../../../../interfaces/gem';



import cn from 'classnames'

import styles from './styles.module.scss'
import { GemIcon } from './GemIcon';

export interface IGemProps {
  color: EGemColor;
  size?: 'xxs' | 'xs' | 'sm' | 'lg'
}


export const Gem = ({ color, size = 'sm' }: IGemProps) => {
  return <div className={cn(styles.Gem, styles[`Gem__${color}`], styles[`Gem__${size}`])}>
    <GemIcon color={color} />
  </div>;
};
