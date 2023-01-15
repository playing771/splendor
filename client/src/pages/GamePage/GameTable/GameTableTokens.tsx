import { useCallback, useState } from 'react';
import { TPlayerGems } from '../../../../../interfaces/player';
import { EGemColor } from '../../../../../interfaces/gem';
import { PlayerGemsList, GemsToTakeList } from '../GemsList';

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
  gems: TPlayerGems;
  onTakeTokensSubmit: (gems: Partial<TPlayerGems>) => void;
}) => {
  const [canTakeTokens, setCanTakeTokens] = useState(false);
  const [tokensToTake, setTokensToTake] =
    useState<Partial<TPlayerGems>>(emptyTokensToTake);

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
          <button
            disabled={!tokensToTakeCount}
            style={{ width: 130 }}
            onClick={handleSubmitTakeTokens}
          >
            Submit
          </button>
          <PlayerGemsList
            gems={tokensRemaining}
            isActive={canTakeTokens}
            onClick={handleTokenTakeClick}
          />

        </div>
        <div>


          <GemsToTakeList
            gems={tokensToTake}
            isActive={true}
            onClick={handleTokenReturnClick}
          />
        </div>
      </div>
    </div>
  );
};
