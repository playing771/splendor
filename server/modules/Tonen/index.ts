import { ETokenColor, ITokenShape } from "../../interfaces/token";

export class Token implements ITokenShape{
  color: ETokenColor;

  constructor({color}: ITokenShape) {
    this.color = color
  }
}
export const createdToken = (config: ITokenShape) => {
  return new Token(config)
}
