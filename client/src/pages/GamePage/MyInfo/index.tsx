import React, { useMemo, useState } from 'react';
import { EPlayerAction } from '../../../../../interfaces/game';
import { PlayerGemsList, GemsToTakeList } from '../../../components/GemsList';
import { EGemColor } from '../../../../../interfaces/gem';
import { IPlayerShape, TPlayerGems } from '../../../../../interfaces/player';
import { Nullable } from '../../../../../utils/typescript';
import { PlayerInfo, PlayersList } from '../PlayersList';
import { TokensModal } from '../TokensModal';

import cn from 'classnames';

import styles from './styles.module.scss';
import { Card } from '../../../components/Card';
import { CardModal } from '../CardModal';
import { ICardShape } from '../../../../../interfaces/card';

const emptyTokensToTake = {
  [EGemColor.Black]: 0,
  [EGemColor.Red]: 0,
  [EGemColor.Green]: 0,
  [EGemColor.Blue]: 0,
  [EGemColor.Gold]: 0,
  [EGemColor.White]: 0,
};

interface IProps {
  cardsBought: IPlayerShape['cardsBought'];
  cardsHolded: IPlayerShape['cardsHolded'];
  gems: IPlayerShape['gems'];
  nobles: IPlayerShape['nobles'];
  availableActions: EPlayerAction[];
  onGemsReturn: (gems: Partial<TPlayerGems>) => Promise<void>;
  onBuyHoldedCard: (cardId: string) => void;
}

export const MyInfo = ({
  cardsBought,
  cardsHolded,
  gems,
  nobles,
  availableActions,
  onGemsReturn,
  onBuyHoldedCard,
}: IProps) => {
  const [activeCardId, setActiveCardId] = useState<Nullable<string>>(null);

  const handleReturnGems = () => {
    setGemsToReturn(emptyTokensToTake);
    onGemsReturn(gemsToReturn);
  };

  const handleReturnGemClick = (color: EGemColor) => {
    if (gemsRemaining[color] > 0) {
      setGemsToReturn((prev) => {
        const obj = prev || {};
        const targetCount = obj[color];
        return {
          ...obj,
          [color]: targetCount !== undefined ? targetCount + 1 : 1,
        };
      });
    }
  };

  const handleRevertReturnGemClick = (color: EGemColor) => {
    setGemsToReturn((prev) => {
      const obj = prev || {};
      const targetCount = obj[color];
      return {
        ...obj,
        [color]: targetCount !== undefined ? targetCount - 1 : 0,
      };
    });
  };

  const [gemsToReturn, setGemsToReturn] =
    useState<Partial<TPlayerGems>>(emptyTokensToTake);

  const gemsRemaining = Object.values(EGemColor).reduce(
    (acc, color) => {
      acc[color] = acc[color] - (gemsToReturn[color] || 0);
      return acc;
    },
    {
      ...(gems ? gems : emptyTokensToTake),
    }
  );

  const gemsToReturnCount = Object.values(gemsToReturn).reduce(
    (acc, count) => (acc += count),
    0
  );

  const activeCard = useMemo(() => {
    return cardsHolded.find((card) => card.id === activeCardId) || null;
  }, [cardsHolded, activeCardId]);

  const needToReturnGems =
    availableActions.length === 1 &&
    availableActions[0] === EPlayerAction.ReturnGems;

  return (
    <div className={styles.MyInfo}>
      <MyHoldedCards
        cardsHolded={cardsHolded}
        onCardClick={(cardId) => {
          console.log('setActiveCardId', cardId);

          setActiveCardId(cardId);
        }}
      />
      <PlayerInfo
        cardsBought={cardsBought}
        cardsHolded={cardsHolded}
        gems={gems}
        nobles={nobles}
        size="sm"
      />
      {needToReturnGems && (
        <TokensModal
          handleGemTakeClick={handleReturnGemClick}
          gemsRemaining={gemsRemaining}
          gemsToTake={gemsToReturn}
          gemsToTakeCount={gemsToReturnCount}
          handleClose={() => undefined}
          handleGemGiveBack={handleRevertReturnGemClick}
          onClear={() => setGemsToReturn(emptyTokensToTake)}
          onSubmit={handleReturnGems}
        />
      )}
      <CardModal
        activeCard={activeCard}
        handleClose={() => setActiveCardId(null)}
        handleBuyClick={() => {
          console.log('handleBuyClick', activeCardId);

          activeCardId && onBuyHoldedCard(activeCardId);
        }}
      />
    </div>
  );
};

function MyHoldedCards({
  cardsHolded,
  onCardClick,
}: {
  cardsHolded: IPlayerShape['cardsHolded'];
  onCardClick: (cardId: string) => void;
}) {
  return (
    <div className={styles.MyHoldedCards}>
      {cardsHolded.map((card) => {
        return <Card {...card} onClick={onCardClick} />;
      })}
    </div>
  );
}
