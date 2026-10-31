import { useEffect } from 'react';

// Lighter midnight colors keep the section changes visible behind readable content.
const palette = [
  [20, 37, 60], [40, 31, 65], [17, 58, 56], [45, 30, 70],
  [21, 45, 73], [64, 29, 54], [57, 46, 27], [17, 57, 48],
];
const glowPalette = [
  [113, 185, 248], [183, 150, 245], [106, 225, 204], [188, 149, 249],
  [111, 183, 247], [242, 151, 204], [235, 201, 126], [111, 227, 189],
];

export default function useSectionAtmosphere() {
  useEffect(() => {
    const nodes = [...document.querySelectorAll('main > section')];
    const root = document.documentElement;
    let frame = null;
    const update = () => {
      frame = null;
      const focus = window.innerHeight * .46;
      const centers = nodes.map(el => {
        const rect = el.getBoundingClientRect();
        return rect.top + rect.height / 2;
      });
      let index = centers.findIndex(center => center >= focus);
      if (index < 0) index = nodes.length - 1;
      const previous = Math.max(0, index - 1);
      const distance = centers[index] - centers[previous];
      const progress = distance > 0 ? Math.min(1, Math.max(0, (focus - centers[previous]) / distance)) : 0;
      const blend = progress * progress * (3 - 2 * progress);
      const from = palette[previous] || palette[0];
      const to = palette[index] || palette[palette.length - 1];
      root.style.setProperty('--ambient-color', from.map((channel, i) => (channel + (to[i] - channel) * blend).toFixed(2)).join(' '));
      const glowFrom = glowPalette[previous] || glowPalette[0];
      const glowTo = glowPalette[index] || glowPalette[glowPalette.length - 1];
      root.style.setProperty('--ambient-glow', glowFrom.map((channel, i) => (channel + (glowTo[i] - channel) * blend).toFixed(2)).join(' '));
      let active = 0;
      let nearest = Infinity;
      nodes.forEach((el, i) => {
        const distanceToCenter = Math.abs(centers[i] - focus);
        if (distanceToCenter < nearest) { nearest = distanceToCenter; active = i; }
      });
      nodes.forEach((el, i) => el.classList.toggle('atmosphere-active', i === active));
    };
    const schedule = () => { if (frame === null) frame = requestAnimationFrame(update); };
    const resizeObserver = new ResizeObserver(schedule);
    nodes.forEach(el => resizeObserver.observe(el));
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      resizeObserver.disconnect();
      if (frame !== null) cancelAnimationFrame(frame);
      root.style.removeProperty('--ambient-color');
      root.style.removeProperty('--ambient-glow');
      nodes.forEach(el => el.classList.remove('atmosphere-active'));
    };
  }, []);
}
