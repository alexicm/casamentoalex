"use client";

import { useRef } from "react";
import { gsap, registerGsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

type StickyConfirmBarProps = {
  onConfirm: () => void;
};

export function StickyConfirmBar({ onConfirm }: StickyConfirmBarProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  registerGsap();

  useGSAP(
    () => {
      const root = rootRef.current;
      const pill = pillRef.current;
      const hero = document.getElementById("inicio");
      const form = document.getElementById("confirmar");
      if (!root || !pill || !hero || !form) return;

      gsap.set(root, { autoAlpha: 0, y: 18, pointerEvents: "none" });
      gsap.set(pill, { scale: 1, transformOrigin: "center bottom" });

      let shown = false;
      const show = () => {
        if (shown) return;
        shown = true;
        gsap.to(root, {
          autoAlpha: 1,
          y: 0,
          pointerEvents: "auto",
          duration: 0.32,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      const hide = () => {
        if (!shown) return;
        shown = false;
        gsap.to(root, {
          autoAlpha: 0,
          y: 18,
          pointerEvents: "none",
          duration: 0.22,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      const sync = () => {
        const heroBottom = hero.getBoundingClientRect().bottom;
        const formTop = form.getBoundingClientRect().top;
        const vh = window.innerHeight;
        if (heroBottom < vh * 0.64 && formTop > vh * 0.84) show();
        else hide();
      };

      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: sync,
        onRefresh: sync,
      });
      sync();

      if (!prefersReducedMotion()) {
        gsap.to(pill, {
          scale: 0.68,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "bottom 64%",
            end: "+=820",
            scrub: 0.35,
          },
        });
      }
    },
    { dependencies: [] },
  );

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 opacity-0 sm:hidden"
    >
      <div
        ref={pillRef}
        className="mx-auto flex max-w-md justify-center rounded-full bg-burgundy/95 px-2 py-2 shadow-[0_12px_30px_rgba(49,11,20,0.32)] backdrop-blur will-change-transform"
      >
        <button
          type="button"
          onClick={onConfirm}
          className="focus-ring min-h-12 w-full rounded-full text-sm tracking-[0.16em] text-ivory uppercase"
        >
          Confirmar presença
        </button>
      </div>
    </div>
  );
}
