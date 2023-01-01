import { EDevDeckLevel } from "./devDeck";
import { TGameTableShape } from "./gameTable";
import { ETokenColor } from "./token";

export interface ITableManagerShape<C>{
  table: TGameTableShape<C>;
  takeTokens(color: ETokenColor, count:number): void;
  giveTokens(color: ETokenColor, count:number): number;
  giveCardFromTable(deckLvl: EDevDeckLevel, cardIdex: number): C
}