import { useCallback, useRef, useState } from 'react';
import type { GameSettings, GameState, GameStats, ShotRecord, Target } from '../types';

let idCounter = 0;
const genId = () => `target-${++idCounter}`;

const STATS_PANEL_W = 280;
const STATS_PANEL_H = 160;
const MARGIN = 20;

function createTarget(settings: GameSettings, windowW: number, windowH: number): Target {
  const size = settings.mode === 'precision' ? settings.targetSize * 1.3 : settings.targetSize;
  let x: number, y: number;
  let tries = 0;
  do {
    x = MARGIN + Math.random() * (windowW - size - MARGIN * 2);
    y = MARGIN + Math.random() * (windowH - size - MARGIN * 2);
    tries++;
  } while (tries < 50 && x < STATS_PANEL_W + 20 && y < STATS_PANEL_H + 20);

  return {
    id: genId(),
    x,
    y,
    size,
    createdAt: performance.now(),
    shrinking: settings.shrinkTargets || settings.mode === 'precision',
    shrinkDuration: settings.mode === 'precision' ? 2500 : settings.mode === 'tracking' ? 1500 : 3000,
  };
}

export function useGameEngine() {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [targets, setTargets] = useState<Target[]>([]);
  const [stats, setStats] = useState<GameStats>({
    shots: [],
    totalClicks: 0,
    hits: 0,
    misses: 0,
    score: 0,
    startTime: null,
    endTime: null,
  });
  const [timeLeft, setTimeLeft] = useState(0);
  const [settings, setSettings] = useState<GameSettings>({
    mode: 'classic',
    targetCount: 1,
    targetSize: 80,
    duration: 30,
    shrinkTargets: false,
  });
  const [mousePath, setMousePath] = useState<[number, number][]>([]);
  const [pathStart, setPathStart] = useState<[number, number] | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const targetTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastHitTimeRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (targetTimerRef.current) clearInterval(targetTimerRef.current);
    timerRef.current = null;
    targetTimerRef.current = null;
  }, []);

  const endGame = useCallback(() => {
    clearTimers();
    setStats(prev => ({ ...prev, endTime: performance.now() }));
    setGameState('results');
    setTargets([]);
    setMousePath([]);
    setPathStart(null);
  }, [clearTimers]);

  const startGame = useCallback((newSettings: GameSettings) => {
    setSettings(newSettings);
    idCounter = 0;
    lastHitTimeRef.current = null;

    const initialStats: GameStats = {
      shots: [],
      totalClicks: 0,
      hits: 0,
      misses: 0,
      score: 0,
      startTime: performance.now(),
      endTime: null,
    };
    setStats(initialStats);
    setTimeLeft(newSettings.duration);
    setMousePath([]);
    setPathStart(null);

    // Create initial targets
    const w = window.innerWidth;
    const h = window.innerHeight;
    const count = newSettings.mode === 'speed' ? newSettings.targetCount : 1;
    const initialTargets: Target[] = [];
    for (let i = 0; i < count; i++) {
      initialTargets.push(createTarget(newSettings, w, h));
    }
    setTargets(initialTargets);
    setGameState('playing');

    // Countdown timer
    const endTime = Date.now() + newSettings.duration * 1000;
    timerRef.current = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        endGame();
      }
    }, 100);

    // For tracking mode, cycle targets
    if (newSettings.mode === 'tracking') {
      targetTimerRef.current = setInterval(() => {
        setTargets(prev => {
          const now = performance.now();
          const filtered = prev.filter(t => now - t.createdAt < (t.shrinkDuration || 1500));
          if (filtered.length < 1) {
            filtered.push(createTarget(newSettings, window.innerWidth, window.innerHeight));
          }
          return filtered;
        });
      }, 200);
    }
  }, [endGame]);

  const handleTargetHit = useCallback((targetId: string, zone: number, clickX: number, clickY: number) => {
    const now = performance.now();
    const reactionTime = lastHitTimeRef.current ? now - lastHitTimeRef.current : 0;
    lastHitTimeRef.current = now;

    const scoreMap = [0, 1, 2, 5];
    const score = scoreMap[zone] || 0;

    // Calculate linearity from mouse path
    let linearity = 100;
    if (mousePath.length > 2 && pathStart) {
      const [sx, sy] = pathStart;
      const [ex, ey] = mousePath[mousePath.length - 1];
      const straight = Math.sqrt((ex - sx) ** 2 + (ey - sy) ** 2);
      let total = 0;
      for (let i = 1; i < mousePath.length; i++) {
        const [x1, y1] = mousePath[i - 1];
        const [x2, y2] = mousePath[i];
        total += Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      }
      linearity = total > 0 ? (straight / total) * 100 : 100;
    }

    const shot: ShotRecord = {
      timestamp: now,
      reactionTime,
      zone,
      score,
      linearity,
      targetId,
    };

    setStats(prev => ({
      ...prev,
      shots: [...prev.shots, shot],
      totalClicks: prev.totalClicks + 1,
      hits: prev.hits + 1,
      score: prev.score + score,
    }));

    // Start tracking new path from hit point
    setPathStart([clickX, clickY]);
    setMousePath([[clickX, clickY]]);

    // Replace target
    setTargets(prev => {
      const filtered = prev.filter(t => t.id !== targetId);
      const w = window.innerWidth;
      const h = window.innerHeight;
      // Add new target(s) based on mode
      const needed = settings.mode === 'speed' ? settings.targetCount : 1;
      while (filtered.length < needed) {
        filtered.push(createTarget(settings, w, h));
      }
      return filtered;
    });
  }, [mousePath, pathStart, settings]);

  const handleMiss = useCallback(() => {
    setStats(prev => ({
      ...prev,
      totalClicks: prev.totalClicks + 1,
      misses: prev.misses + 1,
    }));
  }, []);

  const handleMouseMove = useCallback((x: number, y: number) => {
    if (gameState !== 'playing') return;
    setMousePath(prev => {
      if (prev.length > 500) return [...prev.slice(-400), [x, y] as [number, number]];
      return [...prev, [x, y] as [number, number]];
    });
  }, [gameState]);

  const resetToMenu = useCallback(() => {
    clearTimers();
    setGameState('menu');
    setTargets([]);
    setMousePath([]);
    setPathStart(null);
    setStats({
      shots: [],
      totalClicks: 0,
      hits: 0,
      misses: 0,
      score: 0,
      startTime: null,
      endTime: null,
    });
  }, [clearTimers]);

  return {
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
  };
}
