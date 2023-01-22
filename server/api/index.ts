import express from 'express';
import session from 'express-session';
import cors from 'cors';
import {
  EMessageType,
  ILoginDTO,
  IMessage,
} from '../../interfaces/api';
import {CLIENT_PORT, SERVER_PORT, SERVER_URL} from '../../constants';
import { userService } from '../services/UserService';
import { gameService } from '../services/GameService';
import { WebSocketServer } from 'ws';
import { connectionService } from '../services/ConnectionService';
import http from 'http';
import { EPlayerAction } from '../../interfaces/game';
import { EUserRole } from '../../interfaces/user';
import { ERoomState } from '../../interfaces/room';

// middleware to test if authenticated
function isAuthenticated(req, res, next) {
  if (req.session.userId) next();
  else res.sendStatus(401);
}
declare module 'express-session' {
  interface SessionData {
    userId?: string;
  }
}

const app = express();
const SECRET = 'FCP_UNLIMITED';

const sessionMiddleware = session({
  secret: SECRET,
  resave: false,
  saveUninitialized: false,

  cookie: {
    // sameSite: 'none',
    // secure: false,
    // secure: false,
    // httpOnly: false
    // secure: true,
    // httpOnly: true,
  },
});

const whitelist = [`http://${SERVER_URL}:${CLIENT_PORT}`, `http://${SERVER_URL}:`];

const corsMiddleware = cors({
  credentials: true,
  // origin: function (origin, callback) {
  //   if (whitelist.indexOf(origin as string) !== -1) {
  //     callback(null, true)
  //   } else {
  //     callback(new Error('Not allowed by CORS'))
  //   }
  // }
  // origin: 'http://localhost:5173',
  origin: `http://${SERVER_URL}:${CLIENT_PORT}`,
});

export const Api = () => {
  app.use(corsMiddleware);
  app.use(sessionMiddleware);
  app.use(express.json());

  app.post<unknown, unknown, { username: string }>(
    '/auth/login',
    (req, res) => {
      const { username } = req.body;

      const userId = req.session.userId;

      if (!!userId) {
        const user = userService.getUnsafe(userId);
        if (!user) {
          return res.sendStatus(500);
        }
        return res.status(200).json(user);
      }

      const user: ILoginDTO = userService.add(username);

      console.log(`Updating session for user ${user.name} ${user.id}`);

      req.session.userId = user.id;

      return res.status(200).json(user);
    }
  );

  app.get<unknown, unknown>(
    '/auth/userInfo',
    isAuthenticated,
    (req, res) => {

      const userId = req.session.userId;
      const user = userService.get(userId);

      return res.status(200).json(user);
    }
  );

  // app.get('/game/state', isAuthenticated, (req, res) => {
  //   const currentGame = gameService.games[0];
  //   if (currentGame) {
  //     const safeState: IGameStateDTO = currentGame.getSafeState();
  //     res.status(200).json(safeState);
  //   } else {
  //     res.status(500);
  //   }
  // });

  app.get<unknown, unknown, unknown, { roomId?: string }>(
    '/rooms',
    (req, res) => {
      const { roomId } = req.query;
      try {
        const result =
          typeof roomId === 'string'
            ? gameService.getRoom(roomId)
            : [...gameService.rooms.values()];

        res.status(200).json(result);
      } catch (error) {
        console.log('error', error);

        res.status(500).send(error.message);
      }
    }
  );

  app.post<unknown, unknown, { roomName?: string }>(
    '/rooms/create',
    isAuthenticated,
    (req, res) => {
      const { roomName } = req.body;
      // console.log('roomName',roomName);

      const userId = req.session.userId;
      const user = userService.get(userId);

      // console.log('user',user);

      try {
        const room = gameService.createRoom(
          roomName || `${user.name}'s game`,
          user.id
        );
        res.status(200).json(room);
      } catch (error) {
        res.status(500).send(error.message);
      }
    }
  );

  app.post<unknown, unknown, { roomId: string }>(
    '/rooms/leave',
    isAuthenticated,
    (req, res) => {
      const { roomId } = req.body;
      const userId = req.session.userId!;
      try {
        gameService.leaveRoom(roomId, userId);
        res.sendStatus(200);
      } catch (error) {
        res.status(500).send(error.message);
      }
    }
  );

  app.post<unknown, unknown, { roomId: string; role: EUserRole }>(
    '/rooms/join',
    isAuthenticated,
    (req, res) => {
      const { roomId, role } = req.body;
      const userId = req.session.userId!;
      try {
        switch (role) {
          case EUserRole.Player:
            gameService.joinRoomAsPlayer(roomId, userId);
            res.sendStatus(200);
            break;
          case EUserRole.Spectator:
            gameService.joinRoomAsSpectator(roomId, userId);
            const room = gameService.getRoom(roomId);
            
            if (room.state === ERoomState.Started) {
              res.status(200).json({gameId: room.gameId})
            }
            break;
          default:
            throw Error(`Cant join room: uknown ${role} role`);
        }

        
      } catch (error) {
        res.status(500).send(error.message);
      }
    }
  );

  app.post<unknown, unknown, { roomId: string }>(
    '/rooms/start',
    isAuthenticated,
    (req, res) => {
      const { roomId } = req.body;
      const userId = req.session.userId!;
      try {
        const game = gameService.startGame(roomId, userId);
        res.status(200).json(game.id);
      } catch (error) {
        res.status(500).send(error.message);
      }
    }
  );

  app.post<unknown, unknown, { action?: EPlayerAction; data?: any }>(
    '/game/dispatch',
    isAuthenticated,
    (req, res) => {
      const payload = req.body;
      const { gameId } = req.query;
      const userId = req.session.userId;
      console.log('/game/dispatch', payload);

      if (payload.action && userId) {
        try {
          gameService.dispatch(
            gameId as string,
            payload.action,
            userId,
            payload.data
          );
          res.sendStatus(200);
        } catch (error) {
          const err = error as Error;

          res.status(500).send(err.message);
        }
      } else {
        res.sendStatus(500);
      }
    }
  );

  //
  // Create an HTTP server.
  //
  const server = http.createServer(app);

  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', function (request, socket, head) {
    console.log('Parsing session from request...');

    sessionMiddleware(request, {}, () => {
      if (!request.session.userId) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
      }

      console.log('Session is parsed!');

      wss.handleUpgrade(request, socket, head, function (ws) {
        wss.emit('connection', ws, request);
      });
    });
  });

  wss.on('connection', function connection(ws, request) {
    console.log('new connection');

    const userId = request.session.userId;

    try {
      console.log('request.session', request.session);
      connectionService.add(userId, ws);

      // const gameState = gameService.getGameState(userId);
      // const message = JSON.stringify(gameState);

      // ws.send(message);

      ws.on('message', function (message) {
        const parsedMessage: IMessage<unknown> = JSON.parse(message.toString());

        if (!parsedMessage || !parsedMessage.data) {
          throw Error(`Incorrect message contract`);
        }

        if (parsedMessage.type === EMessageType.GetGameState) {
          const gameId = parsedMessage.data as string;
          gameService.broadcastGameState(gameId, userId);
        }
      });

      ws.on('close', function () {
        console.log('WEBSOCKET CLOSED', userId);

        connectionService.delete(userId);
      });
    } catch (error) {
      console.log('Error in websockets', error);
    }
  });

  //
  // Start the server.
  //
  server.listen(SERVER_PORT, function () {
    console.log(`Listening on http://localhost:${SERVER_PORT}`);
  });
};
