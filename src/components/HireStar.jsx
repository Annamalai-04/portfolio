export default function HireStar({onClick}){return <a className="hire-star nav-hire-star" href="#contact" aria-label="Hire me — go to contact" onClick={onClick}>
  <svg viewBox="0 0 100 100" aria-hidden="true"><defs><linearGradient id="hire-star-gradient" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#c5ffed"/><stop offset="1" stopColor="#9bb9ff"/></linearGradient></defs><path d="M50 3 60 23 80 12 79 35 98 40 82 56 94 76 71 77 66 98 49 83 29 95 26 73 4 68 19 50 7 29 30 28 35 7Z" fill="url(#hire-star-gradient)"/></svg>
  <span>HIRE<br/>ME <small>↗</small></span>
</a>}
