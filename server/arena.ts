import { EDeckLevel } from '../interfaces/devDeck';
import { IGameConfig } from '../interfaces/game';
import { connectionService } from './services/ConnectionService';
import { gameService } from './services/GameService';
import { userService } from './services/UserService';

// let _game;

export const arena = () => {
  const GAME_CONFIG: Partial<IGameConfig> = {
    onGameEnd: (results) => {
      console.log('____GAME ENDED____', results);
      // _game.players.forEach((player) => {
      //   const allCards = Object.values(player.cardsBought).flat();
      //   console.log(player.name);
      //   console.log(
      //     'Lvl 1:',
      //     allCards.filter((c) => c.lvl === EDeckLevel.First).length
      //   );
      //   console.log(
      //     'Lvl 2:',
      //     allCards.filter((c) => c.lvl === EDeckLevel.Second).length
      //   );
      //   console.log(
      //     'Lvl 3:',
      //     allCards.filter((c) => c.lvl === EDeckLevel.Third).length
      //   );
      // });

      // _game.players.forEach((player) => {
      //   console.log(
      //     `Bot: ${player.name}, gems: ${player.gemsCount}, cards: ${player.cardsBoughtCount}, score: ${player.score}, holded: ${player.cardsHoldedCount}`
      //   );
      // });
      // console.log('round:', _game.round);
    },
  };

  const user = userService.add('usr');

  connectionService.add(user.id, { readyState: 1, send: () => undefined });

  const room = gameService.createRoom('Testing room', user.id);

  gameService.joinRoomAsSpectator(room.id, user.id);

  const bot1 = gameService.addBot(room.id, user.id, 'bot_one_id');
  const bot2 = gameService.addBot(room.id, user.id, 'bot_two_id');
  const bot3 = gameService.addBot(room.id, user.id, 'bot_three_id');
  const bot4 = gameService.addBot(room.id, user.id, "bot_four_id");

  const game = gameService.startGame(room.id, user.id, GAME_CONFIG);

  game.players.forEach((player) => {
    const allCards = Object.values(player.cardsBought).flat();
    console.log(player.name);
    console.log(
      'Lvl 1:',
      allCards.filter((c) => c.lvl === EDeckLevel.First).length
    );
    console.log(
      'Lvl 2:',
      allCards.filter((c) => c.lvl === EDeckLevel.Second).length
    );
    console.log(
      'Lvl 3:',
      allCards.filter((c) => c.lvl === EDeckLevel.Third).length
    );
  });

  game.players.forEach((player) => {
    console.log(
      `Bot: ${player.name}, gems: ${player.gemsCount}, cards: ${player.cardsBoughtCount}, score: ${player.score}, holded: ${player.cardsHoldedCount}`
    );
  });
  console.log('round:', game.round);
};
