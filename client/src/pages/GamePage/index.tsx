import { useCallback, useEffect, useState } from 'react';
import {
  EMessageType,
  IGameStateDTO,
  IMessage,
} from '../../../../interfaces/api';
import { EPlayerAction } from '../../../../interfaces/game';
import { TPlayerGems } from '../../../../interfaces/player';
import { Api } from '../../Api';
import { useWebsockets } from '../../utils/useWebsockets';
import { GameTable } from './GameTable';
import { EDeckLevel } from '../../../../interfaces/devDeck';
import { PlayersList } from './PlayersList';
import { GameTableGems } from './GameTable/GameTableGems';
import { AxiosError } from 'axios';

import { useParams } from 'react-router-dom';
import { useErrorToast } from '../../utils/useErrorToast';
import { MyInfo } from './MyInfo';

import cn from 'classnames';

import styles from './styles.module.scss';
import './styles.css';

export const GamePage = () => {
  const { gameId } = useParams<{ gameId: string }>();

  const [gameState, setGameState] = useState<IGameStateDTO>();
  const toastError = useErrorToast();

  const onMessage = useCallback((message: IMessage<IGameStateDTO | string>) => {
    console.log('message', message);
    if (message.type === EMessageType.GameStateChange) {
      setGameState(message.data as IGameStateDTO);
    }
  }, []);
  const onError = useCallback(() => {
    toastError(new Error('Error in websockets') as any);
  }, []);

  const handleDispatchAction =
    (action: EPlayerAction) => async (data?: string | Partial<TPlayerGems>) => {
      console.log('action - data', action, data);

      try {
        await Api.post(`game/dispatch?gameId=${gameId}`, { action, data });
      } catch (error) {
        const axiosError = error as AxiosError<string>;
        toastError(axiosError);
      }
    };

  const handleEndTurnClick = () => {
    handleDispatchAction(EPlayerAction.EndTurn)();
  };

  const handleBuyCard = (cardId: string) => {
    handleDispatchAction(EPlayerAction.BuyCard)(cardId);
  };

  const handleHoldCard = (cardId: string) => {
    handleDispatchAction(EPlayerAction.HoldCardFromTable)(cardId);
  };

  const handleHoldCardFromDeck = (deckLvl: EDeckLevel) => {
    handleDispatchAction(EPlayerAction.HoldCardFromDeck)(deckLvl);
  };

  const handleBuyHoldedCard = (cardId: string) => {
    handleDispatchAction(EPlayerAction.BuyHoldedCard)(cardId);
  };

  const {
    isOpen,
    send: sendMessage,
    instance,
  } = useWebsockets(onMessage, onError);

  useEffect(() => {
    if (isOpen) {

      sendMessage({ type: EMessageType.GetGameState, data: gameId });
    }
  }, [sendMessage, isOpen, instance]);

  if (!gameState) return <h1>...loading</h1>;

  const { availableActions, playerState, players, table, isPlayerActive, activePlayer } =
    gameState;

  const needToReturnGems =
    availableActions.length === 1 &&
    availableActions[0] === EPlayerAction.ReturnGems;
  const needToEndTurn =
    availableActions.length === 1 &&
    availableActions[0] === EPlayerAction.EndTurn;
  const canTakeGems = availableActions.includes(EPlayerAction.TakeGems);

  const rivals = players.filter((player)=>player.id !== playerState?.id);
  console.log('activePlayer',activePlayer);
  
  return (
    <div className={styles.Game}>
      <div className="StatusBar">
        {isPlayerActive && <h3 className="StatusBar_yourTurn">Your turn</h3>}
        <h3 style={{ display: 'block' }}>
          Available actions: {availableActions.join('; ')}
        </h3>
      </div>
      <div className={styles.Game_info}>
        <div className={styles.Game_infoPlayers}>
          <PlayersList players={rivals} activePlayerId={activePlayer}/>
        </div>
        <div className={styles.Game_infoTable}>
          <GameTable
            table={table}
            isPlayerActive={isPlayerActive}
            onBuyCard={handleBuyCard}
            onHoldCard={handleHoldCard}
            onHoldCardFromDeck={handleHoldCardFromDeck}
          />
        </div>
        <div className={styles.Game_infoGems}>
          <GameTableGems
            gems={table.gems}
            onTakeTokensSubmit={handleDispatchAction(EPlayerAction.TakeGems)}
            isDisabled={!canTakeGems}
          />
        </div>
      </div>
      {playerState && (
        <MyInfo
          availableActions={availableActions}
          cardsBought={playerState.cardsBought}
          cardsHolded={playerState.cardsHolded}
          gems={playerState.gems}
          nobles={playerState.nobles}
          onGemsReturn={handleDispatchAction(EPlayerAction.ReturnGems)}
          onBuyHoldedCard={handleBuyHoldedCard}
        />
      )}


      {needToReturnGems ? (
        <button
          disabled={!isPlayerActive}
          // onClick={handleEndTurnClick}
          className={cn(styles.EndTurnButton, {
            [styles.EndTurnButton__active]: true,
          })}
        >
          Return gems
        </button>
      ) : (
        <button
          disabled={!isPlayerActive}
          onClick={handleEndTurnClick}
          className={cn(styles.EndTurnButton, {
            [styles.EndTurnButton__active]: needToEndTurn,
          })}
        >
          End turn
        </button>
      )}
    </div>
  );
};
