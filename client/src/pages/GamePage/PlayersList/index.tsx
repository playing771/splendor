import React, { memo, useMemo } from 'react';
import { ICardShape } from '../../../../../interfaces/card';
import { EGemColor } from '../../../../../interfaces/gem';
import { IPlayerShape } from '../../../../../interfaces/player';
import { Card } from '../Card';
import { CardStack } from '../Card/CardStack';
import { Gem } from '../Gem';
import { GemStack } from '../Gem/GemStack';

import styles from './styles.module.scss';

interface IProps {
  players?: IPlayerShape[];
}

const GEM_COLORS = Object.values(EGemColor);

const scoreFromCardsBought = (cardsBought: ICardShape[]) =>
  cardsBought.reduce((total, card) => (total += card.score), 0);

const PlayerInfo = ({ cardsBought, cardsHolded, name, gems }: IPlayerShape) => {
  const totalScore = useMemo(() => {
    const cardsByColor = Object.values(cardsBought);
    return cardsByColor.reduce(
      (total, cards) => (total += scoreFromCardsBought(cards)),
      0
    );
  }, [cardsBought]);

  return (
    <div className={styles.PlayerInfo}>
      <div className={styles.PlayerInfo_header}>
        <span className={styles.PlayerScore}>Score: {totalScore}</span>
        <span className={styles.PlayerName}>{name}</span>
      </div>
      <ul className={styles.ColorList}>
        {GEM_COLORS.map((color) => {
          return (
            <li className={styles.ColorList_column} key={color}>
              <GemStack color={color} gemSize="xs" count={gems[color]} />
              <CardStack count={color === EGemColor.Gold ? cardsHolded.length : cardsBought[color].length} color={color} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export const PlayersList = memo(({ players = [] }: IProps) => {
  return (
    <div>
      {players.map((player) => {
        return <PlayerInfo key={player.id} {...player} />;
      })}
    </div>
  );
});
