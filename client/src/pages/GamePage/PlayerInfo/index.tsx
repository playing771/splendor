import React, { useMemo } from 'react';
import { ICardShape } from '../../../../../interfaces/card';
import { EGemColor } from '../../../../../interfaces/gem';
import { IPlayerShape } from '../../../../../interfaces/player';
import { CardStack } from '../../../components/Card/CardStack';
import { GemStack } from '../../../components/Gem/GemStack';
import { NobleCardStack } from '../../../components/NobleCard/NobleCardStack';

import cn from 'classnames'

import styles from './styles.module.scss';

const GEM_COLORS = Object.values(EGemColor);

const scoreFromCardsBought = (cardsBought: ICardShape[]) =>
  cardsBought.reduce((total, card) => (total += card.score), 0);

interface IPlayerInfoProps {
  name?: IPlayerShape['name'];
  cardsBought: IPlayerShape['cardsBought'];
  cardsHolded: IPlayerShape['cardsHolded'];
  gems: IPlayerShape['gems'];
  nobles: IPlayerShape['nobles'];
  size: 'sm' | 'xs';
  isActive?: boolean
}

export const PlayerInfo = ({ cardsBought, cardsHolded, name, gems, nobles, size, isActive }: IPlayerInfoProps) => {
  const totalScore = useMemo(() => {
    const cardsByColor = Object.values(cardsBought);
    return cardsByColor.reduce(
      (total, cards) => (total += scoreFromCardsBought(cards)),
      0
    );
  }, [cardsBought]);

  return (
    <div className={cn(styles.PlayerInfo, { [styles.PlayerInfo__isActive]: isActive })}>
      <div className={styles.PlayerInfo_header}>
        <span className={styles.PlayerScore}>Score: {totalScore}</span>
        <span className={styles.PlayerName}>{name}</span>
      </div>
      <div className={styles.ColorList}>
        {GEM_COLORS.map((color) => {
          return (
            <div className={styles.ColorList_column} key={color}>
              <GemStack color={color} gemSize={size} count={gems[color]} />
              <CardStack count={color === EGemColor.Gold ? cardsHolded.length : cardsBought[color].length} color={color} />
            </div>
          );
        })}
        <NobleCardStack nobles={nobles} size={size} />
      </div>

    </div>
  );
};