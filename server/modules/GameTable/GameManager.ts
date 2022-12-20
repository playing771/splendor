import { IGameManagerShape } from "../../interfaces/gameManager";
import { TGameTableShape } from "../../interfaces/gameTable";

export class GameManager<C> implements IGameManagerShape<C> {
  table: TGameTableShape<C>;
  takeToken(): number {
    throw new Error("Method not implemented.");
  }
  giveToken(): number {
    throw new Error("Method not implemented.");
  }
  buyCard(): C {
    throw new Error("Method not implemented.");
  }
  holdCard(): C {
    throw new Error("Method not implemented.");
  }
  
  constructor({table}: TGameTableShape<C>)
}