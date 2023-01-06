import { v4 as uuidv4 } from 'uuid';
import WebSocket from 'ws';

export class ConnectionService {
  private connections: Map<string, WebSocket.WebSocket>;

  constructor() {
    this.connections = new Map<string, WebSocket.WebSocket>();
  }

  add(userId: string, ws: WebSocket.WebSocket) {
    this.connections.set(userId, ws);
  }

  delete(userId: string) {
    this.connections.delete(userId);
  }

  get(userId:string){
    return this.connections.get(userId)
  }

  getAll(){
    return this.connections.values()
  }
}

export const connectionService = new ConnectionService();
