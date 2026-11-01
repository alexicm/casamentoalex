export const MOTION = {
  stickerEnter: { duration: 0.7, ease: "power2.out" },
  titleEnter: { duration: 1.35, ease: "power2.out", stagger: 0.09 },
  decorPop: { duration: 1.4, ease: "sine.out" },
  buttonHover: { duration: 0.4, ease: "power2.out", scale: 1.03 },
  maskReveal: { duration: 1.6, ease: "power2.out" },
  routeTransition: { duration: 0.7, ease: "power2.inOut" },
  storyParallax: { scrub: 0.8, weight: [0.12, 0.22, 0.34] as const },
  stagger: 0.12,
  window: { duration: 1.85, ease: "power2.inOut" },
  breath: { duration: 6.5, ease: "sine.inOut" },
} as const;

export const ENVELOPE_SESSION_KEY = "wedding-window-opened";

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function readEnvelopeOpened() {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(ENVELOPE_SESSION_KEY) === "true";
  } catch {
    return false;
  }
}

export function persistEnvelopeOpened() {
  try {
    window.sessionStorage.setItem(ENVELOPE_SESSION_KEY, "true");
  } catch {
    /* private mode */
  }
}
