"use client";

import Image from "next/image";
import { useId, useRef } from "react";
import { gsap, registerGsap, useGSAP } from "@/lib/gsap";
import { MOTION } from "@/lib/motion";
import { usePageReady } from "@/components/motion/PageReadyProvider";

type MaskImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
  sizes?: string;
};

export function MaskImage({
  src,
  alt,
  width,
  height,
  priority,
  className,
  sizes,
}: MaskImageProps) {
  const clipId = useId().replace(/:/g, "");
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
          motion: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          if (context.conditions?.reduce) return;
          gsap.fromTo(
            rootRef.current,
            { y: 16 },
            {
              y: 0,
              duration: MOTION.maskReveal.duration,
              ease: MOTION.maskReveal.ease,
              scrollTrigger: {
                trigger: rootRef.current,
                start: "top 86%",
              },
            },
          );
        },
      );
      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [ready, clipId], revertOnUpdate: true },
  );

  return (
    <div ref={rootRef} className={className}>
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id={`mask-${clipId}`} clipPathUnits="objectBoundingBox">
            <ellipse cx="0.48" cy="0.5" rx="0.48" ry="0.56" transform="rotate(-6 0.48 0.5)" />
            <ellipse cx="0.54" cy="0.52" rx="0.42" ry="0.5" transform="rotate(10 0.54 0.52)" />
          </clipPath>
        </defs>
      </svg>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes}
        className="watercolor-blend h-auto w-full"
        style={{ clipPath: `url(#mask-${clipId})` }}
      />
    </div>
  );
}
