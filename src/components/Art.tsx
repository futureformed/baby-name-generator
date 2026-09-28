// Hand-drawn style baby illustrations as inline SVG.
import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement> & { size?: number };

const INK = '#4a3f5c';

function Face({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx={-6} cy={0} r={2.2} fill={INK} />
      <circle cx={6} cy={0} r={2.2} fill={INK} />
      <path d="M-3 4 Q0 7 3 4" stroke={INK} strokeWidth={1.8} fill="none" strokeLinecap="round" />
      <circle cx={-11} cy={5} r={3} fill="#ff9eb1" opacity={0.6} />
      <circle cx={11} cy={5} r={3} fill="#ff9eb1" opacity={0.6} />
    </g>
  );
}

export function Duck({ size = 80, ...p }: P) {
  return (
    <svg viewBox="0 0 100 90" width={size} height={size * 0.9} aria-hidden {...p}>
      <ellipse cx="55" cy="62" rx="36" ry="22" fill="#ffd95a" stroke={INK} strokeWidth="3" />
      <circle cx="38" cy="36" r="20" fill="#ffd95a" stroke={INK} strokeWidth="3" />
      <path d="M16 38 Q6 40 10 46 Q18 48 22 42" fill="#ff9f43" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <circle cx="36" cy="31" r="3" fill={INK} />
      <circle cx="30" cy="40" r="3.5" fill="#ff9eb1" opacity="0.6" />
      <path d="M58 56 Q70 50 78 58" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function Rattle({ size = 70, ...p }: P) {
  return (
    <svg viewBox="0 0 80 110" width={size} height={size * 1.375} aria-hidden {...p}>
      <rect x="35" y="55" width="10" height="42" rx="5" fill="#b8e0d2" stroke={INK} strokeWidth="3" />
      <circle cx="40" cy="100" r="8" fill="#c3b1e1" stroke={INK} strokeWidth="3" />
      <circle cx="40" cy="32" r="26" fill="#ffc4a3" stroke={INK} strokeWidth="3" />
      <path d="M18 24 Q40 14 62 24" stroke="#fff" strokeWidth="4" fill="none" opacity="0.7" strokeLinecap="round" />
      <circle cx="28" cy="36" r="4" fill="#ffd95a" />
      <circle cx="42" cy="44" r="4" fill="#b8e0d2" />
      <circle cx="54" cy="32" r="4" fill="#c3b1e1" />
    </svg>
  );
}

export function Bottle({ size = 60, ...p }: P) {
  return (
    <svg viewBox="0 0 60 110" width={size} height={size * 1.83} aria-hidden {...p}>
      <path d="M24 6 Q30 0 36 6 L38 20 L22 20 Z" fill="#ffc4a3" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <rect x="16" y="20" width="28" height="10" rx="3" fill="#c3b1e1" stroke={INK} strokeWidth="3" />
      <rect x="12" y="30" width="36" height="72" rx="12" fill="#eaf6ff" stroke={INK} strokeWidth="3" />
      <rect x="15" y="62" width="30" height="37" rx="9" fill="#fffaf0" />
      <path d="M40 44h-6M40 56h-6M40 68h-6M40 80h-6" stroke={INK} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function Pacifier({ size = 64, ...p }: P) {
  return (
    <svg viewBox="0 0 90 80" width={size} height={size * 0.89} aria-hidden {...p}>
      <circle cx="45" cy="18" r="12" fill="none" stroke={INK} strokeWidth="3" />
      <ellipse cx="45" cy="46" rx="36" ry="18" fill="#b8e0d2" stroke={INK} strokeWidth="3" />
      <circle cx="45" cy="46" r="10" fill="#ffd95a" stroke={INK} strokeWidth="3" />
      <ellipse cx="45" cy="70" rx="10" ry="8" fill="#ffc4a3" stroke={INK} strokeWidth="3" />
    </svg>
  );
}

export function Cloud({ size = 120, ...p }: P) {
  return (
    <svg viewBox="0 0 120 70" width={size} height={size * 0.58} aria-hidden {...p}>
      <path
        d="M25 60 Q5 60 8 44 Q10 30 26 32 Q28 12 50 14 Q64 2 80 16 Q100 12 102 32 Q118 36 112 52 Q108 62 92 60 Z"
        fill="#fff"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <Face x={60} y={38} s={0.9} />
    </svg>
  );
}

export function Star({ size = 40, color = '#ffd95a', ...p }: P & { color?: string }) {
  return (
    <svg viewBox="0 0 50 50" width={size} height={size} aria-hidden {...p}>
      <path
        d="M25 4 L31 18 L46 19 L34 29 L38 45 L25 36 L12 45 L16 29 L4 19 L19 18 Z"
        fill={color}
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Moon({ size = 80, ...p }: P) {
  return (
    <svg viewBox="0 0 90 90" width={size} height={size} aria-hidden {...p}>
      <path d="M58 8 A38 38 0 1 0 82 62 A30 30 0 0 1 58 8 Z" fill="#fff1b8" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M26 50 Q30 54 34 50" stroke={INK} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="24" cy="58" r="3" fill="#ff9eb1" opacity="0.6" />
    </svg>
  );
}

export function Blocks({ size = 100, ...p }: P) {
  return (
    <svg viewBox="0 0 120 100" width={size} height={size * 0.83} aria-hidden {...p}>
      <g stroke={INK} strokeWidth="3" strokeLinejoin="round" fontFamily="Fredoka, sans-serif" fontWeight="700" fontSize="26" textAnchor="middle">
        <rect x="8" y="52" width="44" height="44" rx="6" fill="#b8e0d2" />
        <text x="30" y="84" fill={INK} stroke="none">A</text>
        <rect x="58" y="52" width="44" height="44" rx="6" fill="#ffc4a3" />
        <text x="80" y="84" fill={INK} stroke="none">B</text>
        <rect x="33" y="6" width="44" height="44" rx="6" fill="#c3b1e1" transform="rotate(-6 55 28)" />
        <text x="55" y="38" fill={INK} stroke="none" transform="rotate(-6 55 28)">C</text>
      </g>
    </svg>
  );
}

export function Teddy({ size = 100, ...p }: P) {
  return (
    <svg viewBox="0 0 100 110" width={size} height={size * 1.1} aria-hidden {...p}>
      <g stroke={INK} strokeWidth="3">
        <circle cx="22" cy="20" r="12" fill="#e0b48a" />
        <circle cx="78" cy="20" r="12" fill="#e0b48a" />
        <circle cx="22" cy="20" r="5" fill="#f7d9bb" strokeWidth="0" />
        <circle cx="78" cy="20" r="5" fill="#f7d9bb" strokeWidth="0" />
        <ellipse cx="50" cy="84" rx="30" ry="24" fill="#e0b48a" />
        <circle cx="50" cy="42" r="30" fill="#e0b48a" />
        <ellipse cx="50" cy="52" rx="12" ry="9" fill="#f7d9bb" />
        <ellipse cx="50" cy="86" rx="16" ry="13" fill="#f7d9bb" />
      </g>
      <circle cx="39" cy="38" r="3" fill={INK} />
      <circle cx="61" cy="38" r="3" fill={INK} />
      <ellipse cx="50" cy="49" rx="4" ry="3" fill={INK} />
      <path d="M46 55 Q50 58 54 55" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M36 72 L50 78 L64 72 L64 82 L50 76 L36 82 Z" fill="#ff9eb1" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

export function Onesie({ size = 90, color = '#b8e0d2', ...p }: P & { color?: string }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden {...p}>
      <path
        d="M32 8 Q50 20 68 8 L92 22 L82 40 L72 34 L72 70 Q72 82 62 86 L58 96 L42 96 L38 86 Q28 82 28 70 L28 34 L18 40 L8 22 Z"
        fill={color}
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="44" cy="90" r="2" fill={INK} />
      <circle cx="56" cy="90" r="2" fill={INK} />
      <path d="M50 44 l3 6 7 1 -5 5 1 7 -6 -3 -6 3 1 -7 -5 -5 7 -1 z" fill="#ffd95a" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

export function Balloon({ size = 60, color = '#c3b1e1', ...p }: P & { color?: string }) {
  return (
    <svg viewBox="0 0 60 120" width={size} height={size * 2} aria-hidden {...p}>
      <path d="M30 70 Q24 90 34 100 Q40 110 30 118" stroke={INK} strokeWidth="2" fill="none" />
      <ellipse cx="30" cy="34" rx="26" ry="32" fill={color} stroke={INK} strokeWidth="3" />
      <path d="M26 66 L34 66 L30 72 Z" fill={color} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <ellipse cx="20" cy="22" rx="5" ry="9" fill="#fff" opacity="0.55" transform="rotate(-20 20 22)" />
    </svg>
  );
}

export function Stork({ size = 160, ...p }: P) {
  return (
    <svg viewBox="0 0 200 150" width={size} height={size * 0.75} aria-hidden {...p}>
      <g stroke={INK} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
        {/* bundle */}
        <path d="M112 84 Q140 70 158 92 Q150 128 118 124 Q98 112 112 84 Z" fill="#fffaf0" />
        <circle cx="132" cy="96" r="12" fill="#ffe0cc" />
        <path d="M100 40 L132 86" fill="none" />
        {/* body */}
        <path d="M30 60 Q60 30 104 40 Q120 46 110 62 Q80 80 30 60 Z" fill="#fff" />
        <path d="M40 58 Q10 40 4 60 Q30 64 46 62 Z" fill="#dfe7f0" />
        <path d="M104 40 Q120 24 130 26 Q140 30 132 38 Q124 42 112 46" fill="#fff" />
        <path d="M130 30 L168 38 L132 38 Z" fill="#ff9f43" />
      </g>
      <circle cx="128" cy="31" r="2.2" fill={INK} />
      <circle cx="129" cy="96" r="1.8" fill={INK} />
      <circle cx="137" cy="96" r="1.8" fill={INK} />
      <path d="M130 101 Q133 103 136 101" stroke={INK} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function Heart({ size = 30, color = '#ff9eb1', ...p }: P & { color?: string }) {
  return (
    <svg viewBox="0 0 40 36" width={size} height={size * 0.9} aria-hidden {...p}>
      <path d="M20 34 Q2 22 4 11 Q7 1 20 9 Q33 1 36 11 Q38 22 20 34 Z" fill={color} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    </svg>
  );
}

export function Pram({ size = 110, ...p }: P) {
  return (
    <svg viewBox="0 0 120 100" width={size} height={size * 0.83} aria-hidden {...p}>
      <g stroke={INK} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
        <path d="M20 40 L100 40 Q100 72 60 72 Q20 72 20 40 Z" fill="#c3b1e1" />
        <path d="M20 40 Q24 8 58 8 L58 40 Z" fill="#b8e0d2" />
        <path d="M100 40 L112 22" fill="none" />
        <circle cx="36" cy="86" r="10" fill="#fff" />
        <circle cx="86" cy="86" r="10" fill="#fff" />
        <path d="M40 72 L36 78 M82 72 L86 78" fill="none" />
      </g>
      <circle cx="36" cy="86" r="3" fill={INK} />
      <circle cx="86" cy="86" r="3" fill={INK} />
    </svg>
  );
}
