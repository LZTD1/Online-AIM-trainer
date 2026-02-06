import { useEffect, useState } from 'react';

interface HitEffectData {
  id: number;
  x: number;
  y: number;
  zone: number;
  score: number;
}

let effectId = 0;

export function useHitEffects() {
  const [effects, setEffects] = useState<HitEffectData[]>([]);

  const addEffect = (x: number, y: number, zone: number, score: number) => {
    const id = ++effectId;
    setEffects(prev => [...prev, { id, x, y, zone, score }]);
    setTimeout(() => {
      setEffects(prev => prev.filter(e => e.id !== id));
    }, 600);
  };

  return { effects, addEffect };
}

export function HitEffect({ effect }: { effect: HitEffectData }) {
  const [opacity, setOpacity] = useState(1);
  const [translateY, setTranslateY] = useState(0);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    requestAnimationFrame(() => {
      setOpacity(0);
      setTranslateY(-40);
      setScale(1.2);
    });
  }, []);

  const colors = ['#ff4444', '#ff8844', '#44ff44', '#00ffff'];
  const labels = ['', '+1', '+2', '+5'];

  return (
    <div
      className="pointer-events-none fixed z-30 font-mono text-xl font-bold"
      style={{
        left: effect.x,
        top: effect.y,
        color: colors[effect.zone],
        opacity,
        transform: `translate(-50%, -50%) translateY(${translateY}px) scale(${scale})`,
        transition: 'all 0.5s ease-out',
        textShadow: `0 0 10px ${colors[effect.zone]}`,
      }}
    >
      {labels[effect.zone]}
    </div>
  );
}
