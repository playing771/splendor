import express from 'express';
import session from 'express-session';
import cors from 'cors';
import {
  IGameAvailableActionsDTO,
  IGameStateDTO,
  ILoginDTO,
} from '../../interfaces/api';
import { userService } from '../services/UserService';
import { gameService } from '../services/GameService';
import { WebSocketServer } from 'ws';
import { connectionService } from '../services/ConnectionService';
import http from 'http';
import { EPlayerAction } from '../../interfaces/game';

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
const APP_PORT = 8080;
const SECRET = 'FCP_UNLIMITED';

const sessionMiddleware = session({
  secret: SECRET,
  resave: false,
  saveUninitialized: false,

  cookie: {
    // secure: false,
    // httpOnly: false
    // secure: true,
    // httpOnly: true,
  },
});

const corsMiddleware = cors({
  credentials: true,
  origin: 'http://localhost:5173',
});

export const Api = () => {
  app.use(corsMiddleware);
  app.use(sessionMiddleware);
  app.use(express.json());

  app.post('/auth/login/:username', (req, res) => {
    const { username } = req.params;
    const userId = req.session.userId;

    if (!!userId) {
      const user = userService.get(userId);
      if (!user) {
        return res.sendStatus(500);
      }
      return res.status(200).json(user);
    }

    const user: ILoginDTO = userService.add(username);

    console.log(`Updating session for user ${user.name} ${user.id}`);

    req.session.userId = user.id;

    return res.status(200).json(user);
  });

  app.get('/room/users', isAuthenticated, (req, res) => {
    const users = userService.users;
    res.status(200).json({ users });
  });

  // app.get('/game/state', isAuthenticated, (req, res) => {
  //   const currentGame = gameService.games[0];
  //   if (currentGame) {
  //     const safeState: IGameStateDTO = currentGame.getSafeState();
  //     res.status(200).json(safeState);
  //   } else {
  //     res.status(500);
  //   }
  // });

  app.get('/game/start', isAuthenticated, (req, res) => {
    gameService.create();
    res.sendStatus(200);
  });

  app.post('/game/dispatch', isAuthenticated, (req, res) => {
    const payload: { action?: EPlayerAction, data?: any } = req.body;
    const userId = req.session.userId;
    console.log('/game/dispatch', payload );
    
    if (payload.action && userId) {
      try {
        gameService.dispatch(payload.action, userId, payload.data);
        res.sendStatus(200);
      } catch (error) {
        
        const err = error as Error;
        
        res.status(500).send(err.message);
      }

    } else {
      res.sendStatus(500);
    }


  })

  app.get('/game/availableActions', isAuthenticated, (req, res) => {
    const currentGame = gameService.games[0];
    if (currentGame) {
      const userId = req.session.userId!;
      const response: IGameAvailableActionsDTO = {
        availableActions: currentGame.getPlayerAvailableActions(userId),
      };
      res.status(200).json(response);
    } else {
      res.sendStatus(500);
    }
  });

  // app.listen(REST_PORT, () => {
  //   console.log(`App listening on port ${REST_PORT}`)
  // })

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
    console.log('request.session', request.session);
    const userId = request.session.userId;
    connectionService.add(userId, ws);

    const gameState = gameService.getGameState(userId);
    const message = JSON.stringify(gameState);

    ws.send(message);

    // ws.on('message', function (message) {
    //   //
    //   // Here we can now use session parameters.
    //   //
    //   console.log(`Received message ${message} from user ${userId}`);

    // });

    ws.on('close', function () {
      connectionService.delete(userId);
    });

  });

  //
  // Start the server.
  //
  server.listen(APP_PORT, function () {
    console.log(`Listening on http://localhost:${APP_PORT}`);
  });
};
