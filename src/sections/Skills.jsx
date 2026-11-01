import { Component, Suspense, lazy, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  Cable,
  Code2,
  AppWindow,
  BrainCircuit,
  Bot,
  Check,
  Database,
  Eye,
  KeyRound,
  Paintbrush,
  Workflow,
} from "lucide-react";
import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiReact,
  SiPython,
  SiNodedotjs,
  SiSpringboot,
  SiDjango,
  SiMysql,
  SiMongodb,
  SiDocker,
  SiQt,
  SiElectron,
  SiAndroid,
  SiXml,
  SiJson,
  SiKubernetes,
  SiGit,
} from "react-icons/si";
import { FaAws, FaJava, FaFileExcel } from "react-icons/fa";
import {
  constructionStages,
  skillEquivalents,
} from "../data/constructionSkills";
import "../styles/skills-construction.css";

const HouseConstruction = lazy(() => import("../canvas/HouseConstruction"));
const stageIcons = [Paintbrush, Cable, Database, KeyRound];
const stages = constructionStages.map((stage, index) => ({
  ...stage,
  Icon: stageIcons[index],
}));
const techIcons = {
  HTML: SiHtml5,
  CSS: SiCss,
  JavaScript: SiJavascript,
  React: SiReact,
  GWT: Code2,
  NiceGUI: AppWindow,
  Pyqt: SiQt,
  Swing: FaJava,
  Electron: SiElectron,
  ReactNative: SiReact,
  Android: SiAndroid,
  Flet: AppWindow,
  Java: FaJava,
  Python: SiPython,
  "Node.js": SiNodedotjs,
  "Spring Boot": SiSpringboot,
  Django: SiDjango,
  GenAi: BrainCircuit,
  AgenticAi: Bot,
  MySQL: SiMysql,
  MongoDB: SiMongodb,
  Excel: FaFileExcel,
  XMLS: SiXml,
  JSON: SiJson,
  "AWS EC2": FaAws,
  Docker: SiDocker,
  Kubernetes: SiKubernetes,
  git: SiGit,
  "CI/CD": Workflow,
};

class HouseBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="build-fallback">
        <span>⌂</span>
        <p>The same care, from the first brick to the final key.</p>
      </div>
    ) : (
      this.props.children
    );
  }
}

export default function Skills() {
  const section = useRef(null);
  const workspace = useRef(null);
  const progress = useRef(0);
  const invalidateRef = useRef(null);
  const meter = useRef(null);
  const progressText = useRef(null);
  const swipe = useRef(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [partIndex, setPartIndex] = useState(0);
  const [inspect, setInspect] = useState(null);
  const [completed, setCompleted] = useState(false);
  useEffect(() => {
    setInspect(null);
  }, [active]);

  useEffect(() => {
    let frame = null;
    const update = () => {
      frame = null;
      const rect = section.current.getBoundingClientRect();
      const range = Math.max(1, rect.height - window.innerHeight);
      const value = Math.min(1, Math.max(0, -rect.top / range));
      if (value === progress.current) return;
      progress.current = value;
      if (meter.current) meter.current.style.transform = `scaleX(${value})`;
      if (progressText.current)
        progressText.current.textContent = `${Math.round(value * 100)
          .toString()
          .padStart(2, "0")}%`;
      setActive(Math.min(3, Math.floor(value * 4)));
      setPartIndex(Math.min(39, Math.floor(value * 40)));
      setCompleted(value >= 0.997);
      invalidateRef.current?.();
    };
    const schedule = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(section.current);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const horizontalScroll = (event) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      window.scrollBy({ top: event.deltaX * 2, behavior: "instant" });
    };
    const workspaceNode = workspace.current;
    workspaceNode.addEventListener("wheel", horizontalScroll, {
      passive: false,
    });
    update();
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      workspaceNode.removeEventListener("wheel", horizontalScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  const goTo = (index) => {
    const node = section.current;
    const range = node.offsetHeight - window.innerHeight;
    const target = (index + 0.998) / 4;
    window.scrollTo({
      top: window.scrollY + node.getBoundingClientRect().top + range * target,
      behavior: reduced ? "instant" : "smooth",
    });
  };
  const goToPart = (stageIndex, itemIndex) => {
    const node = section.current;
    const target = (stageIndex * 10 + itemIndex + 0.95) / 40;
    window.scrollTo({
      top:
        window.scrollY +
        node.getBoundingClientRect().top +
        (node.offsetHeight - window.innerHeight) * target,
      behavior: reduced ? "instant" : "smooth",
    });
  };
  const cutaway = inspect ?? (active === 1 || active === 2);
  const currentItem = stages[active].items[partIndex % 10];

  return (
    <section
      id="skills"
      className="build-section"
      ref={section}
      aria-labelledby="build-title"
    >
      <div className="build-sticky">
        <div className="build-shell">
          <header className="build-heading">
            <div>
              <div className="section-label">02 / MY TOOLKIT</div>
              <h2 id="build-title">
                My Software development skills are like
                <br />
                <em>the skills needed to build a house.</em>
              </h2>
            </div>
            <p>Scroll to build every layer.</p>
          </header>
          <div className="build-workspace" ref={workspace}>
            <div
              className="build-copy-window"
              aria-label="Construction stages"
              onPointerDown={(e) => {
                swipe.current = { x: e.clientX, y: e.clientY };
              }}
              onPointerUp={(e) => {
                if (!swipe.current) return;
                const dx = e.clientX - swipe.current.x;
                const dy = e.clientY - swipe.current.y;
                if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy))
                  goTo(Math.max(0, Math.min(3, active + (dx < 0 ? 1 : -1))));
                swipe.current = null;
              }}
            >
              <div
                className="build-copy-track"
                style={{ transform: `translateX(-${active * 25}%)` }}
              >
                {stages.map((stage, index) => {
                  return (
                    <article
                      className="build-copy"
                      key={stage.name}
                      aria-hidden={active !== index}
                      style={{ "--build-accent": stage.color }}
                    >
                      <div className="build-chapter">
                        <stage.Icon size={17} />
                        <span>
                          0{index + 1} / {stage.name.toUpperCase()}
                        </span>
                      </div>
                      <p className="build-subtitle">{stage.subtitle}</p>
                      <h3>{stage.title}</h3>
                      <p className="build-description">{stage.description}</p>
                      <p className="build-list-label">SOFTWARE EQUIVALENTS</p>
                      <div
                        className="build-equivalents"
                        aria-label={`${stage.name} software equivalents`}
                        tabIndex={active === index ? 0 : -1}
                      >
                        {skillEquivalents[stage.id].map((name) => {
                          // A newly added technology must never crash the page.
                          const Icon = techIcons[name] || Code2;
                          return (
                            <span key={name}>
                              <Icon aria-hidden="true" />
                              <span>{name}</span>
                            </span>
                          );
                        })}
                      </div>
                      <div className="build-list-label build-parts-heading">
                        <span>HOUSE COMPONENTS</span>
                        <span>10 PARTS / CLICK TO EXPLORE</span>
                      </div>
                      <ol className="build-parts">
                        {stage.items.map((item, itemIndex) => {
                          const globalIndex = index * 10 + itemIndex;
                          return (
                            <li key={item.id}>
                              <button
                                type="button"
                                tabIndex={active === index ? 0 : -1}
                                onClick={() => goToPart(index, itemIndex)}
                                className={`${partIndex === globalIndex ? "is-current" : ""} ${partIndex > globalIndex || completed ? "is-installed" : ""}`}
                                aria-current={
                                  partIndex === globalIndex ? "step" : undefined
                                }
                                title={
                                  item.stores
                                    ? `Stores ${item.stores.toLowerCase()}`
                                    : item.name
                                }
                              >
                                <span>
                                  {partIndex > globalIndex || completed ? (
                                    <Check size={11} />
                                  ) : (
                                    String(itemIndex + 1).padStart(2, "0")
                                  )}
                                </span>
                                {item.name}
                              </button>
                            </li>
                          );
                        })}
                      </ol>
                    </article>
                  );
                })}
              </div>
            </div>
            <div
              className="build-model"
              aria-label={`3D house construction: ${stages[active].name}`}
            >
              <div className="build-plan-grid" aria-hidden="true" />
              <div className="build-drawing-label">
                <span className="build-status-dot" /> LIVE BUILD{" "}
                <span>/ FULL STACK RESIDENCE</span>
              </div>
              <button
                className="build-inspect"
                type="button"
                aria-pressed={cutaway}
                onClick={() => setInspect(!cutaway)}
              >
                <Eye size={14} />
                {cutaway ? "View exterior" : "View inside"}
              </button>
              <HouseBoundary>
                <Suspense
                  fallback={
                    <div className="build-model-placeholder">
                      Laying the foundation…
                    </div>
                  }
                >
                  <HouseConstruction
                    progress={progress}
                    invalidateRef={invalidateRef}
                    reduced={reduced}
                    cutaway={cutaway}
                  />
                </Suspense>
              </HouseBoundary>
              <div className="build-part-caption">
                <span>{String(partIndex + 1).padStart(2, "0")} / 40</span>
                <strong>{currentItem.name}</strong>
                <small>
                  {currentItem.stores
                    ? `Stores ${currentItem.stores.toLowerCase()}`
                    : cutaway
                      ? "CUTAWAY VIEW / INTERNAL SYSTEMS EXPOSED"
                      : stages[active].subtitle}
                </small>
              </div>
              <span className={`build-handover ${completed ? "is-ready" : ""}`}>
                <KeyRound size={15} /> Ready for the real world.
              </span>
            </div>
          </div>
          <div className="build-navigation">
            <div
              className="build-steps"
              role="group"
              aria-label="Jump to a construction stage"
            >
              {stages.map(({ name, Icon }, index) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-pressed={active === index}
                  className={`${active === index ? "is-current" : ""} ${active > index ? "is-built" : ""}`}
                >
                  <span className="build-step-number">0{index + 1}</span>
                  <Icon size={18} />
                  <span>{name}</span>
                  <ArrowRight className="build-step-arrow" size={15} />
                </button>
              ))}
            </div>
            <div className="build-progress">
              <span ref={meter} />
            </div>
            <div className="build-footnote">
              <span>
                <ArrowDown size={13} /> SCROLL TO CONSTRUCT{" "}
                <span className="build-swipe-note"> / SWIPE TO EXPLORE</span>
              </span>
              <span ref={progressText}>00%</span>
              <span>FROM BLUEPRINT TO HANDOVER</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
