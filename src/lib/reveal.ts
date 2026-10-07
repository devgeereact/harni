/** Reveals `[data-reveal]` elements once, in document order, with a short stagger.
 *  Nothing is hidden until we know the observer exists, so a failed script or an
 *  old browser leaves the page fully readable. */
export const initReveal = (): (() => void) | undefined => {
  const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
  if (targets.length === 0) return;

  if (
    !('IntersectionObserver' in window) ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    for (const target of targets) target.classList.add('is-revealed');
    return;
  }

  for (const target of targets) target.classList.add('is-armed');

  const observer = new IntersectionObserver(
    (entries) => {
      // Stagger by position within the batch rather than by index in the page,
      // so a group scrolled into view together cascades naturally.
      let delay = 0;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const element = entry.target as HTMLElement;
        element.style.setProperty('--reveal-delay', `${delay}ms`);
        element.classList.add('is-revealed');
        observer.unobserve(element);
        delay += 90;
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.15 },
  );

  for (const target of targets) observer.observe(target);
  return () => observer.disconnect();
};
