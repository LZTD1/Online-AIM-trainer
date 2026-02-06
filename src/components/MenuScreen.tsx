import { useState } from 'react';
import type { GameMode, GameSettings } from '../types';
import { MODE_INFO } from '../types';

interface MenuScreenProps {
  onStart: (settings: GameSettings) => void;
}

export function MenuScreen({ onStart }: MenuScreenProps) {
  const [mode, setMode] = useState<GameMode>('classic');
  const [duration, setDuration] = useState(30);
  const [targetSize, setTargetSize] = useState(80);

  const handleStart = () => {
    const settings: GameSettings = {
      mode,
      targetCount: mode === 'speed' ? 3 : 1,
      targetSize,
      duration,
      shrinkTargets: mode === 'precision',
    };
    onStart(settings);
  };

  const modes = Object.entries(MODE_INFO) as [GameMode, typeof MODE_INFO[GameMode]][];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-4">
      {/* Animated background dots */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-cyan-500/10"
            style={{
              width: Math.random() * 4 + 1,
              height: Math.random() * 4 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `pulse ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Title */}
        <div className="mb-10 text-center">
          <div className="mb-3 text-6xl">🎯</div>
          <h1 className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-5xl font-black tracking-tight text-transparent">
            AIM TRAINER
          </h1>
          <p className="mt-2 font-mono text-sm text-white/40">
            Train your precision • Track your progress
          </p>
        </div>

        {/* Mode selection */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {modes.map(([key, info]) => (
            <button
              key={key}
              onClick={() => setMode(key)}
              className={`
                group rounded-xl border p-4 text-left transition-all duration-200
                ${mode === key
                  ? 'border-cyan-500/50 bg-cyan-500/10 shadow-lg shadow-cyan-500/10'
                  : 'border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/5'
                }
              `}
            >
              <div className="mb-2 text-2xl">{info.icon}</div>
              <div className={`text-sm font-semibold ${mode === key ? 'text-cyan-400' : 'text-white/70'}`}>
                {info.name}
              </div>
              <div className="mt-1 text-xs leading-relaxed text-white/30">
                {info.description}
              </div>
            </button>
          ))}
        </div>

        {/* Settings */}
        <div className="mb-8 rounded-xl border border-white/5 bg-white/[0.02] p-5">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/30">Settings</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Duration */}
            <div>
              <label className="mb-2 flex items-center justify-between text-sm text-white/60">
                <span>Duration</span>
                <span className="font-mono text-cyan-400">{duration}s</span>
              </label>
              <input
                type="range"
                min={10}
                max={120}
                step={5}
                value={duration}
                onChange={e => setDuration(Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
              <div className="mt-1 flex justify-between text-xs text-white/20">
                <span>10s</span>
                <span>120s</span>
              </div>
            </div>

            {/* Target size */}
            <div>
              <label className="mb-2 flex items-center justify-between text-sm text-white/60">
                <span>Target Size</span>
                <span className="font-mono text-cyan-400">{targetSize}px</span>
              </label>
              <input
                type="range"
                min={40}
                max={140}
                step={10}
                value={targetSize}
                onChange={e => setTargetSize(Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
              <div className="mt-1 flex justify-between text-xs text-white/20">
                <span>40px</span>
                <span>140px</span>
              </div>
            </div>
          </div>
        </div>

        {/* Start button */}
        <button
          onClick={handleStart}
          className="group relative mx-auto flex w-full max-w-xs items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 font-bold text-white shadow-xl shadow-cyan-500/25 transition-all duration-200 hover:scale-105 hover:shadow-cyan-500/40 active:scale-95"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <span className="text-lg">START GAME</span>
          <span className="text-xl">▸</span>
        </button>

        {/* Keyboard hint */}
        <p className="mt-4 text-center font-mono text-xs text-white/20">
          Click targets as fast as you can with maximum precision
        </p>
      </div>
    </div>
  );
}
