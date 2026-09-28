import { Balloon, Blocks, Bottle, Cloud, Duck, Heart, Moon, Pacifier, Rattle, Star, Teddy } from './Art';

// Floating illustrations behind the page content.
export function Decor() {
  return (
    <div className="decor" aria-hidden>
      <Cloud className="float f1" style={{ top: '6%', left: '-2%' }} size={150} />
      <Cloud className="float f3" style={{ top: '38%', right: '-3%' }} size={120} />
      <Moon className="float f2" style={{ top: '14%', right: '6%' }} size={70} />
      <Star className="twinkle" style={{ top: '4%', left: '30%' }} size={26} />
      <Star className="twinkle t2" style={{ top: '22%', left: '12%' }} size={20} color="#c3b1e1" />
      <Star className="twinkle t3" style={{ top: '9%', right: '28%' }} size={22} color="#b8e0d2" />
      <Balloon className="float f2" style={{ top: '52%', left: '2%' }} size={44} color="#b8e0d2" />
      <Balloon className="float f1" style={{ top: '58%', left: '6%' }} size={34} color="#ffc4a3" />
      <Duck className="float f3" style={{ bottom: '6%', right: '4%' }} size={80} />
      <Rattle className="wiggle" style={{ bottom: '22%', left: '3%' }} size={46} />
      <Bottle className="float f1" style={{ top: '70%', right: '10%' }} size={34} />
      <Pacifier className="float f2" style={{ bottom: '3%', left: '18%' }} size={48} />
      <Blocks className="float f3" style={{ bottom: '4%', left: '44%' }} size={70} />
      <Teddy className="float f1" style={{ top: '30%', left: '1%' }} size={60} />
      <Heart className="twinkle t2" style={{ top: '46%', right: '14%' }} size={22} />
      <Heart className="twinkle" style={{ bottom: '30%', right: '30%' }} size={16} color="#c3b1e1" />
    </div>
  );
}
