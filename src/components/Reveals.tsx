// The five interactive reveal methods. Each one calls onDone when the colour shows.
import { useEffect, useRef, useState } from 'react';
import { Balloon } from './Art';
import { sfx } from '../lib/sound';
import type { RevealMethod } from '../lib/revealMethods';
import { burstConfetti } from '../lib/confetti';

export interface RevealProps {
  color: string;
  confetti: string[];
  label: string;
  onDone: () => void;
}

const INK = '#4a3f5c';

export function RevealStage({ method, ...props }: RevealProps & { method: RevealMethod }) {
  switch (method) {
    case 'scratch':
      return <ScratchCard {...props} />;
    case 'balloon':
      return <BalloonPump {...props} />;
    case 'gift':
      return <GiftBox {...props} />;
    case 'egg':
      return <HatchingEgg {...props} />;
    case 'cannon':
      return <ConfettiCannon {...props} />;
  }
}

function ScratchCard({ color, confetti, label, onDone }: RevealProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const moves = useRef(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const c = canvas.getContext('2d')!;
    const size = canvas.width;
    const g = c.createLinearGradient(0, 0, size, size);
    g.addColorStop(0, '#d9d4e4');
    g.addColorStop(0.5, '#f4f1f8');
    g.addColorStop(1, '#c9c2d8');
    c.fillStyle = g;
    c.fillRect(0, 0, size, size);
    c.fillStyle = '#a79cbf';
    for (let i = 0; i < 40; i++) {
      c.font = `${24 + Math.random() * 24}px sans-serif`;
      c.fillText(['★', '♥', '✿', '•'][i % 4], Math.random() * size, Math.random() * size);
    }
    c.fillStyle = INK;
    c.font = '700 64px Fredoka, sans-serif';
    c.textAlign = 'center';
    c.fillText('Scratch me!', size / 2, size / 2 + 22);
  }, []);

  const last = useRef<{ x: number; y: number } | null>(null);

  const checkProgress = () => {
    if (done) return;
    const canvas = canvasRef.current!;
    const data = canvas.getContext('2d')!.getImageData(0, 0, canvas.width, canvas.height).data;
    let clear = 0;
    for (let i = 3; i < data.length; i += 64) if (data[i] === 0) clear++;
    if (clear / (data.length / 64) > 0.5) {
      setDone(true);
      sfx.fanfare();
      burstConfetti(confetti, 200);
      window.setTimeout(onDone, 1400);
    }
  };

  const scratch = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || done) return;
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scale = canvas.width / rect.width;
    const x = (e.clientX - rect.left) * scale;
    const y = (e.clientY - rect.top) * scale;
    const c = canvas.getContext('2d')!;
    c.globalCompositeOperation = 'destination-out';
    c.lineCap = 'round';
    c.lineWidth = 60 * scale;
    c.beginPath();
    c.moveTo(last.current?.x ?? x, last.current?.y ?? y);
    c.lineTo(x, y);
    c.stroke();
    last.current = { x, y };
    moves.current++;
    if (moves.current % 4 === 0) sfx.scratch();
    if (moves.current % 12 === 0) checkProgress();
  };

  return (
    <div className="scratch-wrap">
      <div className="scratch-under" style={{ background: color }}>
        <span>{label}</span>
      </div>
      <canvas
        ref={canvasRef}
        width={600}
        height={600}
        className={`scratch-canvas ${done ? 'gone' : ''}`}
        onPointerDown={(e) => {
          drawing.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          scratch(e);
        }}
        onPointerMove={scratch}
        onPointerUp={() => {
          drawing.current = false;
          last.current = null;
          checkProgress();
        }}
        aria-label="Scratch card. Drag to scratch."
      />
    </div>
  );
}

function BalloonPump({ color, confetti, onDone }: RevealProps) {
  const [pumps, setPumps] = useState(0);
  const [limit] = useState(() => 7 + Math.floor(Math.random() * 5));
  const burst = pumps >= limit;

  const pump = () => {
    if (burst) return;
    const next = pumps + 1;
    setPumps(next);
    if (next >= limit) {
      sfx.pop();
      window.setTimeout(() => sfx.fanfare(), 150);
      burstConfetti(confetti, 260);
      window.setTimeout(onDone, 1500);
    } else {
      sfx.squeak();
    }
  };

  const scale = 0.6 + pumps * 0.09;
  return (
    <div className="pump-wrap">
      {!burst ? (
        <button className="pump-balloon" onClick={pump} aria-label="Pump the balloon">
          <div className={`balloon-body ${pumps > limit - 3 ? 'tense' : ''}`} style={{ transform: `scale(${scale})` }}>
            <Balloon size={200} color="#e9e3f5" />
            <span className="balloon-q">?</span>
          </div>
        </button>
      ) : (
        <div className="burst" style={{ background: color }} />
      )}
      <p className="stage-hint">{burst ? 'POP!' : `Tap to pump · ${pumps} ${pumps === 1 ? 'pump' : 'pumps'}`}</p>
    </div>
  );
}

function GiftBox({ color, confetti, onDone }: RevealProps) {
  const [shakes, setShakes] = useState(0);
  const open = shakes >= 4;

  const tap = () => {
    if (open) return;
    const next = shakes + 1;
    setShakes(next);
    if (next >= 4) {
      sfx.pop();
      sfx.fanfare();
      burstConfetti(confetti, 200);
      window.setTimeout(onDone, 2200);
    } else {
      sfx.rattle();
    }
  };

  return (
    <div className="gift-wrap">
      {open && (
        <div className="gift-balloons">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <Balloon
              key={i}
              size={60 + (i % 3) * 10}
              color={confetti[i % confetti.length] === '#ffffff' ? color : confetti[i % confetti.length]}
              className="fly"
              style={{ left: `${4 + i * 14}%`, animationDelay: `${(i % 3) * 0.15 + i * 0.05}s` }}
            />
          ))}
        </div>
      )}
      <button className={`gift ${open ? 'open' : ''} shake-${Math.min(shakes, 3)}`} onClick={tap} aria-label="Shake the box" key={shakes}>
        <svg viewBox="0 0 200 200" width="240" height="240" aria-hidden>
          <g className="gift-lid">
            <rect x="20" y="58" width="160" height="34" rx="6" fill="#c3b1e1" stroke={INK} strokeWidth="4" />
            <rect x="88" y="58" width="24" height="34" fill="#ffd95a" stroke={INK} strokeWidth="4" />
            <path d="M100 58 Q70 20 60 40 Q56 58 100 58 Q130 20 140 40 Q144 58 100 58" fill="#ffd95a" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
          </g>
          <rect x="30" y="92" width="140" height="96" rx="6" fill="#b8e0d2" stroke={INK} strokeWidth="4" />
          <rect x="88" y="92" width="24" height="96" fill="#ffd95a" stroke={INK} strokeWidth="4" />
          {open && <rect x="34" y="94" width="132" height="20" fill={color} opacity="0.9" />}
        </svg>
      </button>
      <p className="stage-hint">{open ? 'Look up!' : `Tap to shake (${4 - shakes} more)`}</p>
    </div>
  );
}

const CRACKS = [
  'M100 70 L92 88 L104 96 L96 112',
  'M60 120 L78 116 L84 130 L100 124',
  'M140 110 L126 120 L132 136 L118 140',
  'M72 160 L88 150 L96 164 L110 154',
  'M130 170 L120 158 L136 150',
];

function HatchingEgg({ color, confetti, onDone }: RevealProps) {
  const [taps, setTaps] = useState(0);
  const hatched = taps > CRACKS.length;

  const tap = () => {
    if (hatched) return;
    const next = taps + 1;
    setTaps(next);
    if (next > CRACKS.length) {
      sfx.crack();
      sfx.fanfare();
      burstConfetti(confetti, 200);
      window.setTimeout(onDone, 2000);
    } else {
      sfx.crack();
    }
  };

  return (
    <div className="egg-wrap">
      <button className={`egg ${hatched ? 'hatched' : ''}`} onClick={tap} aria-label="Tap the egg" key={taps}>
        <svg viewBox="0 0 200 240" width="220" height="264" aria-hidden>
          {hatched && (
            <g className="chick">
              <circle cx="100" cy="130" r="48" fill="#ffd95a" stroke={INK} strokeWidth="4" />
              <circle cx="84" cy="122" r="5" fill={INK} />
              <circle cx="116" cy="122" r="5" fill={INK} />
              <path d="M92 136 L108 136 L100 148 Z" fill="#ff9f43" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
              <circle cx="72" cy="140" r="7" fill="#ff9eb1" opacity="0.6" />
              <circle cx="128" cy="140" r="7" fill="#ff9eb1" opacity="0.6" />
              <path d="M76 86 L100 70 L124 86 L112 92 L100 84 L88 92 Z" fill={color} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
              <circle cx="100" cy="72" r="8" fill={color} stroke={INK} strokeWidth="3" />
            </g>
          )}
          <g className="egg-bottom">
            <path d="M24 140 Q24 228 100 228 Q176 228 176 140 L150 150 L128 136 L100 152 L72 136 L50 150 Z" fill="#fffaf0" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
          </g>
          <g className="egg-top">
            <path d="M24 140 Q20 16 100 12 Q180 16 176 140 L150 150 L128 136 L100 152 L72 136 L50 150 Z" fill="#fffaf0" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
            <circle cx="70" cy="60" r="8" fill="#b8e0d2" />
            <circle cx="130" cy="84" r="10" fill="#c3b1e1" />
            <circle cx="96" cy="104" r="6" fill="#ffc4a3" />
            {CRACKS.slice(0, taps).map((d) => (
              <path key={d} d={d} stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            ))}
          </g>
        </svg>
      </button>
      <p className="stage-hint">{hatched ? 'Hello, little one!' : `Tap the egg (${CRACKS.length + 1 - taps} more)`}</p>
    </div>
  );
}

function ConfettiCannon({ color, confetti, onDone }: RevealProps) {
  const [charge, setCharge] = useState(0);
  const [fired, setFired] = useState(false);
  const timer = useRef<number | null>(null);

  const stop = () => {
    if (timer.current) window.clearInterval(timer.current);
    timer.current = null;
  };

  const hold = () => {
    if (fired) return;
    sfx.drumroll(2);
    timer.current = window.setInterval(() => {
      setCharge((c) => Math.min(100, c + 2.5));
    }, 50);
  };

  const release = () => {
    stop();
    if (fired) return;
    if (charge >= 100) {
      setFired(true);
      sfx.pop();
      sfx.fanfare();
      burstConfetti(confetti, 320, { x: window.innerWidth / 2, y: window.innerHeight * 0.7 });
      window.setTimeout(onDone, 1600);
    } else {
      setCharge(0);
    }
  };

  useEffect(() => stop, []);

  return (
    <div className="cannon-wrap">
      <div className={`splash ${fired ? 'on' : ''}`} style={{ background: color }} />
      <div className="meter" aria-hidden>
        <div style={{ width: `${charge}%` }} />
      </div>
      <button
        className={`cannon ${charge >= 100 ? 'ready' : ''}`}
        onPointerDown={hold}
        onPointerUp={release}
        onPointerLeave={release}
        onKeyDown={(e) => e.key === ' ' && !timer.current && hold()}
        onKeyUp={(e) => e.key === ' ' && release()}
        aria-label="Hold to charge the confetti cannon"
      >
        🎊
      </button>
      <p className="stage-hint">{fired ? 'BOOM!' : charge >= 100 ? 'Let go!' : 'Press and hold'}</p>
    </div>
  );
}
