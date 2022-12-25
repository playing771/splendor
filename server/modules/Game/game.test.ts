import { Game } from "."
import { EGameBasicState } from "./createGameSMDefinition";
import { EPLayerState } from "./createPlayerSMDefinition";

const PLAYERS: Array<{ id: string; name: string }> = [
  {
    id: 'player_1',
    name: 'Maxim',
  },
  {
    id: 'player_2',
    name: 'Evgenii',
  },
];

describe('Game functionality', () => {

  it('can change game state', () => {
    const game = new Game(PLAYERS);
    
    expect(game.sm.value).toBe(EGameBasicState.RoundStarted)

    game.sm.dispatchTransition('next');
    expect(game.sm.value).toBe(PLAYERS[0].id)
    
    game.sm.dispatchTransition('next');
    expect(game.sm.value).toBe(PLAYERS[1].id)

    game.sm.dispatchTransition('next');
    expect(game.sm.value).toBe(EGameBasicState.RoundStarted)

    game.sm.dispatchTransition('next');
    expect(game.sm.value).toBe(PLAYERS[0].id)
  })

  it('can change active players state', () => {
    const game = new Game(PLAYERS);
    
    expect(game.smPlayers[PLAYERS[0].id].value).toBe(EPLayerState.Idle);
    expect(game.smPlayers[PLAYERS[1].id].value).toBe(EPLayerState.Idle);

    game.sm.dispatchTransition('next');
    expect(game.smPlayers[PLAYERS[0].id].value).toBe(EPLayerState.Active);
    expect(game.smPlayers[PLAYERS[1].id].value).toBe(EPLayerState.Idle);
    
    game.sm.dispatchTransition('next');
    expect(game.smPlayers[PLAYERS[0].id].value).toBe(EPLayerState.Idle);
    expect(game.smPlayers[PLAYERS[1].id].value).toBe(EPLayerState.Active);

    game.sm.dispatchTransition('next');
    expect(game.smPlayers[PLAYERS[0].id].value).toBe(EPLayerState.Idle);
    expect(game.smPlayers[PLAYERS[1].id].value).toBe(EPLayerState.Idle);

    game.sm.dispatchTransition('next');
    expect(game.smPlayers[PLAYERS[0].id].value).toBe(EPLayerState.Active);
    expect(game.smPlayers[PLAYERS[1].id].value).toBe(EPLayerState.Idle);
  })
})