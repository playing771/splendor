import React from 'react';

import styles from './styles.module.scss';

import cn from 'classnames';
import { Card } from '.';
import { EGemColor } from '../../../../../interfaces/gem';
import { CardShort } from './CardShort';

interface IProps {
  count: number;
  color: EGemColor;
}

export const CardStack = ({ count, color }: IProps) => {
  
  const countList = [...Array(count).keys()];
  return <ul className={cn(styles.CardStack)}>
    {countList.map((index) => (
      <li key={index} className={styles.CardStack_card} style={{ top: index * 2, left: index }}>
        <CardShort color={color} counter={count}/>
      </li>

    ))}
    {/* <span className={cn(styles.GemStack_counter, styles[`GemStack_counter__${gemSize}`])}>{count}</span> */}
  </ul>
};
