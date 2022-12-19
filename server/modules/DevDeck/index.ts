import { EDevDeckLevel, IDevDeckConfig, IDevDeckShape } from "../../interfaces/devDeck";
import { BaseDeck } from "./BaseDeck";

export class DevDeck<C> extends BaseDeck<C> implements IDevDeckShape<C>  {
  level: EDevDeckLevel;
  
  constructor({level, ...rest}: IDevDeckConfig<C>) {
    super(rest);
    this.level = level;
  }
}