import { useCallback, useState } from 'react';
import { IGameStateDTO } from '../../../../interfaces/api';
import { EPlayerAction } from '../../../../interfaces/game';
import { TPlayerGems } from '../../../../interfaces/player';
import { Nullable } from '../../../../utils/typescript';
import { Api } from '../../Api';
import { useWebsocket } from '../../utils/useWebsocket';
import { GameTable } from './GameTable';
import { GemsToTakeList, PlayerGemsList } from './GemsList';
import { EGemColor } from '../../../../interfaces/gem';
import { Card } from './Card';

import { EDeckLevel } from '../../../../interfaces/devDeck';
import { PlayersList } from './PlayersList';

import './styles.css';
import styles from './styles.module.scss';
import { GameTableTokens } from './GameTable/GameTableTokens';
import { toast } from 'react-hot-toast';
import { AxiosError } from 'axios';

interface IProps { }

const emptyTokensToTake = {
  [EGemColor.Black]: 0,
  [EGemColor.Red]: 0,
  [EGemColor.Green]: 0,
  [EGemColor.Blue]: 0,
  [EGemColor.Gold]: 0,
  [EGemColor.White]: 0,
};

export const GamePage = (props: IProps) => {
  const [gameState, setGameState] = useState<IGameStateDTO>();
  const [gemsToReturn, setGemsToReturn] =
    useState<Partial<TPlayerGems>>(emptyTokensToTake);
  const [error, setError] = useState<Nullable<string>>(null);

  const gemsRemaining = Object.values(EGemColor).reduce(
    (acc, color) => {
      acc[color] = acc[color] - (gemsToReturn[color] || 0);
      return acc;
    },
    { ...(gameState ? gameState.playerState.gems : emptyTokensToTake) }
  );

  const gemsToReturnCount = Object.values(gemsToReturn).reduce(
    (acc, count) => (acc += count),
    0
  );

  const onMessage = useCallback((message: string) => {
    const gameStateDTO: IGameStateDTO = JSON.parse(message);
    console.log('gameStateDTO', gameStateDTO);

    setGameState(gameStateDTO);
  }, []);
  const onError = useCallback(() => {
    setError('Unknown error');
  }, []);

  const handleDispatchAction =
    (action: EPlayerAction) => async (data?: string | Partial<TPlayerGems>) => {
      console.log('action - data', action, data);
      console.log('toast', toast);

      try {
        await Api.post('game/dispatch', { action, data });
      } catch (error) {
        const axiosError = error as AxiosError<string>;
        const text = axiosError.response?.data ? axiosError.response?.data : axiosError.message;
        console.log('axiosError', axiosError);

        toast(text, { style: { backgroundColor: '#c12e35', color: 'white' }, duration: 3000});

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

  useWebsocket(onMessage, onError);

  if (!gameState) return <h1>...loading</h1>;

  const { availableActions, playerState, players, table, isPlayerActive } =
    gameState;

  return (
    <div className={styles.Game}>
      <div className="StatusBar">
        {error && <h3>Error: {error}</h3>}
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
            {playerState.cardsHolded.map((card, index) => {
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
      </div>

      <button disabled={!isPlayerActive} onClick={handleEndTurnClick}>
        End turn
      </button>
    </div>
  );
};
