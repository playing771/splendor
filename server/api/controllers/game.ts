import { NextFunction, Request, Response } from 'express';
import { ILoginDTO } from '../../../interfaces/api';
import { gameService } from '../../services/GameService';
import { userService } from '../../services/UserService';

export const gameController = {
  start: <R>(req: Request<R>, res: Response) => {

    const { roomId } = req.body;
    const userId = req.session.userId!;
    try {
      const game = gameService.startGame(roomId, userId);
      res.status(200).json(game.id);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  dispatch: <R>(req: Request<R>, res: Response, _next: NextFunction) => {
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
  },
};
