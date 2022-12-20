import { EDevDeckLevel } from "../../interfaces/devDeck";
import { TGameTableShape } from "../../interfaces/gameTable";
import { ETokenColor } from "../../interfaces/token";
import { DevDeck } from "../DevDeck";
import { BaseDeck } from "../DevDeck/BaseDeck";
import { TableManager } from "./TableManager";

const TABLE_CONFIG: TGameTableShape<{id:string}> = {
  [EDevDeckLevel.First]: {
    cards: [],
    deck: new DevDeck({
      level: EDevDeckLevel.First,
      cards: [ {id: "one.first" }, { id: "two.first" }, { id: "three.first" }],
      name: 'First'
    })
  },
  [EDevDeckLevel.Second]: {
    cards: [],
    deck: new DevDeck({
      level: EDevDeckLevel.Second,
      cards: [ {id: "one" }, { id: "two" }, { id: "three" }],
      name: 'Second'
    })
  },
  [EDevDeckLevel.Third]: {
    cards: [],
    deck: new DevDeck({
      level: EDevDeckLevel.Third,
      cards: [ {id: "one" }, { id: "two" }, { id: "three" }],
      name: 'Third'
    })
  },
  [ETokenColor.Blue]: 7,
  [ETokenColor.Brown]: 7,
  [ETokenColor.Gold]: 5,
  [ETokenColor.Green]: 7,
  [ETokenColor.Red]: 7,
  [ETokenColor.White]: 7,
}

describe('Table functional', ()=> {
  const table = new TableManager(TABLE_CONFIG)
  it('Test give card from table', () => {
    expect(table.giveCardFromDeck(EDevDeckLevel.First).id).toBe("three.first")
    expect(table.giveCardFromDeck(EDevDeckLevel.First).id).toBe("two.first")
    expect(table.giveCardFromDeck(EDevDeckLevel.First).id).toBe("one.first")
  })
})