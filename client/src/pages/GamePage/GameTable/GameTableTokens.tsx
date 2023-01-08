import { useState } from 'react';
import { IGameStateDTO } from '../../../../../interfaces/api';
import { TPlayerTokens } from '../../../../../interfaces/player';
import { ETokenColor } from '../../../../../interfaces/token';

const tokensList = Object.values(ETokenColor);

const emptyTokensToTake = {
  [ETokenColor.Black]: 0,
  [ETokenColor.Red]: 0,
  [ETokenColor.Green]: 0,
  [ETokenColor.Blue]: 0,
  [ETokenColor.Gold]: 0,
  [ETokenColor.White]: 0,
};

export const GameTableTokens = ({ tokens, onTakeTokensSubmit }: { tokens: TPlayerTokens, onTakeTokensSubmit: (tokens: TPlayerTokens)=> void }) => {
  const [canTakeTokens, setCanTakeTokens] = useState(false);
  const [tokensToTake, setTokensToTake] =
    useState<TPlayerTokens>(emptyTokensToTake);

  const tokensRemaining = Object.values(ETokenColor).reduce((acc, color) => {
    acc[color] = acc[color] - tokensToTake[color];
    return acc;
  }, { ...tokens })

  const tokensToTakeCount = Object.values(tokensToTake).reduce((acc, count) => acc += count)
  console.log('tokensToTakeCount', tokensToTakeCount);

  const handleToggleTakeTokens = () => {
    if (canTakeTokens) {
      setTokensToTake(emptyTokensToTake);
    }
    setCanTakeTokens((prev) => !prev);
  };

  const handleTokenTakeClick = (color: ETokenColor) => () => {
    if (canTakeTokens && color !== ETokenColor.Gold && tokensRemaining[color] > 0) {
      setTokensToTake((prev) => ({ ...prev, [color]: prev[color] + 1 }));
    }
  };

  const handleTokenReturnClick = (color: ETokenColor) => () => {

    setTokensToTake((prev) => ({ ...prev, [color]: prev[color] - 1 }));

  };

  const handleSubmitTakeTokens = () => {
    onTakeTokensSubmit(tokensToTake)
    setTokensToTake(emptyTokensToTake);
  }

  return (
    <div className="GameTableTokens">
      <div style={{ display: 'flex', columnGap: 8 }}>
        <div>
          <button onClick={handleToggleTakeTokens} style={{ width: 130 }}>
            {canTakeTokens ? 'Cancel' : 'Take tokens'}
          </button>
          {tokensList.map((color) => {
            return (
              <div
                key={color}
                onClick={handleTokenTakeClick(color)}
                className={`GameTableTokens_item GameTableTokens_item__${color} ${canTakeTokens &&
                  color !== ETokenColor.Gold &&
                  'GameTableTokens_item__active'
                  }`}
              >
                {tokensRemaining[color]}
              </div>
            );
          })}
        </div>
        <div>
          <button disabled={!tokensToTakeCount} style={{ width: 130 }} onClick={handleSubmitTakeTokens}>
            Submit
          </button>
          {tokensList
            .filter((color) => tokensToTake[color] > 0)
            .map((color) => {
              return (
                <div className="GameTableTokens_itemContainer">
                  <div
                    key={color}
                    onClick={handleTokenReturnClick(color)}
                    className={`GameTableTokens_item GameTableTokens_item__${color} ${canTakeTokens && 'GameTableTokens_item__active'
                      }`}
                  >
                    {tokensToTake[color]}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
