import React, { memo } from 'react';
import { TPlayerTokens } from '../../../../../interfaces/player';
import { ETokenColor } from '../../../../../interfaces/token';
import { getKeys } from '../../../../../utils/typescript';

import './styles.css';

interface ITableTokensProps extends IBasicTokensList {
  tokens: TPlayerTokens;
}

interface ITokensToTakeProps extends IBasicTokensList {
  tokens: Partial<TPlayerTokens>;
}

interface IBasicTokensList {
  isActive?: boolean;
  onClick?: (onClick: ETokenColor) => void;
  orientaion?: 'horizontal' | 'vertical';
}

const BasicTokensList = memo(
  ({
    tokensList,
    isActive,
    onClick,
    orientaion = 'vertical',
  }: IBasicTokensList & {
    tokensList: Array<{ color: ETokenColor; value: number }>;
  }) => {
    const handleClick = (color: ETokenColor) => () => {
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
                color !== ETokenColor.Gold &&
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

export const TableTokensList = memo(
  ({ tokens, ...rest }: ITableTokensProps) => {
    const tokensList = getKeys(tokens).reduce((acc, color) => {
      const value = tokens[color];
      acc.push({ color, value });
      return acc;
    }, [] as Array<{ color: ETokenColor; value: number }>);

    return <BasicTokensList tokensList={tokensList} {...rest} />;
  }
);

export const TokensToTakeList = memo(
  ({ tokens, ...rest }: ITokensToTakeProps) => {
    const tokensList = getKeys(tokens).reduce((acc, color) => {
      const value = tokens[color];
      if (!!value) {
        acc.push({ color, value });
      }
      return acc;
    }, [] as Array<{ color: ETokenColor; value: number }>);

    return <BasicTokensList tokensList={tokensList} {...rest} />;
  }
);
