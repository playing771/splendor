import WebSocket from 'ws';
import { IMessage } from '../../interfaces/api';

export class ConnectionService {
  private connections: Map<string, WebSocket.WebSocket>;

  constructor() {
    this.connections = new Map<string, WebSocket.WebSocket>();
  }

  add(userId: string, ws: WebSocket.WebSocket) {
    this.connections.set(userId, ws);
  }

  delete(userId: string) {
    console.log('delete', userId);

    this.connections.delete(userId);
  }

  get(userId: string) {
    const connection = this.connections.get(userId);
    if (!connection) throw Error(`cant find connection for userId ${userId}`);
    return connection;
  }

  getAll() {
    return this.connections.values();
  }

  getAllIds() {
    return [...this.connections.keys()];
  }

  send<T>(userId: string, message?: IMessage<T> | string) {
    const connection = connectionService.get(userId);
    if (connection.readyState === WebSocket.OPEN) {
      connection.send(
        typeof message === 'string' ? message : JSON.stringify(message)
      );
    }
  }

  broadcast<T>(observers: string[], data?: IMessage<T>) {
    const message = JSON.stringify(data);
    for (const userId of observers) {
      this.send(userId, message);
    }
  }
}

export const connectionService = new ConnectionService();
