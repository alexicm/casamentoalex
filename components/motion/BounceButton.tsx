"use client";

import { useRef, type ButtonHTMLAttributes } from "react";
import { gsap, registerGsap, useGSAP } from "@/lib/gsap";
import { MOTION } from "@/lib/motion";

type BounceButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "wine" | "ivory" | "ghost";
};

export function BounceButton({
  children,
  className = "",
  variant = "wine",
  type = "button",
  ...props
}: BounceButtonProps) {
  const rootRef = useRef<HTMLButtonElement>(null);
  registerGsap();

  useGSAP(
    (_context, contextSafe) => {
      const button = rootRef.current;
      if (!button || !contextSafe) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference) and (hover: hover)", () => {
        const enter = contextSafe(() => {
          gsap.to(button, {
            scale: MOTION.buttonHover.scale,
            duration: MOTION.buttonHover.duration,
            ease: MOTION.buttonHover.ease,
          });
        });
        const leave = contextSafe(() => {
          gsap.to(button, { scale: 1, duration: 0.35, ease: "power2.out" });
        });
        button.addEventListener("pointerenter", enter);
        button.addEventListener("pointerleave", leave);
        return () => {
          button.removeEventListener("pointerenter", enter);
          button.removeEventListener("pointerleave", leave);
        };
      });
      return () => mm.revert();
    },
    { scope: rootRef },
  );

  const palette =
    variant === "ivory"
      ? "bg-ivory text-burgundy"
      : variant === "ghost"
        ? "border border-line bg-transparent text-burgundy"
        : "bg-burgundy text-ivory";

  return (
    <button
      ref={rootRef}
      type={type}
      className={`ink-button focus-ring min-h-12 rounded-full px-6 text-sm tracking-[0.16em] uppercase disabled:opacity-60 ${palette} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
