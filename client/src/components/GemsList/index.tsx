import React, { memo } from 'react';
import { TPlayerGems } from '../../../../interfaces/player';
import { EGemColor } from '../../../../interfaces/gem';
import { getKeys } from '../../../../utils/typescript';

import './styles.css';
import { GemStack } from '../Gem/GemStack';

interface ITableTokensProps extends IBasicTokensList {
  gems: TPlayerGems;
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
      <ul className={`TokensList TokensList__${orientaion}`}>
        {gemsList.map(({ color, value }) => {
          return (
            <GemStack key={color} count={value} gemSize='lg' color={color} onClick={onClick}/>
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
      acc.push({ color, value });
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
