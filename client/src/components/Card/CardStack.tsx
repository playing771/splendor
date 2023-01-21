import React, { memo } from 'react';

import styles from './styles.module.scss';

import cn from 'classnames';
import { Card } from '.';
import { EGemColor } from '../../../../interfaces/gem';
import { CardShort } from './CardShort';

interface IProps {
  count: number;
  color?: EGemColor;
  cardClassName?: string;
  maxCountVisible?: number;
}

export const CardStack = memo(({ count, color, cardClassName, maxCountVisible = 6 }: IProps) => {

  const countCorrected = Math.min(count, maxCountVisible);

  const countList = [...Array(countCorrected).keys()];
  return <ul className={cn(styles.CardStack)}>
    {countList.map((index) => (
      <li key={index} className={styles.CardStack_card} style={{ bottom: index, left: Math.max(0, index / 2) }}>
        <CardShort color={color} counter={count} className={cardClassName}/>
      </li>

    ))}
    {/* <span className={cn(styles.GemStack_counter, styles[`GemStack_counter__${gemSize}`])}>{count}</span> */}
  </ul>
});
