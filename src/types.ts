export type GameMode = 'classic' | 'speed' | 'precision' | 'tracking';

export interface Target {
  id: string;
  x: number;
  y: number;
  size: number;
  createdAt: number;
  shrinking?: boolean;
  shrinkDuration?: number;
}

export interface ShotRecord {
  timestamp: number;
  reactionTime: number;
  zone: number; // 0 = miss, 1 = outer, 2 = middle, 3 = inner
  score: number;
  linearity: number;
  targetId: string;
}

export interface GameSettings {
  mode: GameMode;
  targetCount: number; // simultaneous targets
  targetSize: number; // base size in px
  duration: number; // game duration in seconds
  shrinkTargets: boolean;
}

export interface GameStats {
  shots: ShotRecord[];
  totalClicks: number;
  hits: number;
  misses: number;
  score: number;
  startTime: number | null;
  endTime: number | null;
}

export type GameState = 'menu' | 'playing' | 'results';

export const DEFAULT_SETTINGS: GameSettings = {
  mode: 'classic',
  targetCount: 1,
  targetSize: 80,
  duration: 30,
  shrinkTargets: false,
};

export const MODE_INFO: Record<GameMode, { name: string; description: string; icon: string }> = {
  classic: {
    name: 'Classic',
    description: 'One target at a time. Click as fast and accurately as you can.',
    icon: '🎯',
  },
  speed: {
    name: 'Speed',
    description: 'Multiple targets appear. Destroy them all before time runs out!',
    icon: '⚡',
  },
  precision: {
    name: 'Precision',
    description: 'Targets shrink over time. Hit the center for maximum points.',
    icon: '💎',
  },
  tracking: {
    name: 'Reflex',
    description: 'Targets appear and disappear quickly. Test your reflexes!',
    icon: '👁️',
  },
};
