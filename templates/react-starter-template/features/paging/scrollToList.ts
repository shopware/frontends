export function scrollToList(target: HTMLElement | null): void {
  if (!target) return;
  const top = target.getBoundingClientRect().top;
  if (top >= 0 && top <= document.documentElement.clientHeight) return;
  const reducedMotion = window.matchMedia?.(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  target.scrollIntoView?.({
    behavior: reducedMotion ? "auto" : "smooth",
    block: "start",
  });
}
