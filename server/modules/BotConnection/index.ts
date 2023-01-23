import { IGameStateDTO, IMessage } from "../../../interfaces/api";

export class BotConnection {
  private subscriptions: Map<string, any>

  public readyState: 0 | 1 | 2 | 3 = 1;

  constructor() {
    this.subscriptions = new Map();
  }

  public send(message: string) {
    const dto: IMessage<any> = JSON.parse(message);

    const callback = this.subscriptions.get(dto.type);

    if (callback) {
      callback(dto);
    }
  }

  public subscribe(key: string, callback: (state: IMessage<IGameStateDTO>) => void) {
    this.subscriptions.set(key, callback)
  }
}