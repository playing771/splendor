import React from 'react';
import { Gem, IGemProps } from '.';
import { EGemColor } from '../../../../../interfaces/gem';

import cn from 'classnames'

import styles from './styles.module.scss';

interface IProps {
  color: EGemColor;
  count: number;
  gemSize: IGemProps['size'];
}

export const GemStack = ({ color, count, gemSize }: IProps) => {
  const countList = [...Array(Math.max(count, 1)).keys()];
  return (
    <ul className={cn(styles.GemStack, { [styles.GemStack__empty]: count === 0 })}>
      {countList.map((count) => (
        <li key={count} className={styles.GemStack_gem} style={{ top: count * 2, left: count }}>
          <Gem color={color} size={gemSize} />
        </li>

      ))}
      <span className={cn(styles.GemStack_counter, styles[`GemStack_counter__${gemSize}`])}>{count}</span>
    </ul>
  );
};
