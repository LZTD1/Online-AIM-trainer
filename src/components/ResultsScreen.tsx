import type { GameSettings, GameStats } from '../types';
import { MODE_INFO } from '../types';

interface ResultsScreenProps {
  stats: GameStats;
  settings: GameSettings;
  onRestart: () => void;
  onMenu: () => void;
}

export function ResultsScreen({ stats, settings, onRestart, onMenu }: ResultsScreenProps) {
  const totalTime = stats.endTime && stats.startTime
    ? ((stats.endTime - stats.startTime) / 1000).toFixed(1)
    : '0';

  const accuracy = stats.totalClicks > 0
    ? Math.round((stats.hits / stats.totalClicks) * 100)
    : 0;

  const avgReaction = stats.shots.length > 1
    ? Math.round(stats.shots.slice(1).reduce((a, s) => a + s.reactionTime, 0) / (stats.shots.length - 1))
    : 0;

  const avgLinearity = stats.shots.length > 0
    ? Math.round(stats.shots.reduce((a, s) => a + s.linearity, 0) / stats.shots.length)
    : 0;

  const zoneHits = [0, 0, 0];
  stats.shots.forEach(s => {
    if (s.zone >= 1 && s.zone <= 3) zoneHits[s.zone - 1]++;
  });

  const bestReaction = stats.shots.length > 1
    ? Math.round(Math.min(...stats.shots.slice(1).map(s => s.reactionTime)))
    : 0;

  // Rating
  const getRating = () => {
    const s = stats.score;
    const a = accuracy;
    if (s >= 100 && a >= 90) return { grade: 'S+', color: 'from-yellow-400 to-amber-500', desc: 'LEGENDARY' };
    if (s >= 70 && a >= 80) return { grade: 'S', color: 'from-purple-400 to-pink-500', desc: 'EXCELLENT' };
    if (s >= 50 && a >= 70) return { grade: 'A', color: 'from-cyan-400 to-blue-500', desc: 'GREAT' };
    if (s >= 30 && a >= 60) return { grade: 'B', color: 'from-green-400 to-emerald-500', desc: 'GOOD' };
    if (s >= 15 && a >= 40) return { grade: 'C', color: 'from-yellow-400 to-orange-500', desc: 'DECENT' };
    return { grade: 'D', color: 'from-red-400 to-red-600', desc: 'KEEP PRACTICING' };
  };

  const rating = getRating();
  const modeInfo = MODE_INFO[settings.mode];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-2 text-sm font-medium uppercase tracking-wider text-white/30">
            {modeInfo.icon} {modeInfo.name} Mode — Results
          </div>

          {/* Grade */}
          <div className={`inline-block bg-gradient-to-r ${rating.color} bg-clip-text text-8xl font-black text-transparent`}>
            {rating.grade}
          </div>
          <div className={`mt-1 bg-gradient-to-r ${rating.color} bg-clip-text text-sm font-bold tracking-widest text-transparent`}>
            {rating.desc}
          </div>
        </div>

        {/* Score highlight */}
        <div className="mb-6 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 text-center">
          <div className="text-xs uppercase tracking-wider text-yellow-500/60">Final Score</div>
          <div className="text-4xl font-black text-yellow-400">{stats.score}</div>
        </div>

        {/* Stats grid */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <StatCard label="Hits" value={`${stats.hits}/${stats.totalClicks}`} sub={`${accuracy}% accuracy`} />
          <StatCard label="Avg Reaction" value={avgReaction > 0 ? `${avgReaction}ms` : '—'} sub={bestReaction > 0 ? `Best: ${bestReaction}ms` : ''} />
          <StatCard label="Linearity" value={`${avgLinearity}%`} sub="Path efficiency" />
          <StatCard label="Duration" value={`${totalTime}s`} sub={`${stats.hits > 0 ? (stats.hits / Number(totalTime) * 1).toFixed(1) : '0'} hits/s`} />
        </div>

        {/* Zone breakdown */}
        <div className="mb-8 rounded-xl border border-white/5 bg-white/[0.02] p-4">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/30">Zone Breakdown</h3>
          <div className="flex items-end justify-center gap-6">
            <ZoneBar label="Outer" value={zoneHits[0]} total={stats.hits} color="bg-red-500/60" points="+1" />
            <ZoneBar label="Middle" value={zoneHits[1]} total={stats.hits} color="bg-orange-500/60" points="+2" />
            <ZoneBar label="Center" value={zoneHits[2]} total={stats.hits} color="bg-cyan-500/60" points="+5" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onMenu}
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-medium text-white/70 transition-all hover:bg-white/10 hover:text-white"
          >
            ← Menu
          </button>
          <button
            onClick={onRestart}
            className="flex-1 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-bold text-white shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 hover:shadow-cyan-500/40 active:scale-95"
          >
            Play Again ▸
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
      <div className="text-xs text-white/30">{label}</div>
      <div className="text-xl font-bold text-white">{value}</div>
      <div className="text-xs text-white/20">{sub}</div>
    </div>
  );
}

function ZoneBar({ label, value, total, color, points }: {
  label: string;
  value: number;
  total: number;
  color: string;
  points: string;
}) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  const maxH = 80;
  const h = total > 0 ? Math.max(4, (value / total) * maxH) : 4;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="text-xs font-bold text-white/70">{value}</div>
      <div
        className={`w-10 rounded-t ${color}`}
        style={{ height: h }}
      />
      <div className="text-xs text-white/30">{label}</div>
      <div className="text-xs text-white/20">{points} ({Math.round(pct)}%)</div>
    </div>
  );
}
