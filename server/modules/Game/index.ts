import { v4 as uuidv4 } from 'uuid';
import { getKeys } from '../../../utils/typescript';
import { ICardShape } from '../../../interfaces/card';
import {
  EPlayerAction,
  EPLayerState,
  IGameConfig,
  IGameShape,
} from '../../../interfaces/game';
import { IPlayerConfig, TPlayerTokens } from '../../../interfaces/player';
import { EGemColor } from '../../../interfaces/gem';
import { GameTable } from '../GameTable';
import { Player } from '../Player';
import { createStateMachine } from '../StateMachine';
import { IStateMachine } from '../StateMachine/models';
import { TableManager } from '../TableManager';
import { TAKE_GEM_LIMIT, PLAYER_MAX_GEMS_LIMIT, TAKE_GEM_LIMIT_SAME_COLOR, GEMS_IN_STOCK_LIMIT } from './constants';
import {
  createGameSMDefinition,
  EGameBasicState,
  TGameEvent,
} from './createGameSMDefinition';
import {
  STATES_AVAILABLE_FOR_ACTION,
  createPlayerSMDefinition,
} from './createPlayerSMDefinition';
import { useId } from 'react';

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
    this.id = uuidv4();

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
    return true;
  };

  public move = () => {
    this.sm.dispatchTransition('next');
    return true;
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

  public showPlayerGems(playerId: string) {
    const { gems, gemsCount } = this.getPlayer(playerId);
    return { count: gemsCount, gems };
  }

  public dispatch(userId: string, action: EPlayerAction, data?: any) {
    const actionIsAllowed = this.smPlayers[userId].checkTransition(action);
    console.log('actionIsAllowed', actionIsAllowed);

    if (!actionIsAllowed) {
      throw Error(
        `cant dispatch ${action} for ${userId} now (player state: ${this.smPlayers[userId].value})`
      );
    }

    switch (action) {
      case EPlayerAction.TakeGems:
        this.buyTokensByPlayer(userId, data);
        break;

      case EPlayerAction.BuyCard: {
        this.buyCardByPlayer(userId, data);
        break;
      }
      default:
        // TODO: make same as TakeGems for all actions
        this.dispatchPlayerAction(userId, action, data);
        break;
    }
  }

  private dispatchPlayerAction(
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

  private buyTokensByPlayer(playerId:string, gems: TPlayerTokens) {

    if (gems[EGemColor.Gold] > 0) {
      throw Error(`Cant buy ${EGemColor.Gold} tokens`);
    }

    const colors = Object.entries(gems) as [EGemColor, number][];

    // check limit of 3 diff color or 2 of the same color
    let gemsToTakeLimitRemaining = TAKE_GEM_LIMIT;

    for (const [color, value] of colors) {
      if (value > TAKE_GEM_LIMIT_SAME_COLOR){
        throw Error(`${value} exceeds the limit ${TAKE_GEM_LIMIT_SAME_COLOR} of same color gems to take`)
      }
      if (this.tableManager.table.gems[color] < GEMS_IN_STOCK_LIMIT){
        throw Error(`Cant take ${value} ${color} gems because the stock is less than ${GEMS_IN_STOCK_LIMIT}`)
      }
      gemsToTakeLimitRemaining -= value === 1? value: TAKE_GEM_LIMIT;

      if (gemsToTakeLimitRemaining < 0) {
        throw Error(`Cant take ${value} ${color} gems`)
      }
    }

    this.giveTokensToPlayer(playerId, gems);
  }

  private giveTokensToPlayer(playerId: string, gems: TPlayerTokens) {
    const targetPlayer = this.getPlayer(playerId);
    const colors = Object.entries(gems) as [EGemColor, number][];

    this.dispatchPlayerAction(
      playerId,
      targetPlayer.gemsCount <= PLAYER_MAX_GEMS_LIMIT
        ? EPlayerAction.TakeGems
        : EPlayerAction.TakeGemsOverLimit
    );

    for (const [color, value] of colors) {
      const count = this.tableManager.removeGems(color, value);
      targetPlayer.getTokens(color, count);
    }
  }

  private buyCardByPlayer(playerId: string, cardId?: string): ICardShape {
    const targetPlayer = this.getPlayer(playerId);

    if (!cardId) throw Error('cant buy a card without cardId provided');

    const [targetCard] = this.tableManager.findCardOnTable(cardId);

    const tokensSpent = targetPlayer.buyCard(targetCard);

    Object.values(EGemColor).forEach((color) => {
      this.tableManager.addGems(color, tokensSpent[color]);
    });

    const card = this.tableManager.giveCardFromTable(cardId);

    this.dispatchPlayerAction(playerId, EPlayerAction.BuyCard, cardId);

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
          // buyCard: this.buyCardPlayerActionCreator(player.id),
          // takeTokens: this.takeTokensPlayerActionCreator(player.id)
          // activateNextPlayer: this.startTurnPlayerActionCreator()
        })
      );

      acc[player.id] = playerStateMachine;

      return acc;
    }, {} as { [key: string]: IStateMachine<EPLayerState, EPlayerAction> });
  }

  private startTurnPlayerActionCreator = (playerId: string) => () => {
    console.log('startTurnPlayerActionCreator', playerId);

    this.dispatchPlayerAction(playerId, EPlayerAction.StartTurn);
  };

  private endTurnPlayerActionCreator = (playerId: string) => () => {
    this.dispatchPlayerAction(playerId, EPlayerAction.EndTurn);
  };

  // private buyCardPlayerActionCreator =
  //   (playerId: string) => (cardId?: string) => {

  //     this.buyCardByPlayer(playerId, cardId);
  //     this.dispatchPlayerAction(playerId, EPlayerAction.BuyCard, cardId);

  //     return true
  //   };

  // private takeTokensPlayerActionCreator = (playerId: string) => (gems: Partial<TPlayerTokens>)=> {
  //   this.giveTokensToPlayer(playerId, gems);

  //   return true
  // }
}
