import { getKeys } from '../../../utils/typescript';
import { ICardShape } from '../../interfaces/card';
import { EDevDeckLevel } from '../../interfaces/devDeck';
import { IGameConfig, IGameShape } from '../../interfaces/game';
import { TGameTableShape } from '../../interfaces/gameTable';
import { IPlayerConfig, IPlayerShape } from '../../interfaces/player';
import { ITableManagerShape } from '../../interfaces/tableManager';
import { ETokenColor } from '../../interfaces/token';
import { GameTable } from '../GameTable';
import { Player } from '../Player';
import { createStateMachine } from '../StateMachine';
import { IStateMachine } from '../StateMachine/models';
import { TableManager } from '../TableManager';
import { TOKENS_LIMIT } from './constants';
import {
  createGameSMDefinition,
  EGameBasicState,
  TGameEvent,
} from './createGameSMDefinition';
import {
  STATES_AVAILABLE_FOR_ACTION,
  createPlayerSMDefinition,
  EPlayerAction,
  EPLayerState,
} from './createPlayerSMDefinition';

type PlayerId = string;
type TGameState = PlayerId | EGameBasicState;

export class Game implements IGameShape<ICardShape> {
  public id: string;
  public table: TGameTableShape<ICardShape>;

  private players: IPlayerShape[];
  private tableManager: ITableManagerShape<ICardShape>;
  private sm: IStateMachine<TGameState, TGameEvent>;
  private smPlayers: {
    [playerId: PlayerId]: IStateMachine<EPLayerState, EPlayerAction>;
  };

  constructor({
    players,
    tableConfig,
  }: IGameConfig & { players: IPlayerConfig[] }) {
    this.id = `${Math.random()}`;

    this.table = new GameTable(tableConfig);
    this.tableManager = new TableManager(this.table);

    this.players = players.map((playerConfig) => new Player(playerConfig));
    this.smPlayers = this.initializePlayersSM();

    const gameSMDefinition = createGameSMDefinition(this.players, {
      [EPlayerAction.StartTurn]: this.startTurnPlayerActionCreator,
      [EPlayerAction.EndTurn]: this.endTurnPlayerActionCreator,
    });

    this.sm = createStateMachine(
      EGameBasicState.Initialization,
      gameSMDefinition
    );
    this.start();
  }

  public start() {
    this.sm.dispatchTransition('start');
  }

  public move() {
    this.sm.dispatchTransition('next');
  }

  public getState() {
    return this.sm.value;
  }

  public getSafeState() {
    return this.table.getSafeState();
  }

  public getPlayerState(playerId: string) {
    return this.smPlayers[playerId].value;
  }

  public getPlayer(playerId: string) {
    const targetPlayer = this.players.find((player) => player.id === playerId);

    if (!targetPlayer) {
      throw Error(`cant find player with id: ${playerId}`);
    }

    return targetPlayer;
  }

  public showPlayerTokens(playerId: string) {
    const { tokens, tokensCount } = this.getPlayer(playerId);
    return { count: tokensCount, tokens };
  }

  public dispatchPlayerAction(playerId: string, action: EPlayerAction) {
    this.smPlayers[playerId].dispatchTransition(action);
  }

  public getPlayerAvailableActions(playerId: string) {
    const playerStateMachine = this.smPlayers[playerId];
    const stateHasActions = STATES_AVAILABLE_FOR_ACTION[playerStateMachine.value]

    return stateHasActions ? getKeys(
      playerStateMachine.definition[playerStateMachine.value].transitions
    ) : []
  }

  public giveTokensToPlayer(
    playerId: string,
    tokens: { [key in ETokenColor]?: number }
  ) {
    const targetPlayer = this.getPlayer(playerId);

    for (const color of getKeys(tokens)) {
      if (typeof tokens[color] === 'number') {
        const count = this.tableManager.giveTokens(
          color,
          tokens[color] as number
        );
        targetPlayer.getTokens(color, count);
      }
    }

    this.dispatchPlayerAction(
      playerId,
      targetPlayer.tokensCount <= TOKENS_LIMIT
        ? EPlayerAction.TakeTokens
        : EPlayerAction.TakeTokensOverLimit
    );
  }

  public buyCardByPlayer(
    playerId: string,
    deckLvl: EDevDeckLevel,
    cardIdex: number
  ): ICardShape {
    const targetPlayer = this.getPlayer(playerId);

    const card = this.tableManager.giveCardFromTable(deckLvl, cardIdex);
    targetPlayer.buyCard(card);
    // targetPlayer.

    return card;
  }

  private initializePlayersSM() {
    return this.players.reduce((acc, current) => {
      const playerStateMachine = createStateMachine<
        EPLayerState,
        EPlayerAction
      >(EPLayerState.Idle, createPlayerSMDefinition());

      acc[current.id] = playerStateMachine;

      return acc;
    }, {} as { [key: string]: IStateMachine<EPLayerState, EPlayerAction> });
  }

  private startTurnPlayerActionCreator = (playerId: string) => () => {
    this.dispatchPlayerAction(playerId, EPlayerAction.StartTurn);
  };

  private endTurnPlayerActionCreator = (playerId: string) => () => {
    this.dispatchPlayerAction(playerId, EPlayerAction.EndTurn);
  };

  // private takeTokensPlayerActionCreator = (playerId: string) => ()=> {
  //   this.dispatchPlayerAction(playerId, EPlayerAction.TakeTokens);
  // }
}
