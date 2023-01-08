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

  get(userId: string) {
    const connection = this.connections.get(userId);
    if (!connection) throw Error(`cant find connection for userId ${userId}`)
    return connection;
  }

  getAll() {
    return this.connections.values()
  }
}

export const connectionService = new ConnectionService();
