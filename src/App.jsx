import { useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Experience from "./sections/Experience";
import Projects from "./sections/Projects";
import Education from "./sections/Education";
import Contact from "./sections/Contact";
import TechShowcase from "./components/TechShowcase";
import useSectionAtmosphere from "./hooks/useSectionAtmosphere";
import Starfield from "./components/Starfield";
export default function App() {
  useSectionAtmosphere();
  const [active, setActive] = useState("home");
  useEffect(() => {
    let frame;
    const updateActive = () => {
      frame = null;
      const nodes = [...document.querySelectorAll("main section[id]")];
      const current = nodes
        .filter(
          (el) => el.getBoundingClientRect().top <= window.innerHeight * 0.35,
        )
        .at(-1);
      setActive(current?.id || "home");
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(updateActive);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    updateActive();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <MotionConfig reducedMotion="user">
      <div className="page-atmosphere" aria-hidden="true">
        <span className="atmosphere-wave atmosphere-wave-one" />
        <span className="atmosphere-wave atmosphere-wave-two" />
      </div>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Navbar active={active} />
      <Starfield />
      <main id="main">
        <Hero />
        <TechShowcase />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Education />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  );
}
