import { useCallback, useState } from 'react';
import { TPlayerGems } from '../../../../../interfaces/player';
import { EGemColor } from '../../../../../interfaces/gem';
import { PlayerGemsList } from '../../../components/GemsList';

import cn from 'classnames';

import styles from './styles.module.scss';

const emptyTokensToTake = {};

export const GameTableGems = ({
  gems,
  onTakeTokensSubmit,
  isDisabled,
}: {
  gems: TPlayerGems;
  onTakeTokensSubmit: (gems: Partial<TPlayerGems>) => void;
  isDisabled?: boolean;
}) => {
  // const [canTakeTokens, setCanTakeTokens] = useState(false);
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

  const handleGemTakeClick = useCallback(
    (color: EGemColor) => {
      if (isDisabled) {
        return;
      }
      if (color !== EGemColor.Gold && gemsRemaining[color] > 0) {
        setTokensToTake((prev) => ({
          ...prev,
          [color]: (prev[color] || 0) + 1,
        }));
      }
    },
    [isDisabled, gemsRemaining]
  );

  const handleTokenReturnClick = useCallback((color: EGemColor) => {
    setTokensToTake((prev) => {
      const newTokens = { ...prev, [color]: (prev[color] || 0) - 1 };
      if (newTokens[color] === 0) {
        delete newTokens[color];
      }
      return newTokens;
    });
  }, []);

  const handleSubmitTakeTokens = () => {
    onTakeTokensSubmit(gemsToTake);
    setTokensToTake(emptyTokensToTake);
  };

  const handleClearClick = () => {
    setTokensToTake(emptyTokensToTake);
  };

  return (
    <div
      className={cn(styles.GameTableGems, {
        [styles.GameTableGems__disabled]: isDisabled,
      })}
    >
      <div className={styles.Columns}>
        <div className={styles.Columns_column}>
          <PlayerGemsList
            gems={gemsRemaining}
            isActive={!isDisabled}
            onClick={handleGemTakeClick}
          />
        </div>
        <div className={styles.Columns_column}>
          <PlayerGemsList
            gems={gemsToTake}
            isActive={!isDisabled}
            onClick={handleTokenReturnClick}
          />
        </div>
      </div>
      {gemsToTakeCount > 0 && <button onClick={handleSubmitTakeTokens} style={{marginTop: 12, width: '100%'}}>
        Take gems
      </button>}
    </div>
  );
};
