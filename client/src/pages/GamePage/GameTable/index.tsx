import { EDeckLevel } from '../../../../../interfaces/devDeck';
import { DeckLevelRow } from './DeckLevelRow';
import { ICardShape } from '../../../../../interfaces/card';
import { TGameTableSafeState } from '../../../../../interfaces/gameTable';
import { memo, useCallback, useState } from 'react';
import { TPlayerGems } from '../../../../../interfaces/player';

import { Nullable } from '../../../../../utils/typescript';

import { NoblesList } from '../NoblesList';
import { CardModal } from '../CardModal';

import './styles.css';

const levels = Object.values(EDeckLevel).reverse();

export const GameTable = memo(
  ({
    isPlayerActive,
    table,
    onBuyCard,
    onHoldCard,
    onHoldCardFromDeck,
  }: {
    isPlayerActive: boolean;
    table: TGameTableSafeState<ICardShape>;
    onBuyCard: (cardId: string) => void;
    onHoldCard: (cardId: string) => void;
    onHoldCardFromDeck: (deckLvl: EDeckLevel) => void;
  }) => {
    const [activeCard, setActiveCard] = useState<Nullable<ICardShape>>(null);

    const handleCardClick = useCallback(
      (cardId: string, cardInfo: ICardShape) => {
        console.log('handleCardClick');

        setActiveCard(cardInfo);
      },
      []
    );

    const handleCloseModal = useCallback(() => {
      setActiveCard(null);
    }, []);

    const handleBuyClick = () => {
      activeCard && onBuyCard(activeCard.id);
      handleCloseModal();
    };

    const handleHoldClick = () => {
      activeCard && onHoldCard(activeCard.id);
      handleCloseModal();
    };

    return (
      <div className="GameTable">
        <div className="GameTable_mainColumn">
          <NoblesList nobles={table.nobles} />
          {levels.map((lvl) => {
            const cards = table[lvl].cards;
            const cardsCountInDeck = table[lvl].deck;
            return (
              <DeckLevelRow
                key={lvl}
                cardsCountInDeck={cardsCountInDeck}
                cards={cards}
                lvl={lvl}
                onClick={handleCardClick}
                onHoldCardFromDeck={onHoldCardFromDeck}
              />
            );
          })}
        </div>
        <CardModal
          activeCard={activeCard}
          handleClose={handleCloseModal}
          handleBuyClick={handleBuyClick}
          handleHoldClick={handleHoldClick}
        />
      </div>
    );
  }
);
