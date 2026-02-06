import { useCallback, useEffect, useRef, type MouseEvent } from 'react';
import type { GameSettings, GameStats, Target as TargetType } from '../types';
import { Target } from './Target';
import { HUD } from './HUD';
import { MouseTrail } from './MouseTrail';
import { HitEffect, useHitEffects } from './HitEffect';
import { useAudioEngine } from '../hooks/useAudioEngine';

interface GameArenaProps {
  targets: TargetType[];
  stats: GameStats;
  timeLeft: number;
  settings: GameSettings;
  mousePath: [number, number][];
  pathStart: [number, number] | null;
  onTargetHit: (targetId: string, zone: number, clickX: number, clickY: number) => void;
  onMiss: () => void;
  onMouseMove: (x: number, y: number) => void;
  onEnd: () => void;
}

export function GameArena({
  targets,
  stats,
  timeLeft,
  mousePath,
  pathStart,
  onTargetHit,
  onMiss,
  onMouseMove,
  onEnd,
}: GameArenaProps) {
  const { effects, addEffect } = useHitEffects();
  const { playHit, playMiss } = useAudioEngine();
  const arenaRef = useRef<HTMLDivElement>(null);

  const handleTargetHit = useCallback((targetId: string, zone: number, clickX: number, clickY: number) => {
    const scoreMap = [0, 1, 2, 5];
    addEffect(clickX, clickY, zone, scoreMap[zone]);
    playHit(zone);
    onTargetHit(targetId, zone, clickX, clickY);
  }, [onTargetHit, addEffect, playHit]);

  const handleBackgroundClick = useCallback((_e: MouseEvent) => {
    playMiss();
    onMiss();
  }, [onMiss, playMiss]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    onMouseMove(e.clientX, e.clientY);
  }, [onMouseMove]);

  // Prevent context menu
  useEffect(() => {
    const prevent = (e: Event) => e.preventDefault();
    document.addEventListener('contextmenu', prevent);
    return () => document.removeEventListener('contextmenu', prevent);
  }, []);

  return (
    <div
      ref={arenaRef}
      className="fixed inset-0 cursor-crosshair overflow-hidden bg-gradient-to-br from-gray-950 via-[#0a0f1c] to-gray-950"
      onClick={handleBackgroundClick}
      onMouseMove={handleMouseMove}
    >
      {/* Grid background */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,255,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,255,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Radial vignette */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)',
        }}
      />

      <MouseTrail path={mousePath} startPoint={pathStart} />

      <HUD stats={stats} timeLeft={timeLeft} onEnd={onEnd} />

      {/* Targets */}
      {targets.map(target => (
        <Target
          key={target.id}
          target={target}
          onHit={handleTargetHit}
        />
      ))}

      {/* Hit effects */}
      {effects.map(effect => (
        <HitEffect key={effect.id} effect={effect} />
      ))}

      {/* Custom crosshair (centered indicator) */}
      <div className="pointer-events-none fixed bottom-4 left-1/2 z-20 -translate-x-1/2">
        <div className="rounded-full border border-white/5 bg-black/40 px-3 py-1 font-mono text-xs text-white/20 backdrop-blur-sm">
          {stats.hits} hits • {stats.score} pts
        </div>
      </div>
    </div>
  );
}
