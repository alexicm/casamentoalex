"use client";

import { useSyncExternalStore } from "react";

type Viewport = {
  width: number;
  height: number;
  isMobile: boolean;
};

let cached: Viewport = { width: 390, height: 844, isMobile: true };

function subscribe(onChange: () => void) {
  const update = () => {
    const next = {
      width: window.innerWidth,
      height: window.innerHeight,
      isMobile: window.innerWidth < 768,
    };
    if (
      next.width !== cached.width ||
      next.height !== cached.height ||
      next.isMobile !== cached.isMobile
    ) {
      cached = next;
    }
    onChange();
  };
  window.addEventListener("resize", update);
  window.addEventListener("orientationchange", update);
  return () => {
    window.removeEventListener("resize", update);
    window.removeEventListener("orientationchange", update);
  };
}

function getSnapshot() {
  if (typeof window === "undefined") return cached;
  const next = {
    width: window.innerWidth,
    height: window.innerHeight,
    isMobile: window.innerWidth < 768,
  };
  if (
    next.width !== cached.width ||
    next.height !== cached.height ||
    next.isMobile !== cached.isMobile
  ) {
    cached = next;
  }
  return cached;
}

export function useViewport() {
  return useSyncExternalStore(subscribe, getSnapshot, () => cached);
}
