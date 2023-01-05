import { useEffect, useState } from 'react';

import { EDevDeckLevel } from '../../../../../interfaces/devDeck';
import { IGameAvailableActionsDTO, IGameStateDTO } from '../../../../../interfaces/api';
import { Api } from '../../../Api';
import { useGlobalState } from '../../../context';
import { useNavigate } from 'react-router-dom';
import { DeckLevelRow } from './DeckLevelRow';
import { GameTableTokens } from './GameTableTokens';
import { useRequest } from '../../../utils/useRequest';

import './styles.css';
import { useWebsockets } from '../../../utils/useWebsockets';

const levels = Object.values(EDevDeckLevel).reverse();

export const GameTable = () => {
  // const { userId, username } = useGlobalState();
  const { data: gameState, error: gameStateError } = useRequest<IGameStateDTO>('game/state')
  const { data: availableActions, error: availableActionsError } = useRequest<IGameAvailableActionsDTO>(`game/availableActions`)
  const navigate = useNavigate();
  const ws = useWebsockets();

  ws.onopen = (e)=> {
    console.log('OPEN',e);
    
  }

  ws.onmessage = (e)=>{
    console.log('MESSAGE',e.type,e.data);
    
  }


  console.log('availableActions', availableActions);


  const showAvailableActions = async () => {
    const response = await Api.get<IGameAvailableActionsDTO>(`game/availableActions`);

    console.log('response', response.data);

  }

  const mergedError = availableActionsError || gameStateError

  if (mergedError) return <h1>Error: {mergedError}</h1>;

  if (!gameState) return <h1>...loading</h1>;

  const { players, table } = gameState;

  console.log('gameState', gameState);

  return (
    <div className="GameTable">
      {levels.map((lvl) => {
        const cards = table[lvl].cards;
        const cardsCountInDeck = table[lvl].deck;
        return (
          <DeckLevelRow
            key={lvl}
            cardsCountInDeck={cardsCountInDeck}
            cards={cards}
            lvl={lvl}
          />
        );
      })}
      <GameTableTokens tokens={table.tokens} />
      <button onClick={showAvailableActions}>Get available actions</button>
    </div>
  );
};
