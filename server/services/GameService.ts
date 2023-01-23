import { EMessageType, IGameStateDTO, IMessage } from '../../interfaces/api';
import { EPlayerAction, IGameConfig } from '../../interfaces/game';
import { ERoomState } from '../../interfaces/room';
import { EUserRole } from '../../interfaces/user';
import { Game } from '../modules/Game';
import { DEFAULT_GAME_SETUP } from '../modules/Game/constants';
import { MAX_PLAYERS } from '../../gameRules';
import { GameBot } from '../modules/GameBot';
import { Room } from '../modules/Room';
import { BotConnection } from '../modules/BotConnection';
import { shuffle } from '../utils/array';
import { connectionService } from './ConnectionService';
import { userService } from './UserService';
import { random } from '../utils/math';
import { EGameBasicState } from '../modules/Game/createGameSMDefinition';


const BOT_NAMES = ['Alex', 'Max', 'Evgen', 'Kiko', 'Narek'];
const BOT_NAME_PREFIXES = ['Super', "Old", "Mr", "Miss", "Blind", ""];
// const BOT_NAME_POSTFIX = ['the greatest', "Powerless", "Mr", "Miss", ""];

export class GameService {
  public games: Map<string, Game>;
  public rooms: Map<string, Room>;

  constructor() {
    this.games = new Map();
    this.rooms = new Map();
  }

  createRoom(name: string, userId: string) {
    const author = userService.get(userId);
    if (!author) {
      throw Error(`Cant find an owner by ${userId}`);
    }
    const room = new Room({ name, owner: author });
    this.rooms.set(room.id, room);

    this.joinRoomAsPlayer(room.id, author.id);
    this.broadcastOnRoomsChange();

    return room;
  }

  leaveRoom(id: string, userId: string) {
    const room = this.getRoom(id);

    const user = userService.get(userId);

    if (room.state !== ERoomState.Pending && user.role === EUserRole.Player) {
      throw Error(`Player cant leave room in ${room.state} state`);
    }
    room.leave(userId);
    if (userId === room.owner.id) {
      this.rooms.delete(id);
      this.broadcastOnRoomsChange();
    } else {
      this.broadcastOnRoomStateChange(room.id);
    }
  }

  joinRoomAsPlayer(id: string, userId: string) {
    const room = this.getRoom(id);

    if (room.players.length === MAX_PLAYERS) {
      throw Error(`Cant't join the game as player: MAX_PLAYERS exceeded`)
    } 

    if (room.state !== ERoomState.Pending) {
      throw Error(`Can't join a game in ${room.state} state`);
    }
    const user = userService.get(userId);

    user.role = EUserRole.Player;
    if (!room.hasUser(user.id)) {
      room.joinAsPlayer(user);
    }
    this.broadcastOnRoomStateChange(room.id);
  }

  joinRoomAsSpectator(id: string, userId: string) {
    const room = this.getRoom(id);
    const user = userService.get(userId);

    user.role = EUserRole.Spectator;

    if (!room.hasUser(user.id)) {
      room.joinAsSpectator(user);
    }
    this.broadcastOnRoomStateChange(room.id);
  }


  addBot(roomId: string, userId: string, id?: string) {
    const room = this.getRoom(roomId);

    if (room.players.length === MAX_PLAYERS) {
      if (room.players.length === MAX_PLAYERS) {
        throw Error(`Cant't add bot: MAX_PLAYERS exceeded`)
      } 
    }

    if (userId !== room.owner.id) {
      throw Error(
        `Cant start a game in room ${room.id}: ${userId} is not an owner`
      );
    }

    if (room.state !== ERoomState.Pending) {
      throw Error(`Can't add bot in ${room.state} state`);
    }

    const botName = `${BOT_NAME_PREFIXES[random(0, BOT_NAME_PREFIXES.length - 1)]} ${BOT_NAMES[random(0, BOT_NAMES.length - 1)]}`.trim();
    const bot = new GameBot(botName, this.dispatch, id);
    const botConnection = new BotConnection();

    botConnection.subscribe(EMessageType.GameStateChange, bot.updateGameState);

    connectionService.add(bot.id, botConnection);

    room.addBot(bot);

    this.broadcastOnRoomStateChange(room.id);

    return bot;
  }

  broadcastOnRoomStateChange(roomId: string) {
    const room = this.getRoom(roomId);
    connectionService.broadcast(
      room.users.map((user) => user.id),
      { type: EMessageType.RoomStateChange }
    );
  }

  broadcastOnRoomsChange() {
    connectionService.broadcast(connectionService.getAllIds(), {
      type: EMessageType.RoomsChange,
    }); // TODO: need to be narrowed
  }

  // send game state to single user
  sendGameState = (gameId: string, userId: string) => {
    const game = this.getGame(gameId);
    if (!game.roomId) {
      throw Error(`Game ${gameId} is not attached to any room`);
    }

    const connection = connectionService.get(userId);

    // const user = userService.get(userId);
    const room = this.getRoom(game.roomId);

    const isPlayer = room.players.some((player) => player.id === userId);
    const gameState = this.getGameState(gameId, userId, isPlayer);
    const message = JSON.stringify({
      data: gameState,
      type: EMessageType.GameStateChange,
    } as IMessage<IGameStateDTO>);

    connection.send(message);
  };

  // send game state to all users in room/game
  broadcastGameState = (gameId: string) => {
    const game = this.getGame(gameId);

    if (game.getState() === EGameBasicState.GameEnded) {
      // TODO: hack to prevent crash in game with bots
      return
    }

    if (!game.roomId) {
      throw Error(`Game ${gameId} is not attached to any room`);
    }
    const room = this.getRoom(game.roomId);
    const observers = room.users;

    for (const { id: userId, role } of observers) {
      const connection = connectionService.get(userId);

      const isPlayer = role === EUserRole.Player;
      const gameState = this.getGameState(gameId, userId, isPlayer);
      const message = JSON.stringify({
        data: gameState,
        type: EMessageType.GameStateChange,
      } as IMessage<IGameStateDTO>);

      connection.send(message);
    }
  };

  startGame(roomId: string, userId: string, gameConfig?: Partial<IGameConfig>) {
    const room = this.getRoom(roomId);
    if (userId !== room.owner.id) {
      throw Error(
        `Cant start a game in room ${room.id}: ${userId} is not an owner`
      );
    }
    const shuffledPlayers = shuffle(room.players);
    const game = new Game({
      players: shuffledPlayers,
      roomId,
      onGameStart: gameService.broadcastGameState,
      ...DEFAULT_GAME_SETUP,
      ...gameConfig,
    });

    this.games.set(game.id, game);
    room.startGame(game.id);
    game.start();

    const userIds = room.users.map((user) => user.id);
    connectionService.broadcast(userIds, {
      type: EMessageType.GameStarted,
      data: game.id,
    });
    return game;
  }

  removeGame(id: string) {
    this.games.delete(id);
  }

  getRoom(id: string) {
    const room = this.rooms.get(id);

    if (!room) {
      throw Error(`No room found with id ${id}`);
    }

    return room;
  }

  getGame = (id: string) => {
    const game = this.games.get(id);
    if (!game) throw Error(`No game with ID ${id} found`);
    return game;
  };

  getGameState = (gameId: string, userId: string, isPlayer: boolean) => {
    const game = this.getGame(gameId);

    const { players, table } = game.getSafeState();

    const availableActions = isPlayer
      ? game.getPlayerAvailableActions(userId)
      : [];

    const playerState = isPlayer ? game.getPlayer(userId).state : null;

    const state: IGameStateDTO = {
      availableActions,
      players,
      table,
      playerState,
      isPlayerActive: game.checkPlayerIsActive(userId),
      activePlayer: game.getActivePlayer().id,
      gameResults: game.getGameResults(),
      round: game.round
    };

    return state;
  };

  dispatch = (
    gameId: string,
    action: EPlayerAction,
    userId: string,
    data?: any
  ) => {
    const game = this.getGame(gameId);

    game.dispatch(userId, action, data);
    this.broadcastGameState(gameId);
  };
}

export const gameService = new GameService();
