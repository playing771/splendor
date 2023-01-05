import express, { json } from 'express'
import cors from 'cors';
import { IGameAvailableActionsDTO, IGameStateDTO, ILoginDTO } from '../../interfaces/api'
import { userService } from '../services/UserService';
import { gameService } from '../services/GameService';
import { WebSocketServer } from 'ws';

const app = express()
const REST_PORT = 3000;
const WEBSOCKETS_PORT = 8080;
const wss = new WebSocketServer({ port: WEBSOCKETS_PORT });

export const Api = () => {

  app.use(cors());

  app.get('/auth/login/:username', (req, res) => {
    const { username } = req.params
    const user: ILoginDTO = userService.add(username);
    return res.status(200).json(user)
  })

  app.get('/room/users', (req, res) => {
    const currentGame = gameService.games[0];
    const users = userService.users;
    res.status(200).json({ users });
  })

  app.get('/game/state', (req, res) => {
    const currentGame = gameService.games[0];
    if (currentGame) {
      const safeState: IGameStateDTO = currentGame.getSafeState()
      res.status(200).json(safeState);
    } else {
      res.status(500);
    }

  })

  app.get('/game/start', (req, res) => {
    gameService.create();
    res.sendStatus(200);
  })

  app.get('/game/availableActions/:userId', (req, res) => {
    const currentGame = gameService.games[0];
    if (!currentGame) {
      res.sendStatus(500);
    }
    const { userId } = req.params;
    const response: IGameAvailableActionsDTO = { availableActions: currentGame.getPlayerAvailableActions(userId) }
    res.status(200).json(response);
  })

  app.listen(REST_PORT, () => {
    console.log(`App listening on port ${REST_PORT}`)
  })

  

  wss.on('connection', function connection(ws) {
    ws.on('message', function message(data) {
      console.log('received: %s', data);
    });

    ws.send('something');
  });

}