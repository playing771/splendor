import express from 'express';
import session from 'express-session';
import cors from 'cors';
import http from 'http';
import { EMessageType, IMessage } from '../../interfaces/api';
import { ORIGIN, SERVER_PORT } from '../../constants';
import { gameService } from '../services/GameService';
import { WebSocketServer } from 'ws';
import { connectionService } from '../services/ConnectionService';
import { EPlayerAction } from '../../interfaces/game';
import { EUserRole } from '../../interfaces/user';
import { authController } from './controllers/auth';
import { roomController } from './controllers/room';
import { gameController } from './controllers/game';

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

  cookie: {},
});

const corsMiddleware = cors({
  credentials: true,
  // origin: 'http://localhost:5173',
  origin: ORIGIN,
});
// TODO: https://khalilstemmler.com/articles/enterprise-typescript-nodejs/clean-consistent-expressjs-controllers/
export const Api = () => {
  app.use(corsMiddleware);
  app.use(sessionMiddleware);
  app.use(express.json());

  app.post<unknown, unknown, { username: string }>(
    '/auth/login',
    authController.login
  );

  app.get<unknown, unknown>(
    '/auth/userInfo',
    isAuthenticated,
    authController.userInfo
  );

  app.get<unknown, unknown, unknown, { roomId?: string }>(
    '/room',
    roomController.rooms
  );

  app.post<unknown, unknown, { roomName?: string }>(
    '/room/create',
    isAuthenticated,
    roomController.create
  );

  app.post<unknown, unknown, { roomId: string }>(
    '/room/leave',
    isAuthenticated,
    roomController.leave
  );

  app.post<unknown, unknown, { roomId: string }>(
    '/room/addBot',
    isAuthenticated,
    roomController.addBot
  );

  app.post<unknown, unknown, { roomId: string; role: EUserRole }>(
    '/room/join',
    isAuthenticated,
    roomController.join
  );

  app.post<unknown, unknown, { roomId: string }>(
    '/game/start',
    isAuthenticated,
    gameController.start
  );

  app.post<unknown, unknown, { action?: EPlayerAction; data?: any }>(
    '/game/dispatch',
    isAuthenticated,
    gameController.dispatch
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
      // console.log('request.session', request.session);
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
          gameService.sendGameState(gameId, userId);
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
