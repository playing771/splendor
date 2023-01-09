import React, { memo } from 'react';
import { TPlayerTokens } from '../../../../../interfaces/player';
import { EGemColor } from '../../../../../interfaces/gem';
import { getKeys } from '../../../../../utils/typescript';

import './styles.css';

interface ITableTokensProps extends IBasicTokensList {
  gems: TPlayerTokens;
}

interface ITokensToTakeProps extends IBasicTokensList {
  gems: Partial<TPlayerTokens>;
}

interface IBasicTokensList {
  isActive?: boolean;
  onClick?: (onClick: EGemColor) => void;
  orientaion?: 'horizontal' | 'vertical';
}

const BasicGemsList = memo(
  ({
    tokensList,
    isActive,
    onClick,
    orientaion = 'vertical',
  }: IBasicTokensList & {
    tokensList: Array<{ color: EGemColor; value: number }>;
  }) => {
    const handleClick = (color: EGemColor) => () => {
      onClick && onClick(color);
    };

    return (
      <ul className={`TokensList TokensList__${orientaion}`}>
        {tokensList.map(({ color, value }) => {
          return (
            <div
              key={color}
              onClick={handleClick(color)}
              className={`TokensList_item TokensList_item__${color} ${
                isActive &&
                color !== EGemColor.Gold &&
                'TokensList_item__active'
              }`}
            >
              {value}
            </div>
          );
        })}
      </ul>
    );
  }
);

export const TableGemsList = memo(
  ({ gems, ...rest }: ITableTokensProps) => {
    const tokensList = getKeys(gems).reduce((acc, color) => {
      const value = gems[color];
      acc.push({ color, value });
      return acc;
    }, [] as Array<{ color: EGemColor; value: number }>);

    return <BasicGemsList tokensList={tokensList} {...rest} />;
  }
);

export const GemsToTakeList = memo(
  ({ gems, ...rest }: ITokensToTakeProps) => {
    const tokensList = getKeys(gems).reduce((acc, color) => {
      const value = gems[color];
      if (!!value) {
        acc.push({ color, value });
      }
      return acc;
    }, [] as Array<{ color: EGemColor; value: number }>);

    return <BasicGemsList tokensList={tokensList} {...rest} />;
  }
);
