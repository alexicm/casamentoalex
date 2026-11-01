"use client";

import { useRef, type ReactNode } from "react";
import { gsap, registerGsap, useGSAP } from "@/lib/gsap";
import { usePageReady } from "@/components/motion/PageReadyProvider";

type SoftRevealProps = {
  children: ReactNode;
  className?: string;
};

export function SoftReveal({ children, className }: SoftRevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { ready } = usePageReady();
  registerGsap();

  useGSAP(
    () => {
      if (!ready) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(rootRef.current, {
          y: 18,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 88%",
          },
        });
      });
      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [ready], revertOnUpdate: true },
  );

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  );
}
