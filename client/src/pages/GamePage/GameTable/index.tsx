import { EDeckLevel } from '../../../../../interfaces/devDeck';
import { DeckLevelRow } from './DeckLevelRow';
import { ICardShape } from '../../../../../interfaces/card';
import { TGameTableSafeState } from '../../../../../interfaces/gameTable';
import { memo, useCallback, useMemo, useState } from 'react';
import { TPlayerGems } from '../../../../../interfaces/player';

import { Modal } from '../../../components/Modal';
import { Nullable } from '../../../../../utils/typescript';
import { Card } from '../../../components/Card';

import './styles.css';
import styles from './styles.module.scss';
import { NoblesList } from '../NoblesList';
import { CardModal } from '../CardModal';

const levels = Object.values(EDeckLevel).reverse();

export const GameTable = memo(
  ({
    isPlayerActive,
    table,
    onBuyCard,
    onHoldCard,
    onHoldCardFromDeck,
    onTakeTokensSubmit,
  }: {
    isPlayerActive: boolean;
    table: TGameTableSafeState<ICardShape>;
    onBuyCard: (cardId: string) => void;
    onHoldCard: (cardId: string) => void;
    onHoldCardFromDeck: (deckLvl: EDeckLevel) => void;
    onTakeTokensSubmit: (gems: Partial<TPlayerGems>) => void;
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
        {/* <Modal
        isOpen={!!activeCard}
        onRequestClose={handleCloseModal}
        className={styles.CardModal}
      >
        <div className={styles.CardModal_content}>
          <div className={styles.CardModal_cardColumn}>
            {activeCard && <Card {...activeCard} size='lg' />}
          </div>
          <div className={styles.CardModal_controlsColumn}>
            <div className={styles.CardModal_controls}>
              <button onClick={handleBuyClick}>Buy</button>
              <button onClick={handleHoldClick}>Hold</button>
            </div>
          </div>
        </div>
      </Modal> */}
      </div>
    );
  }
);
