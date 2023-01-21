import { TCardCost } from "./card";

export interface INobleShape {
  id:string;
  requirements: TCardCost,
  score: number;
}