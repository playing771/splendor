import { EDeckLevel } from '../../../../../interfaces/devDeck';
import { Api } from '../../../Api';
import { DeckLevelRow } from './DeckLevelRow';
import { GameTableTokens } from './GameTableTokens';

import './styles.css';
import { EPlayerAction } from '../../../../../interfaces/game';
import { ICardShape } from '../../../../../interfaces/card';
import { TGameTableSafeState } from '../../../../../interfaces/gameTable';
import { useState } from 'react';
import { TPlayerTokens } from '../../../../../interfaces/player';

const levels = Object.values(EDeckLevel).reverse();

export const GameTable = ({
  isPlayerActive,
  table,
  onCardClick,
  onTakeTokensSubmit
}: {
  isPlayerActive: boolean;
  table: TGameTableSafeState<ICardShape>;
  onCardClick: (cardId:string)=>void
  onTakeTokensSubmit: (gems: Partial<TPlayerTokens>) =>void;
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
              onCardClick={onCardClick}
            />
          );
        })}

      </div>
      <div className="GameTable_sideColumn">
        <GameTableTokens gems={table.gems} onTakeTokensSubmit={onTakeTokensSubmit}  />
      </div>
    </div>
  );
};
