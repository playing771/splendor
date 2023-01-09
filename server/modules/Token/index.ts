import { EGemColor, ITokenShape } from "../../interfaces/gem";

export class Token implements ITokenShape{
  color: EGemColor;

  constructor({color}: ITokenShape) {
    this.color = color
  }
}
export const createToken = (config: ITokenShape) => {
  return new Token(config)
}
