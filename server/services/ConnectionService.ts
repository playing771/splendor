import WebSocket from 'ws';
import { IMessage } from '../../interfaces/api';

interface IConnection {
  send: (message: string)=>void;
  readyState: 0 | 1 | 2 | 3;
}

export class ConnectionService {
  private connections: Map<string, IConnection>;

  constructor() {
    this.connections = new Map<string, IConnection>();
  }

  add(userId: string, connection: IConnection) {
    this.connections.set(userId, connection);
  }

  delete(userId: string) {
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

  broadcast<T>(observers: string[], data: IMessage<T>) {
    const message = JSON.stringify(data);
    for (const userId of observers) {
      this.send(userId, message);
    }
  }
}

export const connectionService = new ConnectionService();
