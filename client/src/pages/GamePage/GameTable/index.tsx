import { EDeckLevel } from '../../../../../interfaces/devDeck';
import { Api } from '../../../Api';
import { DeckLevelRow } from './DeckLevelRow';
import { GameTableTokens } from './GameTableTokens';

import './styles.css';
import { EPlayerAction } from '../../../../../interfaces/game';
import { ICardShape } from '../../../../../interfaces/card';
import { TGameTableSafeState } from '../../../../../interfaces/gameTable';
import { useState } from 'react';
import { TPlayerGems } from '../../../../../interfaces/player';

const levels = Object.values(EDeckLevel).reverse();

export const GameTable = ({
  isPlayerActive,
  table,
  onBuyCard,
  onHoldCard,
  onHoldCardFromDeck,
  onTakeTokensSubmit
}: {
  isPlayerActive: boolean;
  table: TGameTableSafeState<ICardShape>;
  onBuyCard: (cardId:string)=>void;
  onHoldCard: (cardId:string)=>void;
  onHoldCardFromDeck: (deckLvl:EDeckLevel)=>void;
  onTakeTokensSubmit: (gems: Partial<TPlayerGems>) =>void;
}) => {
  
  

  return (
    <div className="GameTable">
      <div className="GameTable_mainColumn">
        {levels.map((lvl) => {
          const cards = table[lvl].cards;
          const cardsCountInDeck = table[lvl].deck;
          return (
            <DeckLevelRow
              key={lvl}
              cardsCountInDeck={cardsCountInDeck}
              cards={cards}
              lvl={lvl}
              onBuyCard={onBuyCard}
              onHoldCard={onHoldCard}
              onHoldCardFromDeck={onHoldCardFromDeck}
            />
          );
        })}

      </div>
      <div className="GameTable_sideColumn">
        {/* <GameTableTokens gems={table.gems} onTakeTokensSubmit={onTakeTokensSubmit}  /> */}
      </div>
    </div>
  );
};
