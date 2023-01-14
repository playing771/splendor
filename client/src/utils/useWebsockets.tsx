import { useEffect, useRef } from 'react';
import { IGameMessage } from '../../../interfaces/game';
import { Nullable } from '../../../utils/typescript';
import { WEBSOCKETS_URL } from '../Api';



export const useWebsockets = (onMessage: (message: string)=> void, onError: (err: Error)=> void) => {
  const wsRef = useRef<Nullable<WebSocket>>(null);
  useEffect(() => {
    wsRef.current = new WebSocket(WEBSOCKETS_URL);

    // Connection opened
    // wsRef.current.onopen = (event) => {
    //   console.log('OPEN', event);
    // };

    // Listen for messages
    wsRef.current.onmessage = (event) => {
      onMessage(event.data)
    };

    wsRef.current.onerror = () => {
      onError(new Error('Error in websockets'))
    };
  }, [onMessage, onError]);

  useEffect(() => {
    return () => {
      if (wsRef.current && wsRef.current.readyState === 1) {
        wsRef.current.close();
      }
    };
  }, []);

  return wsRef;
};
