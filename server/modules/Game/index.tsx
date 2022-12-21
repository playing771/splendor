import { ICardShape } from "../../interfaces/card";
import { EDevDeckLevel } from "../../interfaces/devDeck";
import { IGameShape } from "../../interfaces/game";
import { TGameTableConfig, TGameTableShape } from "../../interfaces/gameTable";
import { IPlayerShape } from "../../interfaces/player";
import { ITableManagerShape } from "../../interfaces/tableManager";
import { ETokenColor } from "../../interfaces/token";
import { CARDS_MAP_BY_LEVEL } from "../../static/cards";
import { GameTable } from "../GameTable";
import { Player } from "../Player";
import { TableManager } from "../TableManager";

const PLAYERS: Array<{ id: string, name: string }> = [
  {
    id: "sdfsf",
    name: "Maxim"
  },
  {
    id: "134rwfd",
    name: "Evgenii"
  }
]

const tableConfig: TGameTableConfig<ICardShape> = {
  initialCountCard: 3,
  [EDevDeckLevel.First]: [
    ...CARDS_MAP_BY_LEVEL[EDevDeckLevel.First]
  ],
  [EDevDeckLevel.Second]: [
    ...CARDS_MAP_BY_LEVEL[EDevDeckLevel.Second]
  ],
  [EDevDeckLevel.Third]: [
    ...CARDS_MAP_BY_LEVEL[EDevDeckLevel.Third]
  ],
  [ETokenColor.Blue]: 5,
  [ETokenColor.Brown]: 5,
  [ETokenColor.Gold]: 5,
  [ETokenColor.Green]: 5,
  [ETokenColor.Red]: 5,
  [ETokenColor.White]: 5,
}




export class Game implements IGameShape<ICardShape> {
  table: TGameTableShape<ICardShape>;
  tableManager: ITableManagerShape<ICardShape>;
  players: IPlayerShape[];
  id: string;


  constructor() {
    this.table = new GameTable(tableConfig);
    this.tableManager = new TableManager(this.table);
    this.id = `${Math.random()}`
    this.players = PLAYERS.map(({ id, name }) => new Player(name, id));
  }


  getTokensByPlayer(playerId:string, color: ETokenColor, count: number){

  }

}