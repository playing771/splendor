import { useCallback, useState } from 'react';
import { TPlayerGems } from '../../../../../interfaces/player';
import { EGemColor } from '../../../../../interfaces/gem';
import { PlayerGemsList, GemsToTakeList } from '../../../components/GemsList';
import { Modal } from '../../../components/Modal';
import { TokensModal } from '../TokensModal';

const emptyTokensToTake = {};

export const GameTableTokens = ({
  gems,
  onTakeTokensSubmit,
}: {
  gems: TPlayerGems;
  onTakeTokensSubmit: (gems: Partial<TPlayerGems>) => void;
}) => {
  const [canTakeTokens, setCanTakeTokens] = useState(false);
  const [gemsToTake, setTokensToTake] =
    useState<Partial<TPlayerGems>>(emptyTokensToTake);

  const gemsRemaining = Object.values(EGemColor).reduce(
    (acc, color) => {
      acc[color] = acc[color] - (gemsToTake[color] || 0);
      return acc;
    },
    { ...gems }
  );

  const gemsToTakeCount = Object.values(gemsToTake).reduce(
    (acc, count) => (acc += count),
    0
  );

  const handleToggleTakeTokens = () => {
    if (canTakeTokens) {
      setTokensToTake(emptyTokensToTake);
    }
    setCanTakeTokens((prev) => !prev);
  };

  const handleGemTakeClick = useCallback(
    (color: EGemColor) => {

      if (
        canTakeTokens &&
        color !== EGemColor.Gold &&
        gemsRemaining[color] > 0
      ) {
        setTokensToTake((prev) => ({
          ...prev,
          [color]: (prev[color] || 0) + 1,
        }));
      }
    },
    [canTakeTokens, gemsRemaining]
  );

  const handleTokenReturnClick = useCallback((color: EGemColor) => {
    setTokensToTake((prev) => ({ ...prev, [color]: (prev[color] || 0) - 1 }));
  }, []);

  const handleSubmitTakeTokens = () => {
    onTakeTokensSubmit(gemsToTake);
    setTokensToTake(emptyTokensToTake);
    setCanTakeTokens(false);
  };

  const handleClearClick = () => {
    setTokensToTake(emptyTokensToTake);
  };

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
            onClick={handleGemTakeClick}
          />
        </div>
      </div>

      {canTakeTokens && <TokensModal
        handleGemTakeClick={handleGemTakeClick}
        gemsRemaining={gemsRemaining}
        gemsToTake={gemsToTake}
        gemsToTakeCount={gemsToTakeCount}
        handleClose={handleToggleTakeTokens}
        handleGemGiveBack={handleTokenReturnClick}
        onClear={handleClearClick}
        onSubmit={handleSubmitTakeTokens}
      />}

      {/* <Modal isOpen={canTakeTokens} onRequestClose={handleToggleTakeTokens}>
        <div style={{ maxWidth: 500, display: 'flex' }}>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <PlayerGemsList
              gems={gemsRemaining}
              isActive={canTakeTokens}
              onClick={handleGemTakeClick}
            />
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <GemsToTakeList
              gems={gemsToTake}
              isActive={true}
              onClick={handleTokenReturnClick}
            />
          </div>
          <div>
            <button onClick={handleClearClick}>Clear</button>
            <button
              disabled={!gemsToTakeCount}
              style={{ width: 130 }}
              onClick={handleSubmitTakeTokens}
            >
              Submit
            </button>
          </div>
        </div>
      </Modal> */}
    </div>
  );
};
