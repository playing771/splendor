import { v4 as uuidv4 } from 'uuid';
import { IGameStateDTO, IMessage } from '../../../interfaces/api';
import { ICardShape, TCardCost } from '../../../interfaces/card';
import { EDeckLevel } from '../../../interfaces/devDeck';
import { EPlayerAction } from '../../../interfaces/game';
import { TPlayerGems } from '../../../interfaces/player';
import { EUserRole, IUser } from '../../../interfaces/user';
import { Nullable } from '../../../utils/typescript';
import { random } from '../../utils/math';
import {
  SEVERAL_GEMS_TO_TAKE_IN_STOCK_LIMIT,
  PLAYER_GEMS_MAX,
  TAKE_GEM_LIMIT,
  TAKE_GEM_LIMIT_SAME_COLOR,
} from '../../../gameRules';
import { PlayerResources } from '../Player/PlayerResources';

const canAffordToPayCost = (cost: TCardCost, gems: TPlayerGems) => {
  const canAfford = Object.keys(cost).every(
    (color) => cost[color] <= gems[color]
  );
  return canAfford;
};

const MAX_TURNS_TO_SKIP = 5;

export class GameBot extends PlayerResources implements IUser {
  id: string;
  name: string;
  role: Nullable<EUserRole>;

  gameId: string;
  state: Pick<IGameStateDTO, 'availableActions' | 'isPlayerActive'>;
  tableState: IGameStateDTO['table'];

  // gemsRated: Record<EGemColorPickable, number>

  skippedTurns: number;

  desiredCard: Nullable<{ lvl: EDeckLevel; index: number; id: string }>;

  dispatch: (action: EPlayerAction, data?: unknown) => any;

  constructor(
    name: string,
    gameServiceDispatch: (
      gameId: string,
      action: EPlayerAction,
      userId: string,
      data?: unknown
    ) => any,
    id?: string
  ) {
    super({
      cardsBought: {},
      cardsHolded: [],
      nobles: [],
      gems: {} as TPlayerGems,
    });

    this.id = id || uuidv4();
    this.name = name;
    this.role = EUserRole.Player;

    this.skippedTurns = 0;

    this.desiredCard = null;

    this.dispatch = (action: EPlayerAction, data?: unknown) => {
      globalThis.setTimeout(() => {
        gameServiceDispatch(this.gameId, action, this.id, data);
      });
      // gameServiceDispatch(this.gameId, action, this.id, data)
    };
    this.updateGameState = this.updateGameState.bind(this);
  }

  public updateGameState(state: IMessage<IGameStateDTO>) {
    console.log('updateGameState', state.data?.availableActions);

    try {
      // console.log('GameBot updateGameState', state);
      if (!state.data) {
        throw Error(`Wrong contract in messaging with bot`);
      }
      this.state = {
        availableActions: state.data.availableActions,
        isPlayerActive: state.data.isPlayerActive,
        // players: state.data.players,
      };
      this.gems = state.data.playerState!.gems;
      this.cardsBought = state.data.playerState!.cardsBought;
      this.cardsHolded = state.data.playerState!.cardsHolded;
      this.nobles = state.data.playerState!.nobles;

      // this.myState = state.data.playerState.;
      this.tableState = state.data.table;

      this.tryToAct();
    } catch (error) {
      console.log('BOT ERROR:', error);
    }
  }

  public attachToGame(gameId: string) {
    this.gameId = gameId;
  }

  get canAct() {
    return this.state.isPlayerActive;
  }

  get canTakeGems() {
    return this.state.availableActions.includes(EPlayerAction.TakeGems);
  }

  get canOnlyEndTurn() {
    return (
      this.state.availableActions.length === 1 &&
      this.state.availableActions.includes(EPlayerAction.EndTurn)
    );
  }

  private tryToAct() {
    if (!this.canAct) {
      return;
    }

    if (
      !this.desiredCard ||
      this.tableState[this.desiredCard.lvl].cards[this.desiredCard.index].id !==
      this.desiredCard.id
    ) {
      this.desiredCard = this.chooseDesiredCard(EDeckLevel.First);
    }

    if (this.canOnlyEndTurn) {
      this.dispatch(EPlayerAction.EndTurn);
      return;
    }

    const cardsAffordable = this.findAffordableCards();

    if (cardsAffordable.length > 0) {
      this.dispatch(EPlayerAction.BuyCard, cardsAffordable[0].id);

      if (cardsAffordable[0].id === this.desiredCard.id) {
        this.desiredCard = null;
      }
      return;
    }

    if (this.canTakeGems) {
      if (this.gemsCount < PLAYER_GEMS_MAX) {
        const colorsToPick: TCardCost = this.chooseGemColorToTake();
        console.log('colorsToPick', colorsToPick);

        this.dispatch(EPlayerAction.TakeGems, colorsToPick);
        return;
      }
    }

    if (this.skippedTurns >= MAX_TURNS_TO_SKIP) {
      throw Error(`Bot ${this.name} lost...`);
    }

    console.log('DO NOTHING, SKIPPING MY TURN');
    this.skippedTurns += 1;
    this.dispatch(EPlayerAction.EndTurn);
  }

  // private findColorsAvailableOnTable() {
  //   const colorsAvailableOnTable = getKeys(EGemColorPickable).reduce((acc, color) => {
  //     if (this.tableState.gems[color] >= 4) {
  //       acc[color] = 2;
  //       return acc;
  //     };

  //     if (this.tableState.gems[color] > 1) {
  //       acc[color] = 1;
  //       return acc;
  //     }

  //     acc[color] = 0;
  //     return acc
  //   }, {} as TCardCost);

  //   return colorsAvailableOnTable;
  // }

  private chooseGemColorToTake() {
    // console.log(this.gemsRated);
    if (!this.desiredCard) {
      throw Error('Cant choose a gem: no desired card');
    }
    const { id, index, lvl } = this.desiredCard;
    const { cost } = this.tableState[lvl].cards[index];

    const colorsToPick: TCardCost = {};
    let colorsPickedCount = 0;

    const colors = Object.keys(cost);
    for (const color of colors) {
      if (colorsPickedCount === TAKE_GEM_LIMIT) {
        break;
      }
      const needInColor = Math.max(
        cost[color] - this.getAllGemsAvailable[color],
        0
      );

      const needInColorMinusTakeLimit = Math.min(
        needInColor,
        TAKE_GEM_LIMIT_SAME_COLOR
      );
      const needInColorMinusTakeLimitMinusTableStock = Math.min(
        needInColorMinusTakeLimit,
        this.tableState.gems[color]
      );

      if (needInColorMinusTakeLimitMinusTableStock === 0) {
        colorsToPick[color] = 0;
      } else if (
        needInColorMinusTakeLimitMinusTableStock === 2 &&
        colorsPickedCount === 0 &&
        this.tableState.gems[color] >= SEVERAL_GEMS_TO_TAKE_IN_STOCK_LIMIT
      ) {
        colorsToPick[color] = needInColorMinusTakeLimitMinusTableStock;
        break;
      } else {
        colorsToPick[color] = 1;
        colorsPickedCount += 1;
      }
    }

    return colorsToPick;
  }

  private chooseDesiredCard(lvl: EDeckLevel) {
    const index = random(0, this.tableState[lvl].cards.length - 1);
    const card = this.tableState.First.cards[index];

    return { id: card.id, index, lvl };
  }

  private findAffordableCards() {
    const allCards = Object.values(EDeckLevel).reduce(
      (arr, lvl) => arr.concat(this.tableState[lvl].cards),
      [] as ICardShape[]
    );

    const affordableCards: ICardShape[] = [];
    // loop over all cards
    for (const card of allCards) {
      if (canAffordToPayCost(card.cost, this.getAllGemsAvailable)) {
        affordableCards.push(card);
      }
    }

    // small hack)
    return affordableCards.reverse();
  }
}
