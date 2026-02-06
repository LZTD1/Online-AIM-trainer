import { useEffect, useRef } from 'react';

interface MouseTrailProps {
  path: [number, number][];
  startPoint: [number, number] | null;
}

export function MouseTrail({ path, startPoint }: MouseTrailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!startPoint || path.length < 2) return;

    const [sx, sy] = startPoint;

    // Draw ideal straight line (faint)
    const lastPoint = path[path.length - 1];
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(lastPoint[0], lastPoint[1]);
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw actual path with deviation coloring
    const endX = lastPoint[0];
    const endY = lastPoint[1];
    const dirX = endX - sx;
    const dirY = endY - sy;
    const dirLen = Math.sqrt(dirX * dirX + dirY * dirY);

    for (let i = 1; i < path.length; i++) {
      const [x1, y1] = path[i - 1];
      const [x2, y2] = path[i];

      // Calculate deviation from straight line
      let deviation = 0;
      if (dirLen > 0) {
        const px = x1 - sx;
        const py = y1 - sy;
        const proj = (px * dirX + py * dirY) / (dirLen * dirLen);
        const projX = sx + proj * dirX;
        const projY = sy + proj * dirY;
        deviation = Math.sqrt((projX - x1) ** 2 + (projY - y1) ** 2);
      }

      const maxDev = 60;
      const t = Math.min(1, deviation / maxDev);
      const r = Math.floor(255 * t);
      const g = Math.floor(255 * (1 - t));

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = `rgba(${r},${g},80,0.5)`;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
  }, [path, startPoint]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 5 }}
    />
  );
}
