"use client";

import { useRef, type ReactNode } from "react";
import { gsap, registerGsap, useGSAP } from "@/lib/gsap";
import { MOTION } from "@/lib/motion";
import { usePageReady } from "@/components/motion/PageReadyProvider";

type PopParallaxProps = {
  children: ReactNode;
  className?: string;
  weight?: number;
};

export function PopParallax({
  children,
  className,
  weight = MOTION.storyParallax.weight[1],
}: PopParallaxProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { ready } = usePageReady();
  registerGsap();

  useGSAP(
    () => {
      if (!ready) return;
      const mm = gsap.matchMedia();
      mm.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          mobile: "(max-width: 767px)",
          desktop: "(min-width: 768px)",
        },
        (context) => {
          if (context.conditions?.reduce) return;
          const amplitude = context.conditions?.mobile ? 14 : 26;
          gsap.from(rootRef.current, {
            y: 12,
            duration: MOTION.decorPop.duration,
            ease: MOTION.decorPop.ease,
          });
          gsap.to(rootRef.current, {
            y: amplitude * weight,
            ease: "none",
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: MOTION.storyParallax.scrub,
            },
          });
        },
      );
      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [ready, weight], revertOnUpdate: true },
  );

  return (
    <div ref={rootRef} className={className} aria-hidden="true">
      {children}
    </div>
  );
}
