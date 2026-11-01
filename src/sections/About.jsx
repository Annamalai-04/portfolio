import { Code2, ArrowUpRight } from "lucide-react";
import { personal } from "../data/personal";
import "../styles/portrait.css";
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
            My toolkit includes Java, Python, JavaScript, Spring Boot, React,
            GXT, and Django. I bring analytical thinking, adaptability, and a
            collaborative approach to software development, with an interest in AI.
          </p>
          <a className="text-link" href="#contact">
            Let’s connect <ArrowUpRight size={16} />
          </a>
          <div className="stats">
            {personal.stats.map((s) => (
              <div key={s.label}>
                <strong>{s.value ?? "—"}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
          <small className="muted">Based in {personal.location}.</small>
        </div>
      </div>
    </section>
  );
}
