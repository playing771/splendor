export interface IBaseDeckConfig<C> {
  name: string;
  cards: Array<C>;
}

export interface IBaseDeck<C> {
  name: string;
  cards: Array<C>;
  getTopCard(): C;
}