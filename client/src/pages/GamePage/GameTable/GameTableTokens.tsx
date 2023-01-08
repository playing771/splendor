import { useCallback, useState } from 'react';
import { IGameStateDTO } from '../../../../../interfaces/api';
import { TPlayerTokens } from '../../../../../interfaces/player';
import { ETokenColor } from '../../../../../interfaces/token';
import { TableTokensList, TokensToTakeList } from '../TokensList';

const tokensList = Object.values(ETokenColor);

const emptyTokensToTake = {
  [ETokenColor.Black]: 0,
  [ETokenColor.Red]: 0,
  [ETokenColor.Green]: 0,
  [ETokenColor.Blue]: 0,
  [ETokenColor.Gold]: 0,
  [ETokenColor.White]: 0,
};


export const GameTableTokens = ({
  tokens,
  onTakeTokensSubmit,
}: {
  tokens: TPlayerTokens;
  onTakeTokensSubmit: (tokens: Partial<TPlayerTokens>) => void;
}) => {
  const [canTakeTokens, setCanTakeTokens] = useState(false);
  const [tokensToTake, setTokensToTake] =
    useState<Partial<TPlayerTokens>>(emptyTokensToTake);

  const tokensRemaining = Object.values(ETokenColor).reduce(
    (acc, color) => {
      acc[color] = acc[color] - (tokensToTake[color] || 0);
      return acc;
    },
    { ...tokens }
  );

  const tokensToTakeCount = Object.values(tokensToTake).reduce(
    (acc, count) => acc += count
    , 0);

  const handleToggleTakeTokens = () => {
    if (canTakeTokens) {
      setTokensToTake(emptyTokensToTake);
    }
    setCanTakeTokens((prev) => !prev);
  };

  const handleTokenTakeClick = useCallback(
    (color: ETokenColor) => {
      if (
        canTakeTokens &&
        color !== ETokenColor.Gold &&
        tokensRemaining[color] > 0
      ) {
        setTokensToTake((prev) => ({ ...prev, [color]: (prev[color] || 0) + 1 }));
      }
    },
    [canTakeTokens, tokensRemaining]
  );

  const handleTokenReturnClick = useCallback((color: ETokenColor) => {
    setTokensToTake((prev) => ({ ...prev, [color]: (prev[color] || 0) - 1 }));
  }, []);

  const handleSubmitTakeTokens = () => {
    onTakeTokensSubmit(tokensToTake);
    setTokensToTake(emptyTokensToTake);
    setCanTakeTokens(false);
  };

  return (
    <div className="GameTableTokens">
      <div style={{ display: 'flex', columnGap: 8 }}>
        <div>
          <button onClick={handleToggleTakeTokens} style={{ width: 130 }}>
            {canTakeTokens ? 'Cancel' : 'Take tokens'}
          </button>

          <TableTokensList
            tokens={tokensRemaining}
            isActive={canTakeTokens}
            onClick={handleTokenTakeClick}
          />

        </div>
        <div>
          <button
            disabled={!tokensToTakeCount}
            style={{ width: 130 }}
            onClick={handleSubmitTakeTokens}
          >
            Submit
          </button>

          <TokensToTakeList
            tokens={tokensToTake}
            isActive={true}
            onClick={handleTokenReturnClick}
          />
          {/* {tokensList
            .filter((color) => tokensToTake[color] > 0)
            .map((color) => {
              return (
                <div className="GameTableTokens_itemContainer">
                  <div
                    key={color}
                    onClick={handleTokenReturnClick(color)}
                    className={`GameTableTokens_item GameTableTokens_item__${color} ${
                      canTakeTokens && 'GameTableTokens_item__active'
                    }`}
                  >
                    {tokensToTake[color]}
                  </div>
                </div>
              );
            })} */}
        </div>
      </div>
    </div>
  );
};
