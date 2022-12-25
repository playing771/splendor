import { ICardShape } from '../../interfaces/card';
import { EDevDeckLevel } from '../../interfaces/devDeck';
import { IGameShape } from '../../interfaces/game';
import { TGameTableConfig, TGameTableShape } from '../../interfaces/gameTable';
import { IPlayerShape } from '../../interfaces/player';
import { ITableManagerShape } from '../../interfaces/tableManager';
import { ETokenColor } from '../../interfaces/token';
import { CARDS_MAP_BY_LEVEL } from '../../static/cards';
import { GameTable } from '../GameTable';
import { Player } from '../Player';
import { createStateMachine } from '../StateMachine';
import { IStateMachine, TStateMachineDefinition } from '../StateMachine/models';
import { TableManager } from '../TableManager';

const PLAYERS: Array<{ id: string; name: string }> = [
  {
    id: 'sdfsf',
    name: 'Maxim',
  },
  {
    id: '134rwfd',
    name: 'Evgenii',
  },
];

const tableConfig: TGameTableConfig<ICardShape> = {
  initialCountCard: 3,
  [EDevDeckLevel.First]: [...CARDS_MAP_BY_LEVEL[EDevDeckLevel.First]],
  [EDevDeckLevel.Second]: [...CARDS_MAP_BY_LEVEL[EDevDeckLevel.Second]],
  [EDevDeckLevel.Third]: [...CARDS_MAP_BY_LEVEL[EDevDeckLevel.Third]],
  [ETokenColor.Blue]: 5,
  [ETokenColor.Brown]: 5,
  [ETokenColor.Gold]: 5,
  [ETokenColor.Green]: 5,
  [ETokenColor.Red]: 5,
  [ETokenColor.White]: 5,
};

type TGameState = 'INITIALIZATION' | 'GAME_ENDED';
type TTurnEvent = 'next' | 'start' | 'end';

const createTurnsSMDefinition = <P extends string>(players: P[]) => {
  const definition = players.reduce((acc, current, index) => {
    const nextPlayerIndex = (index + 1) % players.length;
    acc[current] = {
      transitions: {
        next: {
          action: () => null,
          target: players[nextPlayerIndex],
        },
      },
    };
    return acc;
  }, {} as TStateMachineDefinition<P, TTurnEvent>);

  const finalDefinition: TStateMachineDefinition<P | TGameState, TTurnEvent> = {
    ...definition,
    INITIALIZATION: {
      transitions: {
        start: {
          action: () => null,
          target: players[0],
        },
      },
    },
    GAME_ENDED: {
      transitions: {
        end: {
          action: () => null,
          target: 'INITIALIZATION',
        },
      },
    },
  };

  return finalDefinition;
};

// {
// INITIALIZATION: {
//   transitions: {
//     nextPlayer: {
//       action: ()=>null,
//       target: 'A'
//     }
//   }
// },
//   end: {
//   transitions: {
//     nextPlayer: {
//       action: ()=>null,
//       target: 'INITIALIZATION'
//     }
//   }
// }
// }
// as TStateMachineDefinition<TGameState, TTurnEvent>

export class Game implements IGameShape<ICardShape> {
  table: TGameTableShape<ICardShape>;
  tableManager: ITableManagerShape<ICardShape>;
  players: IPlayerShape[];
  id: string;
  turns: IStateMachine<typeof PLAYERS[number]['id'], TTurnEvent>;

  constructor() {
    this.table = new GameTable(tableConfig);
    this.tableManager = new TableManager(this.table);
    this.id = `${Math.random()}`;
    this.players = PLAYERS.map(({ id, name }) => new Player(name, id));
    const smDefinition = createTurnsSMDefinition(
      PLAYERS.map((player) => player.id)
    );
    console.log('smDefinition', smDefinition);

    this.turns = createStateMachine(PLAYERS[0].id, smDefinition);
  }

  getTokensByPlayer(playerId: string, color: ETokenColor, count: number) {}
}
