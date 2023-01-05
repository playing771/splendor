import { useRef } from "react";

const WEBSOCKETS_URL = 'ws://localhost:8080';

export const useWebsockets = () => {
  const wsRef = useRef(new WebSocket(WEBSOCKETS_URL));

  return wsRef.current;

}