import express, { json } from 'express'
import cors from 'cors';
import { IGameAvailableActionsDTO, IGameStateDTO, ILoginDTO } from '../../interfaces/api'
import { userService } from '../services/UserService';
import { gameService } from '../services/GameService';

const app = express()
const port = 3000

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
    const safeState: IGameStateDTO = currentGame.getSafeState()
    res.status(200).json(safeState);
  })

  app.get('/game/start', (req, res) => {
    gameService.create();
    res.sendStatus(200);
  })

  app.get('/game/availableActions/:userId', (req, res) => {
    const currentGame = gameService.games[0];
    const { userId } = req.params;
    const response: IGameAvailableActionsDTO = { availableActions: currentGame.getPlayerAvailableActions(userId) }
    res.status(200).json(response);
  })

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}