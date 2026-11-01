import { useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import {
  SiReact,
  SiJavascript,
  SiSpringboot,
  SiPython,
  SiDjango,
} from "react-icons/si";
import { FaJava } from "react-icons/fa";
import { Code2, Database, Workflow, Wrench, Pause, Play } from "lucide-react";
import "../styles/tech-showcase.css";

const columns = [
  [
    { name: "JavaScript", Icon: SiJavascript },
    { name: "React", Icon: SiReact },
  ],
  [
    { name: "Java", Icon: FaJava },
    { name: "Spring Boot", Icon: SiSpringboot },
  ],
  [
    { name: "Python", Icon: SiPython },
    { name: "Django", Icon: SiDjango },
  ],
  [
    { name: "MySql", Icon: Database },
    { name: "MongoDB", Icon: Database },
  ],
  [
    { name: "Eclipse", Icon: Code2 },
    { name: "CI/CD", Icon: Workflow },
  ],
];

export default function TechShowcase() {
  const ref = useRef(null);
  const visible = useInView(ref, { margin: "80px" });
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  return (
    <section
      ref={ref}
      className={`tech-showcase ${paused || !visible ? "is-paused" : ""}`}
      aria-labelledby="toolkit-title"
    >
      <div className="container">
        <p id="toolkit-title" className="tech-showcase-title">
          I worked on Tools like...
        </p>
        <div className="tech-logo-wall" aria-hidden="true">
          {columns.map((pair, index) => (
            <div
              className="tech-logo-slot"
              key={pair[0].name}
              style={{ "--slot-delay": `${index * 0.45}s` }}
            >
              {pair.map(({ name, Icon }, variant) => (
                <div
                  className={`tech-logo tech-logo-${variant} ${name === "Generative AI" ? "tech-logo-ai" : ""}`}
                  key={name}
                >
                  <Icon focusable="false" />
                  <span>{name}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <p className="sr-only">
          Technologies:{" "}
          {columns
            .flat()
            .map((t) => t.name)
            .join(", ")}
          .
        </p>
      </div>
    </section>
  );
}
