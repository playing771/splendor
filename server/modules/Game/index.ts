import { getKeys } from '../../../utils/typescript';
import { ICardShape } from '../../../interfaces/card';
import { EDeckLevel } from '../../../interfaces/devDeck';
import {
  EPlayerAction,
  EPLayerState,
  IGameConfig,
  IGameShape,
} from '../../../interfaces/game';
import { IPlayerConfig } from '../../../interfaces/player';
import { ETokenColor } from '../../../interfaces/token';
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
} from './createPlayerSMDefinition';

type PlayerId = string;
type TGameState = PlayerId | EGameBasicState;

export class Game implements IGameShape<ICardShape> {
  public id: string;
  public table: GameTable<ICardShape>;

  public players: Player[];
  private tableManager: TableManager<ICardShape>;
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
      startTurn: this.startTurnPlayerActionCreator,
      endTurn: this.endTurnPlayerActionCreator,
      move: this.move,
    });

    this.sm = createStateMachine(
      EGameBasicState.Initialization,
      gameSMDefinition
    );
    this.start();
  }

  public start = () => {
    this.sm.dispatchTransition('start');
    return true
  };

  public move = () => {
    this.sm.dispatchTransition('next');
    return true
  };

  public getState() {
    return this.sm.value;
  }

  public getSafeState() {
    return { table: this.table.getSafeState(), players: this.players };
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

  public checkPlayerIsActive(playerId: string) {
    return this.sm.value === playerId;
  }

  public showPlayerTokens(playerId: string) {
    const { tokens, tokensCount } = this.getPlayer(playerId);
    return { count: tokensCount, tokens };
  }

  public dispatchPlayerAction(
    playerId: string,
    action: EPlayerAction,
    data?: string
  ) {
    console.log('dispatchPlayerAction', action, data);

    this.smPlayers[playerId].dispatchTransition(action, data);
  }

  public getPlayerAvailableActions(playerId: string) {
    const playerStateMachine = this.smPlayers[playerId];
    if (!playerStateMachine)
      throw Error(`cant find stateMachine for player ID ${playerId}`);
    const stateHasActions =
      STATES_AVAILABLE_FOR_ACTION[playerStateMachine.value];

    return stateHasActions
      ? getKeys(
        playerStateMachine.definition[playerStateMachine.value].transitions
      )
      : [];
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

  public buyCardByPlayer(playerId: string, cardId?: string): ICardShape {
    const targetPlayer = this.getPlayer(playerId);

    if (!cardId) throw Error('cant buy a card without cardId provided')

    const [targetCard] = this.tableManager.findCardOnTable(cardId);
    console.log('trying to buy a card');
    
    targetPlayer.buyCard(targetCard);

    console.log('card bought');
    
    const card = this.tableManager.giveCardFromTable(cardId);

    return card;
  }

  private initializePlayersSM() {
    return this.players.reduce((acc, player) => {
      const playerStateMachine = createStateMachine<
        EPLayerState,
        EPlayerAction
      >(
        EPLayerState.Idle,
        createPlayerSMDefinition({
          move: this.move,
          buyCard: this.buyCardPlayerActionCreator(player.id),
          // activateNextPlayer: this.startTurnPlayerActionCreator()
        })
      );

      acc[player.id] = playerStateMachine;

      return acc;
    }, {} as { [key: string]: IStateMachine<EPLayerState, EPlayerAction> });
  }

  private startTurnPlayerActionCreator = (playerId: string) => () => {
    console.log('startTurnPlayerActionCreator',playerId);
    
    this.dispatchPlayerAction(playerId, EPlayerAction.StartTurn);
    return true
  };

  private endTurnPlayerActionCreator = (playerId: string) => () => {
    this.dispatchPlayerAction(playerId, EPlayerAction.EndTurn);
    return true
  };

  private buyCardPlayerActionCreator =
    (playerId: string) => (cardId?: string) => {
      console.log('buyCardPlayerActionCreator TRY');
      
      this.buyCardByPlayer(playerId, cardId);

      console.log('buyCardPlayerActionCreator SUCCESS');
      
      this.dispatchPlayerAction(playerId, EPlayerAction.BuyCard, cardId);

      return true
    };
}
