import type { GameStats } from '../types';

interface HUDProps {
  stats: GameStats;
  timeLeft: number;
  onEnd: () => void;
}

export function HUD({ stats, timeLeft, onEnd }: HUDProps) {
  const avgReaction = stats.shots.length > 1
    ? Math.round(stats.shots.slice(1).reduce((a, s) => a + s.reactionTime, 0) / (stats.shots.length - 1))
    : 0;

  const avgLinearity = stats.shots.length > 0
    ? Math.round(stats.shots.reduce((a, s) => a + s.linearity, 0) / stats.shots.length)
    : 0;

  const accuracy = stats.totalClicks > 0
    ? Math.round((stats.hits / stats.totalClicks) * 100)
    : 0;

  const isLowTime = timeLeft <= 5;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-20 flex items-start justify-between p-4">
      {/* Stats panel */}
      <div className="pointer-events-auto rounded-xl border border-white/10 bg-black/60 px-4 py-3 font-mono text-sm text-white/90 backdrop-blur-sm">
        <div className="mb-2 flex items-center gap-2 border-b border-white/10 pb-2 text-xs uppercase tracking-wider text-cyan-400">
          <span>📊</span>
          <span>Live Stats</span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between gap-6">
            <span className="text-white/50">Score</span>
            <span className="font-bold text-yellow-400">{stats.score}</span>
          </div>
          <div className="flex justify-between gap-6">
            <span className="text-white/50">Hits</span>
            <span>{stats.hits}</span>
          </div>
          <div className="flex justify-between gap-6">
            <span className="text-white/50">Accuracy</span>
            <span className={accuracy >= 80 ? 'text-green-400' : accuracy >= 50 ? 'text-yellow-400' : 'text-red-400'}>
              {accuracy}%
            </span>
          </div>
          <div className="flex justify-between gap-6">
            <span className="text-white/50">Avg React</span>
            <span>{avgReaction > 0 ? `${avgReaction}ms` : '—'}</span>
          </div>
          <div className="flex justify-between gap-6">
            <span className="text-white/50">Linearity</span>
            <span className={avgLinearity >= 90 ? 'text-green-400' : avgLinearity >= 70 ? 'text-yellow-400' : 'text-red-400'}>
              {avgLinearity > 0 ? `${avgLinearity}%` : '—'}
            </span>
          </div>
        </div>
      </div>

      {/* Timer */}
      <div className="flex items-center gap-3">
        <div className={`
          pointer-events-auto rounded-xl border px-5 py-3 font-mono text-2xl font-bold backdrop-blur-sm
          ${isLowTime
            ? 'animate-pulse border-red-500/50 bg-red-900/40 text-red-400'
            : 'border-white/10 bg-black/60 text-white'
          }
        `}>
          {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
        </div>
        <button
          onClick={onEnd}
          className="pointer-events-auto rounded-lg border border-white/10 bg-black/60 px-3 py-3 text-white/60 backdrop-blur-sm transition-colors hover:bg-red-900/40 hover:text-red-400"
          title="End game"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
