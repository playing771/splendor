import { v4 as uuidv4 } from 'uuid';
import WebSocket from 'ws';



export class ConnecionService {
  connections: Map<string, WebSocket.WebSocket>;

  constructor() {
    this.connections = new Map<string,WebSocket.WebSocket>()
  }

  add(userId:string, ws: WebSocket.WebSocket) {
    this.connections.set(userId, ws);
  }
}

export const connectionService = new ConnecionService();