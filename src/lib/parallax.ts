/** Drifts `[data-parallax]` elements against the scroll, on a single rAF tick.
 *  Off entirely under reduced motion, and only while the element is on screen. */
export const initParallax = (): void => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
  if (targets.length === 0) return;

  const visible = new Set<HTMLElement>();
  let queued = false;

  const apply = (): void => {
    queued = false;
    for (const target of visible) {
      const rect = target.getBoundingClientRect();
      // -1 at the top of the viewport, 1 at the bottom.
      const progress = (rect.top + rect.height / 2) / window.innerHeight - 0.5;
      target.style.transform = `translate3d(0, ${(progress * 9).toFixed(2)}%, 0)`;
    }
  };

  const onScroll = (): void => {
    if (queued || visible.size === 0) return;
    queued = true;
    window.requestAnimationFrame(apply);
  };

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const element = entry.target as HTMLElement;
      if (entry.isIntersecting) visible.add(element);
      else visible.delete(element);
    }
    onScroll();
  });

  for (const target of targets) observer.observe(target);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  apply();
};
