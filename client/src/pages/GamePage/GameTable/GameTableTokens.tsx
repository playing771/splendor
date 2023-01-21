import { useCallback, useState } from 'react';
import { TPlayerGems } from '../../../../../interfaces/player';
import { EGemColor } from '../../../../../interfaces/gem';
import { PlayerGemsList, GemsToTakeList } from '../../../components/GemsList';
import { Modal } from '../../../components/Modal';

const emptyTokensToTake = {
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

  const handleClearClick = () => {
    setTokensToTake(emptyTokensToTake);
  }

  return (
    <div className="GameTableTokens">
      <div style={{ display: 'flex', columnGap: 8 }}>
        <div>
          <button onClick={handleToggleTakeTokens} style={{ width: 130 }}>
            Take gems
          </button>

          <PlayerGemsList
            gems={gems}
            isActive={canTakeTokens}
            onClick={handleTokenTakeClick}
          />

        </div>

      </div>

      <Modal isOpen={canTakeTokens} onRequestClose={handleToggleTakeTokens}>
        <div style={{ maxWidth: 500, display: 'flex' }}>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <PlayerGemsList
              gems={tokensRemaining}
              isActive={canTakeTokens}
              onClick={handleTokenTakeClick}
            />
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <GemsToTakeList
              gems={tokensToTake}
              isActive={true}
              onClick={handleTokenReturnClick}
            />
          </div>
          <div>
            <button onClick={handleClearClick}>Clear</button>
            <button
              disabled={!tokensToTakeCount}
              style={{ width: 130 }}
              onClick={handleSubmitTakeTokens}
            >
              Submit
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
