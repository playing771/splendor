import { Game } from "."

describe('Game functionality', () => {

  it('', () => {
    const game = new Game();
    game.turns.transition('next')
    console.log(game.turns);
    
  })
})