export type TileType = '🧱' | '👷' | '👷‍♂️' | '📦' | '🎯' | '💰' | '⬜️' | ' ';

export interface Position {
  x: number;
  y: number;
}

export interface GameState {
  level: number;
  grid: TileType[][];
  playerPosition: Position;
  moves: number;
  isComplete: boolean;
  history: GameState[];
}

export interface Level {
  id: number;
  name: string;
  grid: TileType[][];
}

export interface GameControls {
  onMove: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onReset: () => void;
  onUndo: () => void;
  onLevelSelect: (level: number) => void;
}

export interface GameProps {
  levels: Level[];
  currentLevel: number;
  onLevelComplete: () => void;
} 