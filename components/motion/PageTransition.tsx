"use client";

import { useRef } from "react";
import { gsap, registerGsap, useGSAP } from "@/lib/gsap";
import { MOTION } from "@/lib/motion";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  registerGsap();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".page-veil", {
          yPercent: -18,
          autoAlpha: 0.4,
          duration: MOTION.routeTransition.duration,
          ease: MOTION.routeTransition.ease,
        });
      });
      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="relative">
      <div className="page-veil pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-linear-to-b from-burgundy/40 to-transparent" />
      {children}
    </div>
  );
}
