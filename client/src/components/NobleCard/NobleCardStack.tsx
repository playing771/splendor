import React, { memo } from 'react';

import cn from 'classnames';

import styles from './styles.module.scss';
import { INobleProps, NobleCard } from '.';
import { INobleShape } from '../../../../interfaces/noble';

interface IProps {
  // count: number;
  nobles: INobleShape[];
  size: INobleProps['size'];
}

// TODO: add shared Stack component

export const NobleCardStack = memo(({ nobles, size }: IProps) => {
  // const countCorrected = count;

  // const countList = [...Array(countCorrected).keys()];
  return (
    <div className={cn(styles.NobleStack)}>
      {nobles.map((noble, index) => {
        return (
          <NobleCard
            key={noble.id}
            {...noble}
            size={size}
            className={cn(styles.NobleStack_card, styles.NobleStack_item)}
            style={{ top: index * 20, left: index * 5 }}
          />
        );
      })}
      {/* <span className={cn(styles.GemStack_counter, styles[`GemStack_counter__${gemSize}`])}>{count}</span> */}
    </div>
  );
});
