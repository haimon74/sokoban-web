import React, { useState, useEffect } from 'react';
import { Level } from './types/game';
import Game from './components/Game';

interface RawLevel {
  levelName: string;
  grid: string[];
}

const App: React.FC = () => {
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLevels = async () => {
      try {
        const response = await fetch('/levels.json');
        if (!response.ok) {
          throw new Error('Failed to load levels');
        }
        const text = await response.text();
        const rawLevels: RawLevel[] = JSON.parse(text);
        
        // Transform the raw levels into our expected format
        const transformedLevels: Level[] = rawLevels.map((level, index) => {
          return transformLevel(level);
        });

        setLevels(transformedLevels);
        setLoading(false);
      } catch (err) {
        console.error('Error loading levels:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    loadLevels();
  }, []);

  const transformLevel = (rawLevel: any): Level => {
    console.log('Original row example:', rawLevel.grid[0]);
    // Regex to match only the valid emoji clusters
    const emojiRegex = /(⬜️|🧱|👷|📦|🎯|💰)/gu;
    const transformed = {
      id: rawLevel.id,
      name: rawLevel.name,
      grid: rawLevel.grid
        .filter((row: string) => row.trim().length > 0)
        .map((row: string, idx: number) => {
          const matches = row.match(emojiRegex) || [];
          console.log(`Row ${idx} emoji matches:`, matches, '| Length:', matches.length);
          return matches;
        }),
    };
    console.log('Transformed grid shape:', transformed.grid.length, 'rows x', transformed.grid[0]?.length, 'columns');
    return transformed;
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h2>Loading levels...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
        <h2>Error: {error}</h2>
        <pre style={{ textAlign: 'left', margin: '20px auto', maxWidth: '600px' }}>
          {error}
        </pre>
      </div>
    );
  }

  if (levels.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h2>No levels found</h2>
      </div>
    );
  }

  return (
    <div className="App">
      <Game levels={levels} />
    </div>
  );
};

export default App;
