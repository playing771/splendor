import React, { useCallback, useState } from 'react';
import { IGameStateDTO } from '../../../../interfaces/api';
import { EPlayerAction } from '../../../../interfaces/game';
import { TPlayerTokens } from '../../../../interfaces/player';
import { Nullable } from '../../../../utils/typescript';
import { Api } from '../../Api';
import { useWebsockets } from '../../utils/useWebsockets';
import { GameTable } from './GameTable';
import { TableTokensList } from './TokensList';
import { ETokenColor } from '../../../../interfaces/token';
import { Card } from './Card';

import './styles.css';

interface IProps {}

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

  const handleDispatchAction =
    (action: EPlayerAction) =>
    async (data?: string | Partial<TPlayerTokens>) => {
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

  const { availableActions, playerState, players, table, isPlayerActive } =
    gameState;

  return (
    <div>
      <div className="StatusBar">
        {error && <h3>Error: {error}</h3>}
        {isPlayerActive && <h3 className="StatusBar_yourTurn">Your turn</h3>}
        <h3 style={{ display: 'block' }}>
          Available actions: {availableActions.join('; ')}
        </h3>
      </div>

      <GameTable
        table={table}
        isPlayerActive={isPlayerActive}
        onCardClick={handleCardClick}
        onTakeTokensSubmit={handleDispatchAction(EPlayerAction.TakeTokens)}
      />

      <TableTokensList tokens={playerState.tokens} orientaion="horizontal" />

      <div style={{ display: 'flex', columnGap: 12 }}>
        {Object.values(ETokenColor).map((color) => {
          return (
            <ul
              key={color}
              style={{
                flexBasis: 100,
                flexGrow: 0,
                flexShrink: 1,
                position: 'relative',
              }}
            >
              {playerState.cardsBought[color].map((card, index) => {
                return (
                  <li
                    key={card.id}
                    style={{
                      position: 'absolute',
                      top: 0 + index * 30,
                      left: 0,
                      right: 0,
                      height: 180,
                      display: 'flex  ',
                    }}
                  >
                    <Card {...card} />
                  </li>
                );
              })}
            </ul>
          );
        })}
      </div>

      <button disabled={!isPlayerActive} onClick={handleEndTurnClick}>
        End turn
      </button>
    </div>
  );
};
