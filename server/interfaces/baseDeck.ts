export interface IBaseDeckConfig<C> {
  name: string;
  cards: Array<C>;
}

export interface IBaseDeckShape<C> {
  name: string;
  cards: Array<C>;
  getTop(): C;
  getTopCards(count:number): C[];
}