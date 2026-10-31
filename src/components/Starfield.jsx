import '../styles/stars.css';
const stars = Array.from({length: 65}, (_, i) => ({
  left: `${((i * 61.803 + 7) % 100).toFixed(2)}%`,
  top: `${((i * 37.719 + 11) % 100).toFixed(2)}%`,
  '--twinkle-time': `${4 + i % 6}s`,
  '--twinkle-delay': `${-(i % 13)}s`,
  '--star-size': `${i % 8 === 0 ? 4 : 2}px`,
}));
export default function Starfield(){return <>
  <div className="starfield" aria-hidden="true">{stars.map((style,i)=><span key={i} className={i%8===0?'sky-star sparkle':'sky-star'} style={style}/>)}</div>
  </>}
