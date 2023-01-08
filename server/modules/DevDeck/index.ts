import { EDeckLevel, IDevDeckConfig, IDevDeckShape } from "../../../interfaces/devDeck";
import { BaseDeck } from "./BaseDeck";

export class DevDeck<C> extends BaseDeck<C> implements IDevDeckShape<C>  {
  level: EDeckLevel;
  
  constructor({level, ...rest}: IDevDeckConfig<C>) {
    super(rest);
    this.level = level;
  }
}