import React from 'react';
import { Gem, IGemProps } from '.';
import { EGemColor } from '../../../../interfaces/gem';

import cn from 'classnames'

import styles from './styles.module.scss';

interface IProps {
  color: EGemColor;
  count: number;
  gemSize: IGemProps['size'];
  onClick?: (color: EGemColor) => void;
  isActive?: boolean;
}

export const GemStack = ({ color, count, gemSize, onClick, isActive }: IProps) => {
  const countList = [...Array(Math.max(count, 1)).keys()];

  const handleClick = () => {
    onClick && onClick(color)
  }
  return (
    <ul className={cn(styles.GemStack, { [styles.GemStack__empty]: count === 0, [styles.GemStack__active]: isActive })} onClick={handleClick}>
      {countList.map((index) => (
        <li key={index} className={styles.GemStack_gem} style={{ bottom: index, left: index }}>
          <Gem color={color} size={gemSize} />
        </li>

      ))}
      <span className={cn(styles.GemStack_counter, styles[`GemStack_counter__${gemSize}`])}>{count}</span>
    </ul>
  );
};
