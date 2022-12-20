import { ETokenColor, ITokenShape } from "../../interfaces/token";

export class Token implements ITokenShape{
  color: ETokenColor;

  constructor({color}: ITokenShape) {
    this.color = color
  }
}
export const createToken = (config: ITokenShape) => {
  return new Token(config)
}
