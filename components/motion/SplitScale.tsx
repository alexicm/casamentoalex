"use client";

import { useRef, type ReactNode } from "react";
import { gsap, registerGsap, SplitText, useGSAP } from "@/lib/gsap";
import { MOTION } from "@/lib/motion";
import { usePageReady } from "@/components/motion/PageReadyProvider";

type SplitScaleProps = {
  children: ReactNode;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
};

export function SplitScale({ children, as: Tag = "h2", className }: SplitScaleProps) {
  const rootRef = useRef<HTMLHeadingElement | HTMLParagraphElement>(null);
  const { ready } = usePageReady();
  registerGsap();

  useGSAP(
    () => {
      const target = rootRef.current;
      if (!target || !ready) return;
      const mm = gsap.matchMedia();
      mm.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          motion: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          if (context.conditions?.reduce) return;
          document.fonts.ready.then(() => {
            if (!rootRef.current) return;
            const split = SplitText.create(target, {
              type: "lines",
              aria: "auto",
              autoSplit: true,
            });
            gsap.from(split.lines, {
              y: 18,
              duration: MOTION.titleEnter.duration,
              ease: MOTION.titleEnter.ease,
              stagger: MOTION.titleEnter.stagger,
            });
          });
        },
      );
      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [ready], revertOnUpdate: true },
  );

  return (
    <Tag ref={rootRef} className={className}>
      {children}
    </Tag>
  );
}
