import React, { memo } from 'react';
import { TPlayerGems } from '../../../../interfaces/player';
import { EGemColor } from '../../../../interfaces/gem';
import { getKeys } from '../../../../utils/typescript';

import { GemStack } from '../Gem/GemStack';

import cn from 'classnames'

import styles from './styles.module.scss';

interface ITableTokensProps extends IBasicTokensList {
  gems: Partial<TPlayerGems>;
}

interface ITokensToTakeProps extends IBasicTokensList {
  gems: Partial<TPlayerGems>;
}

interface IBasicTokensList {
  isActive?: boolean;
  onClick?: (color: EGemColor) => void;
  orientaion?: 'horizontal' | 'vertical';
}

export const BasicGemsList = memo(
  ({
    gemsList,
    isActive,
    onClick,
    orientaion = 'vertical',
  }: IBasicTokensList & {
    gemsList: Array<{ color: EGemColor; value: number }>;
  }) => {
    return (
      <ul className={cn(styles.GemsList, styles[`GemsList__${orientaion}`])}>
        {gemsList.map(({ color, value }) => {
          return (
            <GemStack key={color} count={value} gemSize='lg' color={color} onClick={onClick} isActive={isActive}/>
          );
        })}
      </ul>
    );
  }
);

export const PlayerGemsList = memo(
  ({ gems, ...rest }: ITableTokensProps) => {
    const gemsList = getKeys(gems).reduce((acc, color) => {
      const value = gems[color];
      if (value !== undefined) {
        acc.push({ color, value });
      }

      return acc;
    }, [] as Array<{ color: EGemColor; value: number }>);

    return <BasicGemsList gemsList={gemsList} {...rest} />;
  }
);

export const GemsToTakeList = memo(
  ({ gems, ...rest }: ITokensToTakeProps) => {
    const gemsList = getKeys(gems).reduce((acc, color) => {
      const value = gems[color];
      if (!!value) {
        acc.push({ color, value });
      }
      return acc;
    }, [] as Array<{ color: EGemColor; value: number }>);

    return <BasicGemsList gemsList={gemsList} {...rest} />;
  }
);
