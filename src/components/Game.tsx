import React, { useState, useEffect, useRef } from 'react';
import { GameState, Level, TileType } from '../types/game';
import { movePlayer, resetLevel, undoMove, findPlayerPosition } from '../utils/gameLogic';
import GameBoard from './GameBoard';
import GameControls from './GameControls';

interface GameProps {
  levels: Level[];
  currentLevel?: number;
  onLevelComplete?: () => void;
}

const Game: React.FC<GameProps> = ({ levels }) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gameState, setGameState] = useState<GameState>(() => {
    const level = levels[0];
    return {
      level: 1,
      grid: level.grid,
      playerPosition: findPlayerPosition(level.grid),
      moves: 0,
      isComplete: false,
      history: [],
    };
  });

  // Audio refs
  const whooshRef = useRef<HTMLAudioElement | null>(null);
  const coinRef = useRef<HTMLAudioElement | null>(null);
  const moneyRef = useRef<HTMLAudioElement | null>(null);

  // Play sound helpers
  const playWhoosh = () => { 
    if (whooshRef.current != null) {
      whooshRef.current.currentTime = 0.3;
      whooshRef.current.volume = 0.5;
      whooshRef.current.play();
    } 
  };
  const playCoin = () => { coinRef.current && coinRef.current.play(); };
  const playMoney = () => { moneyRef.current && moneyRef.current.play(); };

  // Update game state when level changes
  useEffect(() => {
    const level = levels[currentLevel - 1];
    setGameState({
      level: currentLevel,
      grid: level.grid,
      playerPosition: findPlayerPosition(level.grid),
      moves: 0,
      isComplete: false,
      history: [],
    });
  }, [currentLevel, levels]);

  // Detect crate movement, crate on goal, and level completion for sounds
  const prevGameState = useRef<GameState | null>(null);
  useEffect(() => {
    if (!prevGameState.current) {
      prevGameState.current = gameState;
      return;
    }
    const prev = prevGameState.current;
    const curr = gameState;
    // Detect crate movement (whoosh): if any 📦 or 💰 moved
    let crateMoved = false;
    let crateOnGoal = false;
    for (let y = 0; y < curr.grid.length; y++) {
      for (let x = 0; x < curr.grid[y].length; x++) {
        const prevTile = prev.grid[y]?.[x];
        const currTile = curr.grid[y][x];
        // Crate moved if 📦 or 💰 appears where it wasn't before, or disappears
        if ((currTile === '📦' || currTile === '💰') && prevTile !== currTile) {
          crateMoved = true;
        }
        // Crate on goal if 💰 appears where it wasn't before
        if (currTile === '💰' && prevTile !== '💰') {
          crateOnGoal = true;
        }
      }
    }
    if (crateMoved) playWhoosh();
    if (crateOnGoal) playCoin();
    if (!prev.isComplete && curr.isComplete) playMoney();
    prevGameState.current = curr;
  }, [gameState]);

  const handleMove = (direction: 'up' | 'down' | 'left' | 'right') => {
    setGameState(prevState => movePlayer(prevState, direction));
  };

  const handleReset = () => {
    const level = levels[currentLevel - 1];
    setGameState(resetLevel({
      level: currentLevel,
      grid: level.grid,
      playerPosition: findPlayerPosition(level.grid),
      moves: 0,
      isComplete: false,
      history: [],
    }));
  };

  const handleUndo = () => {
    setGameState(prevState => undoMove(prevState));
  };

  const handleNextLevel = () => {
    if (currentLevel < levels.length) {
      setCurrentLevel(currentLevel + 1);
    }
  };

  return (
    <div className="game">
      {/* Audio elements */}
      <audio ref={whooshRef} src="/whoosh.mp3" preload="auto" />
      <audio ref={coinRef} src="/coin.mp3" preload="auto" />
      <audio ref={moneyRef} src="/money.mp3" preload="auto" />
      <div className="game-info">
        <h2>Level {gameState.level}: {levels[gameState.level - 1].name}</h2>
        <p>Moves: {gameState.moves}</p>
        {gameState.isComplete && (
          <div className="level-complete">
            <h3>Level Complete! 🎉</h3>
          </div>
        )}
      </div>
      <GameBoard grid={gameState.grid} />
      <GameControls
        onMove={handleMove}
        onReset={handleReset}
        onUndo={handleUndo}
      >
        {gameState.isComplete && currentLevel < levels.length && (
          <button
            style={{
              padding: '8px 16px',
              fontSize: '16px',
              cursor: 'pointer',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              marginLeft: '8px',
            }}
            onClick={handleNextLevel}
          >
            Next Level &gt;
          </button>
        )}
      </GameControls>
    </div>
  );
};

export default Game; 