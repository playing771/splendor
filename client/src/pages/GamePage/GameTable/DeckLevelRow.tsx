import { memo } from 'react';
import { ICardShape } from '../../../../../interfaces/card';
import { EDeckLevel } from '../../../../../interfaces/devDeck';
import { Card } from '../../../components/Card';
import { CardStack } from '../../../components/Card/CardStack';
import {
  canAffordToPayCost,
  getAllGemsAvailable,
} from '../../../../../utils/cost';
import styles from './styles.module.scss';
import {
  TPlayerGems,
  TPlayerCardsBought,
} from '../../../../../interfaces/player';

import cn from 'classnames';

export const DeckLevelRow = memo(
  ({
    cardsCountInDeck,
    cards,
    lvl,
    onClick,
    onHoldCardFromDeck,
    cardsBought,
    gems,
  }: {
    cardsCountInDeck: number;
    cards: ICardShape[];
    lvl: EDeckLevel;
    onClick: (cardId: string, cardInfo: ICardShape) => void;
    onHoldCardFromDeck: (deckLvl: EDeckLevel) => void;
    cardsBought?: TPlayerCardsBought;
    gems?: TPlayerGems;
  }) => {
    return (
      <div className="DeckLevelRow">
        <div
          className={`Deck Deck__${lvl}`}
          onClick={() => onHoldCardFromDeck(lvl)}
        >
          {
            <CardStack
              count={cardsCountInDeck}
              cardClassName={cn(styles.DeckCards, styles[`DeckCards__${lvl}`])}
            />
          }
        </div>
        {cards.map((cardData) => {
          return (
            <Card
              key={cardData.id}
              onClick={onClick}
              isAffordable={canAffordToPayCost(
                cardData.cost,
                getAllGemsAvailable(cardsBought, gems)
              )}
              {...cardData}
            />
          );
        })}
      </div>
    );
  }
);

DeckLevelRow.displayName = 'DeckLevelRow';
