import { EUserRole } from '../interfaces/user';
import { Api } from './api';
import { gameService } from './services/GameService';
import { userService } from './services/UserService';
import { connectionService } from './services/ConnectionService';
import { IGameConfig } from '../interfaces/game';

Api();

// const GAME_CONFIG: Partial<IGameConfig> = {
//   onGameEnd: (results) => {
//     debugger
//     console.log('____GAME ENDED____', results)
//   }
// }

// const user = userService.add('usr');

// connectionService.add(user.id, { readyState: 1, send: () => undefined });

// const room = gameService.createRoom('Testing room', user.id);

// gameService.joinRoomAsSpectator(room.id, user.id);

// const bot1 = gameService.addBot(room.id, user.id, "bot_one_id");
// const bot2 = gameService.addBot(room.id, user.id, "bot_two_id");
// const bot3 = gameService.addBot(room.id, user.id, "bot_three_id");
// const bot4 = gameService.addBot(room.id, user.id, "bot_four_id");
// // const bot5 = gameService.addBot(room.id, user.id, "bot_five_id");

// const game = gameService.startGame(room.id, user.id, GAME_CONFIG)

// console.log('game.players', game.players)

// game.players.forEach((player) => {
//   console.log(`Bot: ${player.name}, gems: ${player.gemsCount}, cards: ${player.cardsBoughtCount}, score: ${player.score}`)
// })
// console.log('round:', game.round);





