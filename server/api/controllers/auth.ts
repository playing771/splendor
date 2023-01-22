import { NextFunction, Request, Response } from "express";
import { ILoginDTO } from "../../../interfaces/api";
import { userService } from "../../services/UserService";

export const authController = {
  login: <R>(req: Request<R>, res: Response, _next: NextFunction) => {
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
  },
  userInfo: <R>(req: Request<R>, res: Response) => {

    const userId = req.session.userId;
    const user = userService.get(userId);

    return res.status(200).json(user);
  }
  
}