import React from 'react';
import { EGemColor } from '../../../../interfaces/gem';
import { GemIcon } from '../Gem/GemIcon';

import cn from 'classnames';

import styles from './styles.module.scss';

interface IProps {
  color?: EGemColor;
  counter: number;
  className?:string;
}

export const CardShort = ({ color, counter, className }: IProps) => {
  
  return (
    <div className={cn(styles.CardShort, styles[`CardShort__${color}`], className)}>
      {counter && <span className={styles.CardShort_counter}>{counter}</span>}
      {/* <div className={styles.CardShort_gemIcon}>
        <GemIcon color={color} />
      </div> */}
    </div>
  );
};
