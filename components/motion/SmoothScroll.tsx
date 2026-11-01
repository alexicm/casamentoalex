"use client";

import { useEffect } from "react";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function SmoothScroll() {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    registerGsap();
    let cancelled = false;
    let cleanup = () => undefined;

    void import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      const lenis = new Lenis({
        autoRaf: false,
        duration: 0.86,
        wheelMultiplier: 0.82,
        touchMultiplier: 0.9,
      });
      const onTick = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(onTick);
      gsap.ticker.lagSmoothing(0);
      lenis.on("scroll", ScrollTrigger.update);
      cleanup = () => {
        gsap.ticker.remove(onTick);
        lenis.destroy();
      };
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [reduceMotion]);

  return null;
}
