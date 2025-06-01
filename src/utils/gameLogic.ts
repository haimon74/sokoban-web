import { GameState, Position, TileType } from '../types/game';

export const findPlayerPosition = (grid: TileType[][]): Position => {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === '👷' || grid[y][x] === '👷‍♂️') {
        return { x, y };
      }
    }
  }
  throw new Error('Player not found in grid');
};

export const isLevelComplete = (grid: TileType[][]): boolean => {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === '📦') {
        return false;
      }
    }
  }
  return true;
};

export const canMove = (
  grid: TileType[][],
  currentPos: Position,
  direction: 'up' | 'down' | 'left' | 'right'
): boolean => {
  const { x, y } = currentPos;
  let newX = x;
  let newY = y;

  switch (direction) {
    case 'up':
      newY = y - 1;
      break;
    case 'down':
      newY = y + 1;
      break;
    case 'left':
      newX = x - 1;
      break;
    case 'right':
      newX = x + 1;
      break;
  }

  // Check if new position is within bounds
  if (newY < 0 || newY >= grid.length || newX < 0 || newX >= grid[0].length) {
    return false;
  }

  const targetTile = grid[newY][newX];

  // Can't move through walls
  if (targetTile === '🧱') {
    return false;
  }

  // If target is a box, check if we can push it
  if (targetTile === '📦' || targetTile === '💰') {
    const boxNewX = newX + (newX - x);
    const boxNewY = newY + (newY - y);

    // Check if box's new position is within bounds
    if (boxNewY < 0 || boxNewY >= grid.length || boxNewX < 0 || boxNewX >= grid[0].length) {
      return false;
    }

    // Can't push box into wall or another box
    const boxTargetTile = grid[boxNewY][boxNewX];
    return boxTargetTile === '⬜️' || boxTargetTile === '🎯';
  }

  return true;
};

export const movePlayer = (
  gameState: GameState,
  direction: 'up' | 'down' | 'left' | 'right'
): GameState => {
  if (!canMove(gameState.grid, gameState.playerPosition, direction)) {
    return gameState;
  }

  const newGrid = gameState.grid.map(row => [...row]);
  const { x, y } = gameState.playerPosition;
  let newX = x;
  let newY = y;

  switch (direction) {
    case 'up':
      newY = y - 1;
      break;
    case 'down':
      newY = y + 1;
      break;
    case 'left':
      newX = x - 1;
      break;
    case 'right':
      newX = x + 1;
      break;
  }

  const targetTile = newGrid[newY][newX];
  const isPlayerOnGoal = newGrid[y][x] === '👷‍♂️';
  const isTargetGoal = targetTile === '🎯';
  const isTargetCrateOnGoal = targetTile === '💰';

  // Update player's old position
  newGrid[y][x] = isPlayerOnGoal ? '🎯' : '⬜️';

  // If target is a box or crate on goal, move it
  if (targetTile === '📦' || targetTile === '💰') {
    const boxNewX = newX + (newX - x);
    const boxNewY = newY + (newY - y);
    const isBoxTargetGoal = newGrid[boxNewY][boxNewX] === '🎯';
    newGrid[boxNewY][boxNewX] = isBoxTargetGoal ? '💰' : '📦';
    // If the player moves into a cell that was a crate on goal, player should be on goal
    newGrid[newY][newX] = isTargetCrateOnGoal ? '👷‍♂️' : '👷';
  } else if (isTargetGoal) {
    newGrid[newY][newX] = '👷‍♂️';
  } else {
    newGrid[newY][newX] = '👷';
  }

  return {
    ...gameState,
    grid: newGrid,
    playerPosition: { x: newX, y: newY },
    moves: gameState.moves + 1,
    isComplete: isLevelComplete(newGrid),
    history: [...gameState.history, gameState],
  };
};

export const resetLevel = (initialState: GameState): GameState => {
  return {
    ...initialState,
    moves: 0,
    isComplete: false,
    history: [],
  };
};

export const undoMove = (gameState: GameState): GameState => {
  if (gameState.history.length === 0) {
    return gameState;
  }

  const previousState = gameState.history[gameState.history.length - 1];
  return {
    ...previousState,
    history: gameState.history.slice(0, -1),
  };
}; 