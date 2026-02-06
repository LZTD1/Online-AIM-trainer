import { useEffect, useState, type MouseEvent } from 'react';
import type { Target as TargetType } from '../types';

interface TargetProps {
  target: TargetType;
  onHit: (targetId: string, zone: number, clickX: number, clickY: number) => void;
}

export function Target({ target, onHit }: TargetProps) {
  const [scale, setScale] = useState(0);
  const [shrinkProgress, setShrinkProgress] = useState(1);

  useEffect(() => {
    requestAnimationFrame(() => setScale(1));
  }, []);

  useEffect(() => {
    if (!target.shrinking || !target.shrinkDuration) return;

    const startTime = target.createdAt;
    const duration = target.shrinkDuration;
    let raf: number;

    const animate = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.max(0, 1 - elapsed / duration);
      setShrinkProgress(progress);
      if (progress > 0) {
        raf = requestAnimationFrame(animate);
      }
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [target.shrinking, target.shrinkDuration, target.createdAt]);

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const effectiveSize = (target.size / 2) * shrinkProgress;

    let zone = 0;
    if (dist <= effectiveSize * 0.25) zone = 3;
    else if (dist <= effectiveSize * 0.55) zone = 2;
    else if (dist <= effectiveSize) zone = 1;

    if (zone > 0) {
      onHit(target.id, zone, e.clientX, e.clientY);
    }
  };

  const effectiveSize = target.size * shrinkProgress;
  const outerSize = effectiveSize;
  const middleSize = effectiveSize * 0.6;
  const innerSize = effectiveSize * 0.25;

  return (
    <div
      className="absolute cursor-crosshair"
      style={{
        left: target.x + (target.size - outerSize) / 2,
        top: target.y + (target.size - outerSize) / 2,
        width: outerSize,
        height: outerSize,
        transform: `scale(${scale})`,
        transition: 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
      onClick={handleClick}
    >
      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,60,60,0.3) 0%, transparent 70%)',
          transform: 'scale(1.5)',
          filter: 'blur(8px)',
        }}
      />
      {/* Outer ring */}
      <div
        className="absolute rounded-full"
        style={{
          width: outerSize,
          height: outerSize,
          background: 'radial-gradient(circle, transparent 60%, rgba(255,80,80,0.4) 100%)',
          border: '2px solid rgba(255,80,80,0.6)',
          top: 0,
          left: 0,
        }}
      />
      {/* Middle ring */}
      <div
        className="absolute rounded-full"
        style={{
          width: middleSize,
          height: middleSize,
          background: 'radial-gradient(circle, transparent 40%, rgba(255,50,50,0.5) 100%)',
          border: '2px solid rgba(255,50,50,0.7)',
          top: (outerSize - middleSize) / 2,
          left: (outerSize - middleSize) / 2,
        }}
      />
      {/* Inner dot */}
      <div
        className="absolute rounded-full"
        style={{
          width: innerSize,
          height: innerSize,
          background: 'radial-gradient(circle, #ff2020 0%, #cc0000 100%)',
          boxShadow: '0 0 10px rgba(255,0,0,0.8), 0 0 20px rgba(255,0,0,0.4)',
          top: (outerSize - innerSize) / 2,
          left: (outerSize - innerSize) / 2,
        }}
      />
      {/* Crosshair lines */}
      <div
        className="absolute bg-white/20"
        style={{
          width: 1,
          height: outerSize,
          left: outerSize / 2,
          top: 0,
        }}
      />
      <div
        className="absolute bg-white/20"
        style={{
          width: outerSize,
          height: 1,
          left: 0,
          top: outerSize / 2,
        }}
      />
    </div>
  );
}
