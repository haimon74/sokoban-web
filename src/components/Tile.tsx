import React from 'react';
import { TileType } from '../types/game';

interface TileProps {
  type: TileType;
}

const Tile: React.FC<TileProps> = ({ type }) => {
  const getTileStyle = (): React.CSSProperties => {
    if (type === '⬜️') {
      // For floor, render a fully transparent cell (no background, no emoji)
      return {
        width: '40px',
        height: '40px',
        background: 'none',
        boxShadow: 'none',
        margin: 0,
        padding: 0,
      };
    }
    let fontSize = 24;
    if (type === '🧱') fontSize = 32;
    if (type === '📦' || type === '💰') fontSize = 36;
    if (type === '🎯') fontSize = 18;
    if (type === '👷' || type === '👷‍♂️') fontSize = 36;
    const baseStyle: React.CSSProperties = {
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: fontSize,
      backgroundColor: 'whitesmoke',
      userSelect: 'none',
    };
    if (type === '🧱') {
      return {
        ...baseStyle,
        zIndex: 1,
      };
    }
    return baseStyle;
  };

  // For floor tiles, render an empty transparent cell
  if (type === '⬜️') {
    return <div style={getTileStyle()} />;
  }

  // For all other tiles, render the emoji
  return (
    <div style={getTileStyle()}>
      {type}
    </div>
  );
};

export default Tile; 