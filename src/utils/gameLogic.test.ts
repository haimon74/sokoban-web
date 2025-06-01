import { movePlayer, findPlayerPosition, canMove } from './gameLogic';
import { GameState, TileType } from '../types/game';

const emojiRegex = /(⬜️|🧱|👷|👷‍♂️|📦|🎯|💰)/gu;
function row(str: string): TileType[] {
  return (str.match(emojiRegex) || []) as TileType[];
}

// Updated test level:
// 🧱🧱🧱🧱
// 🧱👷📦🎯
// 🧱⬜️⬜️⬜️
// 🧱🧱🧱🧱
const simpleLevel: TileType[][] = [
  row('🧱🧱🧱🧱'),
  row('🧱👷📦🎯'),
  row('🧱⬜️⬜️⬜️'),
  row('🧱🧱🧱🧱'),
];

function makeState(grid: TileType[][]): GameState {
  return {
    level: 1,
    grid,
    playerPosition: findPlayerPosition(grid),
    moves: 0,
    isComplete: false,
    history: [],
  };
}

describe('Sokoban game logic', () => {
  it('finds the player position', () => {
    const pos = findPlayerPosition(simpleLevel);
    expect(pos).toEqual({ x: 1, y: 1 });
  });

  it('can move player right', () => {
    const state = makeState(simpleLevel);
    expect(canMove(state.grid, state.playerPosition, 'right')).toBe(true);
  });

  it('cannot move player left into wall', () => {
    const state = makeState(simpleLevel);
    expect(canMove(state.grid, state.playerPosition, 'left')).toBe(false);
  });

  it('moves player onto crate and pushes it', () => {
    const state = makeState(simpleLevel);
    const newState = movePlayer(state, 'right');
    expect(newState.grid[1][2]).toBe('👷'); // Player moved to crate's old position
    expect(newState.grid[1][3]).toBe('💰'); // Crate moved to goal (crate on goal)
    expect(newState.grid[1][1]).toBe('⬜️'); // Player's old position is now floor
  });

  it('pushes crate onto goal and becomes crate on goal', () => {
    // Move player right to push crate onto goal
    let state = makeState(simpleLevel);
    state = movePlayer(state, 'right');
    state = movePlayer(state, 'right');
    expect(state.grid[1][3]).toBe('💰'); // Crate on goal
    expect(state.grid[1][2]).toBe('👷'); // Player on old crate position
  });

  it('player on goal state is set correctly', () => {
    // Place player on goal
    const grid: TileType[][] = [
      row('🧱🧱🧱'),
      row('🧱🎯🧱'),
      row('🧱👷🧱'),
      row('🧱🧱🧱'),
    ];
    let state = makeState(grid);
    state = movePlayer(state, 'up');
    expect(state.grid[1][1]).toBe('👷‍♂️');
    expect(state.grid[2][1]).toBe('⬜️');
  });
}); 