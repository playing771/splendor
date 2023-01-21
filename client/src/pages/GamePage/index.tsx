import { useCallback, useEffect, useState } from 'react';
import { EMessageType, IGameStateDTO, IMessage } from '../../../../interfaces/api';
import { EPlayerAction } from '../../../../interfaces/game';
import { TPlayerGems } from '../../../../interfaces/player';
import { Api } from '../../Api';
import { useWebsockets } from '../../utils/useWebsockets';
import { GameTable } from './GameTable';
import { GemsToTakeList, PlayerGemsList } from '../../components/GemsList';
import { EGemColor } from '../../../../interfaces/gem';
import { Card } from '../../components/Card';
import { EDeckLevel } from '../../../../interfaces/devDeck';
import { PlayersList } from './PlayersList';
import { GameTableTokens } from './GameTable/GameTableTokens';
import { AxiosError } from 'axios';

import { useParams } from 'react-router-dom';
import { useErrorToast } from '../../utils/useErrorToast';

import styles from './styles.module.scss';
import './styles.css';
import { NoblesList } from './NoblesList';

const emptyTokensToTake = {
  [EGemColor.Black]: 0,
  [EGemColor.Red]: 0,
  [EGemColor.Green]: 0,
  [EGemColor.Blue]: 0,
  [EGemColor.Gold]: 0,
  [EGemColor.White]: 0,
};

export const GamePage = () => {

  const { gameId } = useParams<{ gameId: string }>();

  const [gameState, setGameState] = useState<IGameStateDTO>();
  const toastError = useErrorToast();
  const [gemsToReturn, setGemsToReturn] =
    useState<Partial<TPlayerGems>>(emptyTokensToTake);

  const gemsRemaining = Object.values(EGemColor).reduce(
    (acc, color) => {
      acc[color] = acc[color] - (gemsToReturn[color] || 0);
      return acc;
    },
    { ...(gameState && gameState.playerState ? gameState.playerState.gems : emptyTokensToTake) }
  );

  const gemsToReturnCount = Object.values(gemsToReturn).reduce(
    (acc, count) => (acc += count),
    0
  );

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

  const handleBuyHoldedCard = (cardId: string) => () => {
    handleDispatchAction(EPlayerAction.BuyHoldedCard)(cardId);
  };

  const handleReturnGems = () => {
    setGemsToReturn(emptyTokensToTake);
    handleDispatchAction(EPlayerAction.ReturnGems)(gemsToReturn);
  };

  const handleReturnGemClick = (color: EGemColor) => {
    if (gemsRemaining[color] > 0) {
      setGemsToReturn((prev) => {
        const obj = prev || {};
        const targetCount = obj[color];
        return {
          ...obj,
          [color]: targetCount !== undefined ? targetCount + 1 : 1,
        };
      });
    }
  };

  const handleRevertReturnGemClick = (color: EGemColor) => {
    setGemsToReturn((prev) => {
      const obj = prev || {};
      const targetCount = obj[color];
      return {
        ...obj,
        [color]: targetCount !== undefined ? targetCount - 1 : 0,
      };
    });
  };

  const { isOpen, send: sendMessage, instance } = useWebsockets(onMessage, onError);

  useEffect(() => {
    if (isOpen) {
      sendMessage({ type: EMessageType.GetGameState, data: gameId })
    }
  }, [sendMessage, isOpen, instance])


  if (!gameState) return <h1>...loading</h1>;

  const { availableActions, playerState, players, table, isPlayerActive } =
    gameState;

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
          <PlayersList players={players} />
        </div>
        <div className={styles.Game_infoGems}>
          <GameTableTokens gems={table.gems} onTakeTokensSubmit={handleDispatchAction(EPlayerAction.TakeGems)} />
        </div>
        <div className={styles.Game_infoTable}>
          <GameTable
            table={table}
            isPlayerActive={isPlayerActive}
            onBuyCard={handleBuyCard}
            onHoldCard={handleHoldCard}
            onHoldCardFromDeck={handleHoldCardFromDeck}
            onTakeTokensSubmit={handleDispatchAction(EPlayerAction.TakeGems)}
          />
        </div>
      </div>
      <PlayerGemsList
        gems={gemsRemaining}
        orientaion="horizontal"
        isActive={gameState.availableActions[0] === EPlayerAction.ReturnGems}
        onClick={handleReturnGemClick}
      />
      {gemsToReturnCount > 0 && (
        <div>
          <button
            // disabled={!tokensToTakeCount}
            style={{ width: 130 }}
            onClick={handleReturnGems}
          >
            Submit
          </button>

          <GemsToTakeList
            gems={gemsToReturn}
            isActive={true}
            onClick={handleRevertReturnGemClick}
            orientaion="horizontal"
          />
        </div>
      )}

      <div style={{ display: 'flex' }}>
        <div
          style={{
            display: 'flex',
            columnGap: 12,
            position: 'relative',
            flex: 1,
          }}
        >
          Cards bought
          {Object.values(EGemColor).map((color) => {
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
                {playerState && playerState.cardsBought[color].map((card, index) => {
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
        Cards holded
        <div
          style={{
            display: 'flex',
            columnGap: 12,
            position: 'relative',
            flex: 1,
          }}
        >
          <ul
            style={{
              flexBasis: 100,
              flexGrow: 0,
              flexShrink: 1,
              position: 'relative',
            }}
          >
            {playerState && playerState.cardsHolded.map((card, index) => {
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
                  <Card {...card}>
                    <button onClick={handleBuyHoldedCard(card.id)}>Buy</button>
                  </Card>
                </li>
              );
            })}
          </ul>
        </div>

        Nobles:
        {playerState && <NoblesList nobles={playerState.nobles}/>}
      </div>

      <button disabled={!isPlayerActive} onClick={handleEndTurnClick}>
        End turn
      </button>
    </div>
  );
};
