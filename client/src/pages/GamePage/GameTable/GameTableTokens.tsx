import { useCallback, useState } from 'react';
import { IGameStateDTO } from '../../../../../interfaces/api';
import { TPlayerTokens } from '../../../../../interfaces/player';
import { EGemColor } from '../../../../../interfaces/gem';
import { TableGemsList, GemsToTakeList } from '../GemsList';

const tokensList = Object.values(EGemColor);

const emptyTokensToTake = {
  [EGemColor.Black]: 0,
  [EGemColor.Red]: 0,
  [EGemColor.Green]: 0,
  [EGemColor.Blue]: 0,
  [EGemColor.Gold]: 0,
  [EGemColor.White]: 0,
};


export const GameTableTokens = ({
  gems,
  onTakeTokensSubmit,
}: {
  gems: TPlayerTokens;
  onTakeTokensSubmit: (gems: Partial<TPlayerTokens>) => void;
}) => {
  const [canTakeTokens, setCanTakeTokens] = useState(false);
  const [tokensToTake, setTokensToTake] =
    useState<Partial<TPlayerTokens>>(emptyTokensToTake);

  const tokensRemaining = Object.values(EGemColor).reduce(
    (acc, color) => {
      acc[color] = acc[color] - (tokensToTake[color] || 0);
      return acc;
    },
    { ...gems }
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
    (color: EGemColor) => {
      if (
        canTakeTokens &&
        color !== EGemColor.Gold &&
        tokensRemaining[color] > 0
      ) {
        setTokensToTake((prev) => ({ ...prev, [color]: (prev[color] || 0) + 1 }));
      }
    },
    [canTakeTokens, tokensRemaining]
  );

  const handleTokenReturnClick = useCallback((color: EGemColor) => {
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
            {canTakeTokens ? 'Cancel' : 'Take gems'}
          </button>

          <TableGemsList
            gems={tokensRemaining}
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

          <GemsToTakeList
            gems={tokensToTake}
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
