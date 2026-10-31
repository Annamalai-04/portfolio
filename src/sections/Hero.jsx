import { lazy, Suspense, Component, useEffect, useState } from "react";
import { ArrowUpRight, ArrowDown, Download, Code2 } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import Loader from "../components/Loader";
import SocialLinks from "../components/SocialLinks";
import { personal } from "../data/personal";
const Scene = lazy(() => import("../canvas/Scene"));
function Fallback() {
  return (
    <div className="fallback-laptop">
      <Code2 size={80} />
      <pre>
        {
          'const developer = "Annamalai";\n\n// Always building.\nturnIdeasIntoReality();'
        }
      </pre>
    </div>
  );
}
class SceneBoundary extends Component {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? <Fallback /> : this.props.children;
  }
}
function supportsWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}
const roles = [
  "Software Developer",
  "Full Stack Developer",
  "Java Developer",
  "Python Developer",
  "Creative Problem Solver",
];
export default function Hero() {
  const [role, setRole] = useState(0);
  const reduced = useReducedMotion();
  const [webgl] = useState(supportsWebGL);
  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setRole((r) => (r + 1) % roles.length), 3400);
    return () => clearInterval(t);
  }, [reduced]);
  return (
    <section id="home" className="hero container">
      <div className="hero-copy">
        <div className="eyebrow">
          <span /> CODE. CREATE. KEEP EXPLORING.
        </div>
        <p className="hello">
          Hello, I’m Annamalai <span className="wave">✳</span>
        </p>
        <h1>
          Engineering ideas.
          <br />
          Building <em>possibilities.</em>
        </h1>
        <div className="role-line">
          <span>&gt;</span>
          <span key={role} className={reduced ? "" : "type-role"}>
            {roles[role]}
          </span>
          <b>_</b>
        </div>
        <p className="hero-description">
          Software Developer · Java · Full Stack Development
          <br />
          Turning complex challenges into thoughtful digital experiences.
        </p>
        <div className="hero-buttons">
          <a className="button primary" href="#projects">
            View my projects <ArrowUpRight size={17} />
          </a>
          {personal.resumeUrl ? (
            <a className="button secondary" href={personal.resumeUrl} download>
              Download résumé <Download size={16} />
            </a>
          ) : (
            <button
              className="button secondary"
              disabled
              title="Add your résumé URL in src/data/personal.js"
            >
              Résumé coming soon <Download size={16} />
            </button>
          )}
        </div>
        <div className="hero-social">
          <SocialLinks />
          <span className="social-divider" />
          <span>LET’S BUILD SOMETHING MEANINGFUL</span>
        </div>
      </div>
      <div className="hero-visual">
        <div className="orbital-ring ring-one" />
        <div className="orbital-ring ring-two" />
        <div className="scene">
          <SceneBoundary>
            <Suspense fallback={<Loader />}>
              {webgl ? <Scene /> : <Fallback />}
            </Suspense>
          </SceneBoundary>
        </div>
        <span className="float-tag tag-react">
          ⚛ <span>React</span>
        </span>
        <span className="float-tag tag-code">{"</>"}</span>
        <span className="float-tag tag-ai">
          <span className="tiny-dot" /> AI × Creativity
        </span>
        <div className="scene-caption">
          <span /> INTERACTIVE WORKSPACE <small>MOVE YOUR CURSOR</small>
        </div>
        <span className="visual-coordinate">{"{ ideas → experiences }"}</span>
      </div>
      <a href="#about" className="scroll-cue">
        <span className="mouse-icon" /> SCROLL TO EXPLORE{" "}
        <ArrowDown size={13} />
      </a>
      <span className="hero-index">PORTFOLIO — 01 / 07</span>
    </section>
  );
}
