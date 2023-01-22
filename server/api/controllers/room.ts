import { NextFunction, Request, Response } from 'express';
import { ERoomState } from '../../../interfaces/room';
import { EUserRole } from '../../../interfaces/user';
import { gameService } from '../../services/GameService';
import { userService } from '../../services/UserService';

export const roomController = {
  rooms: <R>(req: Request<R>, res: Response, _next: NextFunction) => {
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
  },
  create: <R>(req: Request<R>, res: Response) => {
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
  },
  leave: <R>(req: Request<R>, res: Response) => {
    const { roomId } = req.body;
    const userId = req.session.userId!;
    try {
      gameService.leaveRoom(roomId, userId);
      res.sendStatus(200);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
  join: <R>(req: Request<R>, res: Response) => {
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
            res.status(200).json({ gameId: room.gameId });
          }
          break;
        default:
          throw Error(`Cant join room: uknown ${role} role`);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
  start: <R>(req: Request<R>, res: Response) => {

    const { roomId } = req.body;
    const userId = req.session.userId!;
    try {
      const game = gameService.startGame(roomId, userId);
      res.status(200).json(game.id);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

};
