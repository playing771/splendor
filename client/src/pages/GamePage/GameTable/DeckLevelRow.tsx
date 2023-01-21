import { ICardShape } from '../../../../../interfaces/card';
import { EDeckLevel } from '../../../../../interfaces/devDeck';
import { EGemColor } from '../../../../../interfaces/gem';
import { Card } from '../../../components/Card';
import { CardStack } from '../../../components/Card/CardStack';
import { CardWithActions } from '../../../components/Card/CardWithActions';

import cn from 'classnames';

import styles from './styles.module.scss';

export const DeckLevelRow = ({
  cardsCountInDeck,
  cards,
  lvl,
  onClick,
  onHoldCardFromDeck,
}: {
  cardsCountInDeck: number;
  cards: ICardShape[];
  lvl: EDeckLevel;
  onClick: (cardId: string, cardInfo: ICardShape) => void;
  onHoldCardFromDeck: (deckLvl: EDeckLevel) => void;
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
        return <Card key={cardData.id} onClick={onClick} {...cardData} />;
      })}
    </div>
  );
};
