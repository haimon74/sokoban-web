import React from 'react';
import { TileType } from '../types/game';
import Tile from './Tile';

interface GameBoardProps {
  grid: TileType[][];
}

const GameBoard: React.FC<GameBoardProps> = ({ grid }) => {
  return (
    <div className="game-board" style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${grid[0].length}, 40px)`,
      backgroundColor: 'whitesmoke',
      border: '2px solid #666',
      padding: '0',
      width: 'fit-content',
      margin: '0 auto',
    }}>
      {grid.map((row, y) =>
        row.map((tile, x) => (
          <Tile key={`${x}-${y}`} type={tile} />
        ))
      )}
    </div>
  );
};

export default GameBoard; 