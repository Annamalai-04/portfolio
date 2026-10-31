import { useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import { SiReact, SiJavascript, SiSpringboot, SiPython, SiDjango } from 'react-icons/si';
import { FaJava } from 'react-icons/fa';
import { Code2, Database, Workflow, Wrench, Pause, Play } from 'lucide-react';
import '../styles/tech-showcase.css';

const columns = [
  [{ name: 'React', Icon: SiReact }, { name: 'JavaScript', Icon: SiJavascript }],
  [{ name: 'Java', Icon: FaJava }, { name: 'Spring Boot', Icon: SiSpringboot }],
  [{ name: 'Python', Icon: SiPython }, { name: 'Django', Icon: SiDjango }],
  [{ name: 'GXT', Icon: Code2 }, { name: 'Data analysis', Icon: Database }],
  [{ name: 'CI/CD', Icon: Workflow }, { name: 'Testing', Icon: Wrench }],
];

export default function TechShowcase() {
  const ref = useRef(null);
  const visible = useInView(ref, { margin: '80px' });
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  return (
    <section ref={ref} className={`tech-showcase ${paused || !visible ? 'is-paused' : ''}`} aria-labelledby="toolkit-title">
      <div className="container">
        <p id="toolkit-title" className="tech-showcase-title">Ideas powered by a growing toolkit</p>
        <div className="tech-logo-wall" aria-hidden="true">
          {columns.map((pair, index) => (
            <div className="tech-logo-slot" key={pair[0].name} style={{ '--slot-delay': `${index * .45}s` }}>
              {pair.map(({ name, Icon }, variant) => (
                <div className={`tech-logo tech-logo-${variant} ${name === 'Generative AI' ? 'tech-logo-ai' : ''}`} key={name}>
                  <Icon focusable="false" /><span>{name}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <p className="sr-only">Technologies: {columns.flat().map(t => t.name).join(', ')}.</p>
        {!reduced && <button className="tech-motion-toggle" onClick={() => setPaused(p => !p)} aria-label={paused ? 'Play technology logo animation' : 'Pause technology logo animation'} aria-pressed={paused}>
          {paused ? <Play size={12} /> : <Pause size={12} />}<span>{paused ? 'Play' : 'Pause'}</span>
        </button>}
      </div>
    </section>
  );
}
