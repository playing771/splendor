export interface IBaseDeckConfig<C> {
  name: string;
  cards: Array<C>;
}

export interface IBaseDeckShape<C> {
  name: string;
  cards: Array<C>;
  getTop(): C | null;
  lookTop(): C | null;
  getTopCards(count:number): C[];
  shuffle(): void;
}