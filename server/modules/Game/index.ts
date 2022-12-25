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
import { addStateLogger } from '../StateMachine/addStateLogger';
import { IStateMachine, TStateMachineDefinition } from '../StateMachine/models';
import { TableManager } from '../TableManager';
import {
  createGameSMDefinition,
  EGameBasicState,
  TTurnEvent,
} from './createGameSMDefinition';
import {
  createPlayerSMDefinition,
  EPlayerActions,
  EPLayerState,
} from './createPlayerSMDefinition';

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

export class Game implements IGameShape<ICardShape> {
  id: string;
  table: TGameTableShape<ICardShape>;
  tableManager: ITableManagerShape<ICardShape>;

  sm: IStateMachine<string | EGameBasicState, TTurnEvent>;

  players: IPlayerShape[];
  smPlayers: { [playerId: string]: IStateMachine<EPLayerState, EPlayerActions> };

  constructor(players: Array<{ id: string; name: string }>) {
    this.id = `${Math.random()}`;

    this.table = new GameTable(tableConfig);
    this.tableManager = new TableManager(this.table);

    this.players = players.map(({ id, name }) => new Player(name, id));
    this.smPlayers = this.initializePlayersSM();

    const smDefinition = createGameSMDefinition(this.players, {
      startTurn: this.startTurnPlayerActionCreator,
      endTurn: this.endTurnPlayerActionCreator
    });

    this.sm = createStateMachine(EGameBasicState.Initialization, smDefinition);

    this.startGame();
  }

  private initializePlayersSM = () => {
    return this.players.reduce((acc, current) => {
      const playerStateMachine = createStateMachine<
        EPLayerState,
        EPlayerActions
      >(EPLayerState.Idle, createPlayerSMDefinition());

      acc[current.id] = playerStateMachine;

      return acc;
    }, {} as { [key: string]: IStateMachine<EPLayerState, EPlayerActions> });
  }


  startGame = () => {
    this.sm.dispatchTransition('start');
  };

  startTurnPlayerActionCreator = (playerId: string) => () => {
    this.smPlayers[playerId].dispatchTransition(EPlayerActions.StartTurn);
  };

  endTurnPlayerActionCreator = (playerId: string) => () => {
    this.smPlayers[playerId].dispatchTransition(EPlayerActions.EndTurn);
  };

  dispatchPlayerAction = () => {
    // this.sm.value
  };

  getPlayer = (playerId: string) => {
    const targetPlayer = this.players.find((player) => player.id === playerId);

    if (!targetPlayer) {
      throw Error(`cant find player with id: ${playerId}`);
    }

    return targetPlayer;
  };

  getTokensByPlayer(playerId: string, color: ETokenColor, count: number) { }
}
