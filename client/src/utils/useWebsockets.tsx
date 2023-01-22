import { useCallback, useEffect, useRef, useState } from 'react';
import { IMessage } from '../../../interfaces/api';
import { Nullable } from '../../../utils/typescript';
import { WEBSOCKETS_URL } from '../Api';
import { useErrorToast } from './useErrorToast';



export const useWebsockets = <T,>(onMessage: (message: IMessage<T>) => void, onError: (err: Error) => void) => {
  const wsRef = useRef<Nullable<WebSocket>>(null);
  const [isOpened, setIsOpen] = useState(false);
  const toastError = useErrorToast();

  const send = useCallback(<T,>(data: IMessage<T>) => {
    try {


      if (!wsRef.current) {
        throw Error('Cant send message: ws instance is null');
      }
      const message = JSON.stringify(data);
      console.log('message', message);

      wsRef.current.send(message);
    } catch (error) {
      toastError(error as any)
    }
  }, [])

  const apiRef = useRef<{ send: (data: IMessage<T>) => void }>({ send });

  useEffect(() => {
    wsRef.current = new WebSocket(WEBSOCKETS_URL);

    // Connection opened
    wsRef.current.onopen = (e) => {

      if (wsRef.current?.readyState) {
        setIsOpen(true);
      }

    };

    // Listen for messages
    wsRef.current.onmessage = (event) => {
      onMessage(JSON.parse(event.data))
    };

    wsRef.current.onerror = () => {
      onError(new Error('Error in websockets'))
    };

  }, [onMessage, onError]);

  useEffect(() => {
    return () => {
      if (wsRef.current && wsRef.current.readyState === 1) {
        wsRef.current;
      }
    };
  }, []);



  return { isOpen: isOpened, send: apiRef.current.send, instance: wsRef.current }
};
