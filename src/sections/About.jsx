import { Code2, ArrowUpRight } from "lucide-react";
import { personal } from "../data/personal";
import "../styles/portrait.css";
import "../styles/about-responsive.css";
export default function About() {
  return (
    <section id="about" className="section container reveal">
      <div className="section-label">01 / THE PERSON BEHIND THE CODE</div>
      <div className="about-grid">
        <div className="portrait-orbit">
          <span className="portrait-orbit-ring" aria-hidden="true" />
          <div className="portrait-medallion">
          <div className="portrait-circle">
          <img
            className="portrait-photo"
            src="/images/annamalai.jpg"
            alt="Annamalai"
            loading="eager"
            decoding="async"
          />
          </div>
          </div>
          <span className="portrait-note">
            <Code2 size={15} /> {personal.name.toUpperCase()}
          </span>
          <span className="portrait-code" aria-hidden="true">&lt;/&gt;</span>
        </div>
        <div>
          <h2>{personal.intro}</h2>
          <p>{personal.summary}</p>
          <p>
             I bring analytical thinking, adaptability, and a
            collaborative approach to software development, with an integration of AI.
          </p>
          <a className="text-link" href="#contact">
            Give me one opportunity to demonstrate my skills, dedication, and potential. <ArrowUpRight size={16} />
          </a>
          <div className="stats">
            {personal.stats.map((s) => (
              <div key={s.label}>
                <strong>{s.value ?? "—"}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
