import React, { useCallback, useState } from 'react';
import { IGameStateDTO } from '../../../../interfaces/api';
import { EPlayerAction } from '../../../../interfaces/game';
import { TPlayerTokens } from '../../../../interfaces/player';
import { Nullable } from '../../../../utils/typescript';
import { Api } from '../../Api';
import { useWebsockets } from '../../utils/useWebsockets';
import { GameTable } from './GameTable';
import { TableTokensList } from './TokensList';

import './styles.css';

interface IProps { }

export const GamePage = (props: IProps) => {
  const [gameState, setGameState] = useState<IGameStateDTO>();
  const [error, setError] = useState<Nullable<string>>(null);

  const onMessage = useCallback((message: string) => {
    const gameStateDTO: IGameStateDTO = JSON.parse(message);
    console.log('gameStateDTO', gameStateDTO);

    setGameState(gameStateDTO);
  }, []);
  const onError = useCallback(() => {
    setError('Unknown error');
  }, []);

  const handleDispatchAction = (action: EPlayerAction) => async (data?: string | Partial<TPlayerTokens>) => {
    console.log('action - data', action, data);

    await Api.post('game/dispatch', { action, data });
  };

  const handleEndTurnClick = () => {
    handleDispatchAction(EPlayerAction.EndTurn)();
  };

  const handleCardClick = (cardId: string) => {
    handleDispatchAction(EPlayerAction.BuyCard)(cardId);
  };

  useWebsockets(onMessage, onError);

  if (!gameState) return <h1>...loading</h1>;

  const { availableActions, playerState, players, table, isPlayerActive } = gameState;

  return (
    <div>

      <div className="StatusBar">
        {error && <h3>Error: {error}</h3>}
        {isPlayerActive && <h3 className="StatusBar_yourTurn">Your turn</h3>}
        <h3 style={{ display: 'block' }}>Available actions: {availableActions.join("; ")}</h3>
      </div>

      <GameTable
        table={table}
        isPlayerActive={isPlayerActive}
        onCardClick={handleCardClick}
        onTakeTokensSubmit={handleDispatchAction(EPlayerAction.TakeTokens)}
      />

      <button disabled={!isPlayerActive} onClick={handleEndTurnClick}>
        End turn
      </button>

      <TableTokensList tokens={playerState.tokens} orientaion="horizontal"/>
    </div>
  );
};
