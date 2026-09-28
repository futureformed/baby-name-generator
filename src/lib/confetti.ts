// Canvas confetti with no dependencies.

interface Piece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rot: number;
  vr: number;
  color: string;
  shape: 'rect' | 'circle' | 'heart';
}

export function burstConfetti(colors: string[], amount = 160, origin?: { x: number; y: number }) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const canvas = document.createElement('canvas');
  canvas.className = 'confetti-canvas';
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  document.body.appendChild(canvas);
  const c = canvas.getContext('2d')!;
  c.scale(dpr, dpr);

  const ox = origin?.x ?? window.innerWidth / 2;
  const oy = origin?.y ?? window.innerHeight / 2;
  const shapes: Piece['shape'][] = ['rect', 'circle', 'heart'];
  const pieces: Piece[] = Array.from({ length: amount }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 4 + Math.random() * 10;
    return {
      x: ox,
      y: oy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 6,
      size: 6 + Math.random() * 8,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
    };
  });

  let frame = 0;
  const tick = () => {
    frame++;
    c.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (const p of pieces) {
      p.vy += 0.25;
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      c.save();
      c.translate(p.x, p.y);
      c.rotate(p.rot);
      c.fillStyle = p.color;
      c.globalAlpha = Math.max(0, 1 - frame / 220);
      if (p.shape === 'rect') c.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      else if (p.shape === 'circle') {
        c.beginPath();
        c.arc(0, 0, p.size / 2.5, 0, Math.PI * 2);
        c.fill();
      } else {
        const s = p.size / 2;
        c.beginPath();
        c.moveTo(0, s / 2);
        c.bezierCurveTo(-s, -s / 3, -s / 2, -s, 0, -s / 3);
        c.bezierCurveTo(s / 2, -s, s, -s / 3, 0, s / 2);
        c.fill();
      }
      c.restore();
    }
    if (frame < 220) requestAnimationFrame(tick);
    else canvas.remove();
  };
  requestAnimationFrame(tick);
}
