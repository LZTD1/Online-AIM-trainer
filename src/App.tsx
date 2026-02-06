import { useCallback } from 'react';
import { useGameEngine } from './hooks/useGameEngine';
import { useAudioEngine } from './hooks/useAudioEngine';
import { MenuScreen } from './components/MenuScreen';
import { GameArena } from './components/GameArena';
import { ResultsScreen } from './components/ResultsScreen';
import type { GameSettings } from './types';

export function App() {
  const {
    gameState,
    targets,
    stats,
    timeLeft,
    settings,
    mousePath,
    pathStart,
    startGame,
    handleTargetHit,
    handleMiss,
    handleMouseMove,
    resetToMenu,
    endGame,
  } = useGameEngine();

  const { playStart } = useAudioEngine();

  const handleStart = useCallback((newSettings: GameSettings) => {
    playStart();
    startGame(newSettings);
  }, [playStart, startGame]);

  const handleRestart = useCallback(() => {
    playStart();
    startGame(settings);
  }, [playStart, startGame, settings]);

  if (gameState === 'menu') {
    return <MenuScreen onStart={handleStart} />;
  }

  if (gameState === 'results') {
    return (
      <ResultsScreen
        stats={stats}
        settings={settings}
        onRestart={handleRestart}
        onMenu={resetToMenu}
      />
    );
  }

  return (
    <GameArena
      targets={targets}
      stats={stats}
      timeLeft={timeLeft}
      settings={settings}
      mousePath={mousePath}
      pathStart={pathStart}
      onTargetHit={handleTargetHit}
      onMiss={handleMiss}
      onMouseMove={handleMouseMove}
      onEnd={endGame}
    />
  );
}
