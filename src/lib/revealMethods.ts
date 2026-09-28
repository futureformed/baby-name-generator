export type RevealMethod = 'scratch' | 'balloon' | 'gift' | 'egg' | 'cannon';

export const METHODS: { id: RevealMethod; label: string; icon: string; blurb: string }[] = [
  { id: 'scratch', label: 'Scratch card', icon: '🪙', blurb: 'Scratch the silver to see the colour.' },
  { id: 'balloon', label: 'Balloon pump', icon: '🎈', blurb: 'Take turns to pump. Who makes it pop?' },
  { id: 'gift', label: 'Surprise box', icon: '🎁', blurb: 'Shake the box until balloons fly out.' },
  { id: 'egg', label: 'Hatching egg', icon: '🥚', blurb: 'Tap the egg to help the chick hatch.' },
  { id: 'cannon', label: 'Confetti cannon', icon: '🎊', blurb: 'Hold to charge, let go to fire.' },
];
