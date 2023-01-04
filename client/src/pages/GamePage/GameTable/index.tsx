import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { ICardShape } from '../../../../../interfaces/card';

import { EDevDeckLevel } from '../../../../../interfaces/devDeck';
import { IGameAvailableActionsDTO, IGameStateDTO } from '../../../../../interfaces/api';
import { Nullable } from '../../../../../utils/typescript';
import { ETokenColor } from '../../../../../interfaces/token';

import './styles.css';
import { Api } from '../../../Api';
import { useGlobalState } from '../../../context';
import { useNavigate } from 'react-router-dom';

axios.defaults.baseURL = 'http://localhost:3000';

const levels = Object.values(EDevDeckLevel).reverse();

const DeckLevelRow = ({
  cardsCountInDeck,
  cards,
  lvl,
}: {
  cardsCountInDeck: number;
  cards: ICardShape[];
  lvl: EDevDeckLevel;
}) => {
  return (
    <div className="DeckLevelRow">
      <div className={`Deck Deck__${lvl}`}>{cardsCountInDeck}</div>
      {cards.map(({ score, cost, color, id }) => {
        const costs = Object.entries(cost).filter(
          ([_, value]) => value > 0
        ) as [ETokenColor, number][];

        return (
          <div key={id} className="Card">
            <div className="Card_header">
              <span className="Card_headerScore">{score}</span>
              <span className="Card_headerColor">{color}</span>
            </div>
            <div className="Card_cost">
              {costs.map(([color, value]) => {
                return (
                  <div
                    key={color}
                    className={`Card_costItem Card_costItem__${color}`}
                  >
                    {value}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const GameTableTokens = ({
  tokens,
}: {
  tokens: IGameStateDTO['table']['tokens'];
}) => {
  const tokensList = Object.values(ETokenColor);
  return (
    <div className="GameTableTokens">
      {tokensList.map((color) => {
        return (
          <div
            key={color}
            className={`GameTableTokens_item GameTableTokens_item__${color}`}
          >
            {tokens[color]}
          </div>
        );
      })}
    </div>
  );
};

export const GameTable = () => {
  const [state, setState] = useState<Nullable<IGameStateDTO>>(null);
  const [availableActions, setAvailableActions] = useState<Nullable<IGameStateDTO>>(null);
  const [error, setError] = useState<Nullable<string>>(null);
  const {userId, username} = useGlobalState();
  const navigate = useNavigate();
  

  // useEffect(()=>{
  //   navigate('/login')
  // },[userId])
  

  useEffect(() => {
    (async function request() {
      try {
        const response = await Api.get<IGameStateDTO>('game/state');
        setState(response.data);
      } catch (error: unknown) {
        const axiosError = error as AxiosError;
        setError(axiosError.message);
      }
    })();
  }, []);

  useEffect(() => {
    (async function request() {
      try {
        
          const response = await Api.get<IGameAvailableActionsDTO>(`game/availableActions/${userId}`);

          console.log('response', response.data);
        
        
        
        // setState(response.data);
      } catch (error: unknown) {
        const axiosError = error as AxiosError;
        setError(axiosError.message);
      }
    })();
  }, [userId]);

  const showAvailableActions = async ()=> {
    const response = await Api.get<IGameAvailableActionsDTO>(`game/availableActions/${userId}`);

    console.log('response', response.data);
  
  }

  if (error !== null) return <h1>Error: {error}</h1>;

  if (state === null) return <h1>...loading</h1>;

  const { players, table } = state;

  console.log('state', state);

  return (
    <div className="GameTable">
      {levels.map((lvl) => {
        const cards = table[lvl].cards;
        const cardsCountInDeck = table[lvl].deck;
        return (
          <DeckLevelRow
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
