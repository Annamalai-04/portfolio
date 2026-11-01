import { GraduationCap, Award } from "lucide-react";
import { personal } from "../data/personal";
import "../styles/resume.css";
export default function Education() {
  const e = personal.education;
  return (
    <section id="education" className="section container reveal">
      <div className="section-label">05 / THE FOUNDATION</div>
      <div className="education-layout">
        <h2>
          The Beginning of 
          <br />
          <em>My Learning Journey</em>
        </h2>
        <div className="education-stack">
          
          <article className="education-card">
            <GraduationCap size={28} />
            <div>
              <span className="section-label">SCHOOL</span>
              <h3>{personal.school.institution}</h3>
              <p>{personal.school.subject}</p>
              <small>{personal.school.dates}</small>
            </div>
          </article>
          <article className="education-card">
            <GraduationCap size={32} />
            <div>
              <span className="section-label">UNIVERSITY</span>
              <h3>{e.degree}</h3>
              <p>{e.institution}</p>
              <small>{e.year}</small>
            </div>
          </article>
        </div>
      </div>
      <div className="certifications-heading">
        <Award size={19} />
        <h3>Certifications & continued learning</h3>
      </div>
      <div className="certification-grid">
        {personal.certifications.map((c) => (
          <article className="certification-card" key={c.title}>
            <Award size={23} />
            <h3>{c.title}</h3>
            <p>{c.provider}</p>
            <small>{c.dates}</small>
          </article>
        ))}
      </div>
    </section>
  );
}
