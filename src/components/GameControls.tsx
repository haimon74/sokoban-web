import React, { useRef, ReactNode } from 'react';

interface GameControlsProps {
  onMove: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onReset: () => void;
  onUndo: () => void;
  children?: ReactNode;
}

const GameControls: React.FC<GameControlsProps> = ({
  onMove,
  onReset,
  onUndo,
  children,
}) => {
  // Keyboard support
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          onMove('up');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          onMove('down');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          onMove('left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          onMove('right');
          break;
        case ' ':
          event.preventDefault(); // Prevent scrolling
          onReset();
          break;
        case 'z':
        case 'Z':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            onUndo();
          }
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onMove, onReset, onUndo]);

  // Touch/Swipe support
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  React.useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStart.current = { x: touch.clientX, y: touch.clientY };
    };
    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart.current) return;
      const touch = e.changedTouches[0];
      const dx = touch.clientX - touchStart.current.x;
      const dy = touch.clientY - touchStart.current.y;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 30) onMove('right');
        else if (dx < -30) onMove('left');
      } else {
        if (dy > 30) onMove('down');
        else if (dy < -30) onMove('up');
      }
      touchStart.current = null;
    };
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onMove]);

  const buttonStyle: React.CSSProperties = {
    padding: '8px 16px',
    margin: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
  };

  return (
    <div className="game-controls" style={{ marginTop: '20px', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <button style={buttonStyle} onClick={onReset}>Reset</button>
        <button style={buttonStyle} onClick={onUndo}>Undo</button>
        {children && <span style={{ marginLeft: 8 }}>{children}</span>}
      </div>
    </div>
  );
};

export default GameControls; 