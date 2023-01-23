import { v4 as uuidv4 } from 'uuid';
import { getKeys, Nullable } from '../../../utils/typescript';
import { ICardShape } from '../../../interfaces/card';
import {
  EPlayerAction,
  EPLayerState,
  IGameConfig,
  IGameResult,
  IGameShape,
} from '../../../interfaces/game';
import { IPlayerConfig, TPlayerGems } from '../../../interfaces/player';
import { EGemColor } from '../../../interfaces/gem';
import { GameTable } from '../GameTable';
import { Player } from '../Player';
import { createStateMachine } from '../StateMachine';
import { IStateMachine } from '../StateMachine/models';
import { TableManager } from '../TableManager';
import {
  TAKE_GEM_LIMIT,
  PLAYER_GEMS_MAX,
  TAKE_GEM_LIMIT_SAME_COLOR,
  SEVERAL_GEMS_TO_TAKE_IN_STOCK_LIMIT,
  STATES_AVAILABLE_FOR_ACTION,
  GOLD_GEMS_FOR_CARD_HOLD,
  PLAYER_CARDS_HOLDED_MAX,
  SCORE_TO_END_GAME,
} from './constants';
import {
  createGameSMDefinition,
  EGameBasicState,
  TGameEvent,
} from './createGameSMDefinition';
import { createPlayerSMDefinition } from './createPlayerSMDefinition';
import { EDeckLevel } from '../../../interfaces/devDeck';
import { IUser } from '../../../interfaces/user';

type PlayerId = string;
type TGameState = PlayerId | EGameBasicState;

export class Game implements IGameShape<ICardShape> {
  public id: string;
  public roomId: string | undefined;
  public table: GameTable<ICardShape>;
  public round: number;

  public players: Player[];
  private tableManager: TableManager<ICardShape>;
  private sm: IStateMachine<TGameState, TGameEvent>;
  private smPlayers: {
    [playerId: PlayerId]: IStateMachine<EPLayerState, EPlayerAction>;
  };

  private isLastRound: boolean;
  private onGameEnd: ((result: IGameResult) => void) | undefined;
  private onGameStart: ((gameId: string) => void) | undefined;

  constructor({
    players,
    tableConfig,
    onGameEnd,
    onGameStart,
    roomId,
    hasAutostart,
  }: IGameConfig & {
    players: IPlayerConfig[];
    roomId?: string;
  }) {
    this.id = uuidv4();
    this.roomId = roomId;
    this.round = 0;

    this.table = new GameTable(tableConfig);
    this.tableManager = new TableManager(this.table);

    this.players = players.map((playerConfig) => new Player(playerConfig));
    this.smPlayers = this.initializePlayersSM();

    const gameSMDefinition = createGameSMDefinition(this.players, {
      startTurn: this.startTurnPlayerActionCreator,
      endTurn: this.endTurnPlayerActionCreator,
      move: this.move,
      updateRoundCounter: () => (this.round += 1),
    });

    this.onGameEnd = onGameEnd;
    this.onGameStart = onGameStart;

    this.sm = createStateMachine(
      EGameBasicState.Initialization,
      gameSMDefinition
    );

    this.isLastRound = false;

    if (hasAutostart) {
      this.start();
    }
  }

  public start = () => {
    this.sm.dispatchTransition('start');
    this.onGameStart && this.onGameStart(this.id);
  };

  public move = () => {
    if (this.isLastRound && this.isLastPlayerActive) {
      this.getGameResults();
      this.sm.dispatchTransition('end');
      if (this.onGameEnd) {
        this.onGameEnd(this.getGameResults());
      }
    } else {
      this.sm.dispatchTransition('next');
    }
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

  public getActivePlayerState() {
    return this.smPlayers[this.sm.value].value;
  }

  public getActivePlayer() {
    return this.getPlayer(this.sm.value);
  }

  get isLastPlayerActive() {
    const result =
      this.getActivePlayer().id === this.players[this.players.length - 1].id;

    return result;
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
    console.log('dispatch', userId, action);

    const playerStateMachine = this.smPlayers[userId];

    if (!playerStateMachine) {
      throw Error(`Cant dispatch: ${userId} is not a player`);
    }
    const actionIsAllowed = this.smPlayers[userId].checkTransition(action);

    if (!actionIsAllowed) {
      throw Error(
        `Cant dispatch ${action} for ${userId} now (player state: ${this.smPlayers[userId].value})`
      );
    }

    switch (action) {
      case EPlayerAction.TakeGems:
        this.takeGemsByPlayer(data);
        break;

      case EPlayerAction.BuyCard: {
        this.buyCardByPlayer(data);
        break;
      }

      case EPlayerAction.BuyHoldedCard: {
        this.buyHoldedCardByPlayer(data);
        break;
      }

      case EPlayerAction.HoldCardFromTable: {
        this.holdCardFromTableByPlayer(data);
        break;
      }

      case EPlayerAction.HoldCardFromDeck: {
        this.holdCardFromDeckByPlayer(data);
        break;
      }

      case EPlayerAction.ReturnGems: {
        this.returnGemsByPlayer(data);
        break;
      }

      case EPlayerAction.EndTurn: {
        this.endTurnByPlayer();
        break;
      }

      default:
        throw Error(`${action} is not implemented`);
    }

    return this;
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
        ).filter((action) => action !== EPlayerAction.TakeGemsOverLimit)
      : [];
  }

  public checkAndGetNobles = () => {
    const nobleToGetIndex = this.tableManager.table.nobles.findIndex((noble) =>
      Object.entries(noble.requirements).every(([color, value]) => {
        return (
          this.getActivePlayer().cardsBought[color as EGemColor].length >= value
        );
      })
    );

    if (~nobleToGetIndex) {
      const noble = this.tableManager.giveNoble(nobleToGetIndex);
      this.getActivePlayer().earnNoble(noble);
    }
  };

  private dispatchPlayerAction(
    action: EPlayerAction,
    data?: string,
    playerId?: string
  ) {
    const targetPlayerId = playerId || this.getActivePlayer().id;
    this.smPlayers[targetPlayerId].dispatchTransition(action, data);
  }

  public getGameResults = (): IGameResult => {
    const playersWithResults = this.players.map((player) => ({
      score: player.score,
      cardsBoughtCount: player.cardsBoughtCount,
      id: player.id,
    }));

    playersWithResults.sort(
      (a, b) => b.score - a.score || a.cardsBoughtCount - b.cardsBoughtCount
    );

    const maxScore = playersWithResults[0].score;

    const playersWithMaxScore = playersWithResults.filter(
      (player) => player.score === maxScore
    );
    if (playersWithMaxScore.length > 1) {
      const minBoughtCards = playersWithMaxScore[0].cardsBoughtCount;
      const playersWithMinCardsBought = playersWithMaxScore.filter(
        (player) => player.cardsBoughtCount === minBoughtCards
      );

      return playersWithMinCardsBought.length > 1
        ? { winner: null, players: playersWithResults, round: this.round }
        : {
            winner: playersWithMinCardsBought[0].id,
            players: playersWithResults,
            round: this.round,
          };
    }

    return {
      winner: playersWithMaxScore[0].id,
      players: playersWithResults,
      round: this.round,
    };
  };

  private takeGemsByPlayer(gems: TPlayerGems) {
    if (gems[EGemColor.Gold] > 0) {
      throw Error(`Cant take ${EGemColor.Gold} gems`);
    }

    const colors = Object.entries(gems) as [EGemColor, number][];

    // check limit of 3 diff color or 2 of the same color
    let gemsToTakeLimitRemaining = TAKE_GEM_LIMIT;

    for (const [color, value] of colors) {
      if (value > TAKE_GEM_LIMIT_SAME_COLOR) {
        throw Error(
          `${value} exceeds the limit ${TAKE_GEM_LIMIT_SAME_COLOR} of same color gems to take`
        );
      }
      if (
        value === TAKE_GEM_LIMIT_SAME_COLOR &&
        this.tableManager.table.gems[color] <
          SEVERAL_GEMS_TO_TAKE_IN_STOCK_LIMIT
      ) {
        throw Error(
          `Cant take ${value} ${color} gems because the stock is less than ${SEVERAL_GEMS_TO_TAKE_IN_STOCK_LIMIT}`
        );
      }

      // can take only 2 same color gems or 3 gems of different colors
      if (value === TAKE_GEM_LIMIT_SAME_COLOR) {
        if (gemsToTakeLimitRemaining < TAKE_GEM_LIMIT) {
          throw Error(`Cant take ${value} gems if any other gems are taken`);
        }
        gemsToTakeLimitRemaining = 0;
      } else {
        gemsToTakeLimitRemaining -= value;
      }

      if (gemsToTakeLimitRemaining < 0) {
        throw Error(`Cant take gems any more`);
      }
    }
    const playerId = this.getActivePlayer().id;
    this.giveGemsToPlayer(playerId, gems);

    const targetPlayer = this.getPlayer(playerId);
    this.dispatchPlayerAction(
      targetPlayer.gemsCount <= PLAYER_GEMS_MAX
        ? EPlayerAction.TakeGems
        : EPlayerAction.TakeGemsOverLimit
    );
  }

  private returnGemsByPlayer(gems: TPlayerGems) {
    const targetPlayer = this.getActivePlayer();
    Object.entries(gems).forEach(([color, count]) => {
      targetPlayer.spendGems(color as EGemColor, count);
      this.tableManager.addGems(color as EGemColor, count);
    });
    if (targetPlayer.gemsCount > PLAYER_GEMS_MAX) {
      this.dispatchPlayerAction(EPlayerAction.TakeGemsOverLimit);
    } else {
      this.dispatchPlayerAction(EPlayerAction.ReturnGems);
    }
  }

  private giveGemsToPlayer(playerId: string, gems: Partial<TPlayerGems>) {
    const targetPlayer = this.getPlayer(playerId);
    const colors = Object.entries(gems) as [EGemColor, number][];

    for (const [color, value] of colors) {
      const count = this.tableManager.removeGems(color, value);
      targetPlayer.getGems(color, count);
    }
  }

  private buyCardByPlayer(cardId: string): ICardShape {
    const targetPlayer = this.getActivePlayer();

    const [targetCard] = this.tableManager.findCardOnTable(cardId);

    const gemsToSpend = targetPlayer.buyCard(targetCard);

    Object.entries(gemsToSpend).forEach(([color, count]) => {
      this.tableManager.addGems(color as EGemColor, count);
    });

    const card = this.tableManager.giveCardFromTable(cardId);

    this.checkAndGetNobles();

    this.dispatchPlayerAction(EPlayerAction.BuyCard, cardId);

    return card;
  }

  private buyHoldedCardByPlayer(cardId: string): ICardShape {
    const targetPlayer = this.getActivePlayer();

    const targetCard = targetPlayer.cardsHolded.find(
      (card) => card.id === cardId
    );

    if (!targetCard) {
      throw Error(`Cant find a card with ID ${cardId} in holded cards`);
    }

    const gemsToSpend = targetPlayer.buyHoldedCard(targetCard);

    Object.entries(gemsToSpend).forEach(([color, count]) => {
      this.tableManager.addGems(color as EGemColor, count);
    });

    this.checkAndGetNobles();

    this.dispatchPlayerAction(EPlayerAction.BuyHoldedCard, cardId);

    return targetCard;
  }

  private holdCardFromTableByPlayer(cardId: string): ICardShape {
    const targetPlayer = this.getActivePlayer();

    if (targetPlayer.cardsHoldedCount >= PLAYER_CARDS_HOLDED_MAX) {
      throw Error(`Cant hold cards more than ${PLAYER_CARDS_HOLDED_MAX}`);
    }
    const card = this.tableManager.giveCardFromTable(cardId);
    targetPlayer.holdCard(card);

    // can hold a card even if no Gold gems available
    if (this.tableManager.table.gems[EGemColor.Gold] > 0) {
      this.giveGemsToPlayer(targetPlayer.id, {
        [EGemColor.Gold]: GOLD_GEMS_FOR_CARD_HOLD,
      });
    }

    this.dispatchPlayerAction(
      targetPlayer.gemsCount <= PLAYER_GEMS_MAX
        ? EPlayerAction.HoldCardFromTable
        : EPlayerAction.TakeGemsOverLimit
    );

    return card;
  }

  // TODO: move share logic between holdCard actions to one place
  private holdCardFromDeckByPlayer(lvl: EDeckLevel): ICardShape {
    const targetPlayer = this.getActivePlayer();

    if (targetPlayer.cardsHoldedCount >= PLAYER_CARDS_HOLDED_MAX) {
      throw Error(`Cant hold cards more than ${PLAYER_CARDS_HOLDED_MAX}`);
    }

    const card = this.tableManager.table[lvl].deck.getTop();

    if (!card) {
      throw Error(`No cards in deck ${lvl}`);
    }

    targetPlayer.holdCard(card);

    // can hold a card even if no Gold gems available
    if (this.tableManager.table.gems[EGemColor.Gold] > 0) {
      this.giveGemsToPlayer(targetPlayer.id, {
        [EGemColor.Gold]: GOLD_GEMS_FOR_CARD_HOLD,
      });
    }

    this.dispatchPlayerAction(
      targetPlayer.gemsCount <= PLAYER_GEMS_MAX
        ? EPlayerAction.HoldCardFromDeck
        : EPlayerAction.TakeGemsOverLimit
    );

    return card;
  }

  public endTurnByPlayer() {
    this.dispatchPlayerAction(EPlayerAction.EndTurn);
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
          checkWinConditions: this.checkWinConditions,
        })
      );

      acc[player.id] = playerStateMachine;

      return acc;
    }, {} as { [key: string]: IStateMachine<EPLayerState, EPlayerAction> });
  }

  private checkWinConditions = () => {
    // no need to check anymore if winConditions are met
    if (this.isLastRound) {
      return;
    }
    const playerIsEndingGame = this.players.find((player) => {
      return player.score >= SCORE_TO_END_GAME;
    });

    if (playerIsEndingGame) {
      this.isLastRound = true;
    }
  };

  private startTurnPlayerActionCreator = (playerId: string) => () => {
    this.dispatchPlayerAction(EPlayerAction.StartTurn, undefined, playerId);
  };

  private endTurnPlayerActionCreator = (playerId: string) => () => {
    this.dispatchPlayerAction(EPlayerAction.EndTurn, undefined, playerId);
  };
}
