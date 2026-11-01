import { useEffect } from 'react';

export default function useSectionAtmosphere() {
  useEffect(() => {
    const sections = [...document.querySelectorAll('main > section')];
    const layers = [...document.querySelectorAll('.atmosphere-color')];
    let centers = [];
    let frame = null;
    let viewportWidth = window.innerWidth;
    // Ignore toolbar-only viewport height changes while a phone is scrolling.
    let focusHeight = window.innerHeight;
    const update = () => {
      frame = null;
      const focus = window.scrollY + focusHeight * .46;
      let index = centers.findIndex(center => center >= focus);
      if (index < 0) index = sections.length - 1;
      const previous = Math.max(0, index - 1);
      const distance = centers[index] - centers[previous];
      const progress = distance > 0 ? Math.min(1, Math.max(0, (focus - centers[previous]) / distance)) : 0;
      const blend = progress * progress * (3 - 2 * progress);
      // Crossfade cached backgrounds without changing content or global styles.
      layers.forEach((layer, i) => {
        const opacity = i === previous ? 1 : i === index ? blend : 0;
        const next = opacity.toFixed(3);
        if (layer.style.opacity !== next) layer.style.opacity = next;
      });
    };
    const schedule = () => { if (frame === null) frame = requestAnimationFrame(update); };
    const measure = () => {
      centers = sections.map(section => {
        const rect = section.getBoundingClientRect();
        return window.scrollY + rect.top + rect.height / 2;
      });
      schedule();
    };
    const resize = () => {
      if (window.innerWidth !== viewportWidth) {
        viewportWidth = window.innerWidth;
        focusHeight = window.innerHeight;
        measure();
      }
    };
    const observer = new ResizeObserver(measure);
    sections.forEach(section => observer.observe(section));
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', resize);
    measure();
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', resize);
      observer.disconnect();
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);
}
