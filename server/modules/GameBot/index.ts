import { v4 as uuidv4 } from 'uuid';
import { IGameStateDTO, IMessage } from '../../../interfaces/api';
import { ICardShape, TCardCost } from '../../../interfaces/card';
import { EDeckLevel } from '../../../interfaces/devDeck';
import { EGameBasicState, EPlayerAction } from '../../../interfaces/game';
import { TPlayerGems } from '../../../interfaces/player';
import { EUserRole, IUser } from '../../../interfaces/user';
import { getKeys, Nullable } from '../../../utils/typescript';
import { random } from '../../utils/math';
import {
  SEVERAL_GEMS_TO_TAKE_IN_STOCK_LIMIT,
  PLAYER_GEMS_MAX,
  TAKE_GEM_LIMIT,
  TAKE_GEM_LIMIT_SAME_COLOR,
  PLAYER_CARDS_HOLDED_MAX,
} from '../../../gameRules';
import { PlayerResources } from '../Player/PlayerResources';
import { EGemColor } from '../../../interfaces/gem';
import { canAffordToPayCost } from '../../../utils/cost';



const ROUNDS_LIMIT = 60;

export class GameBot extends PlayerResources implements IUser {
  id: string;
  name: string;
  role: Nullable<EUserRole>;

  gameId: string;
  state: Pick<IGameStateDTO, 'availableActions' | 'isPlayerActive'> & {
    isGameEnded: boolean;
  };
  tableState: IGameStateDTO['table'];

  skippedTurns: number;

  desiredCard: Nullable<{ lvl: EDeckLevel; index: number; id: string }>;

  dispatch: (action: EPlayerAction, data?: unknown) => any;
  round: number;

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
    try {
      // console.log('GameBot updateGameState', state);
      if (!state.data) {
        throw Error(`Wrong contract in messaging with bot`);
      }

      this.state = {
        isGameEnded: state.data.currentState === EGameBasicState.GameEnded,
        availableActions: state.data.availableActions,
        isPlayerActive: state.data.isPlayerActive,
        // players: state.data.players,
      };
      this.gems = state.data.playerState!.gems;
      this.cardsBought = state.data.playerState!.cardsBought;
      this.cardsHolded = state.data.playerState!.cardsHolded;
      this.nobles = state.data.playerState!.nobles;
      this.round = state.data.round;

      // this.myState = state.data.playerState.;
      this.tableState = state.data.table;

      if (state.data.round >= ROUNDS_LIMIT) {
        throw Error(`Bot ${this.name} lost...`);
      }

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

  get needToReturnGems() {
    return this.state.availableActions.includes(EPlayerAction.ReturnGems);
  }

  private tryToAct() {
    if (this.state.isGameEnded || !this.canAct) {
      // console.log('Failed to act: isGameEnded',this.state.isGameEnded);

      return;
    }

    if (this.needToReturnGems) {
      let gemsToReturnCount = this.gemsCount - PLAYER_GEMS_MAX;
      const gemsToReturn = {};
      getKeys(this.gems).every((color) => {
        if (this.gems[color] > 0) {
          gemsToReturn[color] = 1;
          gemsToReturnCount -= 1;
        }

        if (gemsToReturnCount === 0) {
          return false;
        }

        return true;
      });

      this.dispatch(EPlayerAction.ReturnGems, gemsToReturn);
      return;
    }
    console.log(this.round);

    if (
      !this.desiredCard ||
      !this.tableState[this.desiredCard.lvl].cards[this.desiredCard.index] ||
      this.tableState[this.desiredCard.lvl].cards[this.desiredCard.index].id !==
      this.desiredCard.id
    ) {
      // const isRich = false;
      // const isSuperRich = false;
      // const isRich = this.cardsBoughtCount > 12;
      // const isSuperRich = this.cardsBoughtCount > 16
      const isRich = this.cardsBoughtCount > 12;
      const isSuperRich = true;
      this.desiredCard = this.chooseDesiredCard(
        isSuperRich
          ? EDeckLevel.Third
          : isRich
            ? EDeckLevel.Second
            : EDeckLevel.First
      );
    }

    if (this.canOnlyEndTurn) {
      this.dispatch(EPlayerAction.EndTurn);
      return;
    }

    const [affordableHoldedCards, cardsAffordable] = this.findAffordableCards();

    if (affordableHoldedCards.length > 0) {
      this.dispatch(EPlayerAction.BuyHoldedCard, affordableHoldedCards[0].id);
      return;
    }

    if (cardsAffordable.length > 0) {
      this.dispatch(EPlayerAction.BuyCard, cardsAffordable[0].id);

      if (cardsAffordable[0].id === this.desiredCard.id) {
        this.desiredCard = null;
      }
      return;
    }

    if (this.canTakeGems) {
      if (this.gemsCount < PLAYER_GEMS_MAX) {
        if (this.gemsCount === PLAYER_GEMS_MAX - 1) {
          if (this.cardsHoldedCount < PLAYER_CARDS_HOLDED_MAX) {
            this.dispatch(EPlayerAction.HoldCardFromDeck, EDeckLevel.Second);
            return;
          }
        }

        let colorsToPick: TCardCost = this.chooseGemColorToTake();

        if (
          Object.values(colorsToPick).reduce(
            (acc, value) => (acc += value),
            0
          ) === 0
        ) {
          this.desiredCard = this.chooseDesiredCard(EDeckLevel.First);
          colorsToPick = this.chooseGemColorToTake();
        }

        this.dispatch(EPlayerAction.TakeGems, colorsToPick);
        return;
      }
    }

    console.log('DO NOTHING, SKIPPING MY TURN');
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
    if (this.round > 50) {
      // debugger
    }
    // console.log('colorsToPick',colorsToPick);

    return colorsToPick;
  }

  private chooseDesiredCard(lvl: EDeckLevel) {
    if (this.tableState[lvl].cards.length === 0) {
      lvl = EDeckLevel.Second;
    }
    const index = random(0, this.tableState[lvl].cards.length - 1);

    const card = this.tableState[lvl].cards[index];
    if (!card) {
      debugger;
    }

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

    const affordableHoldedCards: ICardShape[] = [];

    for (const card of this.cardsHolded) {
      if (canAffordToPayCost(card.cost, this.getAllGemsAvailable)) {
        affordableHoldedCards.push(card);
      }
    }

    // small hack)
    return [affordableHoldedCards, affordableCards.reverse()];
  }
}
