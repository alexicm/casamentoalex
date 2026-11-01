"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap, registerGsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { WEDDING_ASSETS } from "@/lib/event/defaults";
import { MOTION, persistEnvelopeOpened, prefersReducedMotion } from "@/lib/motion";

type HeroWindowProps = {
  onOpened?: () => void;
};

export function HeroWindow({ onOpened }: HeroWindowProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const openedRef = useRef(false);
  const [opened, setOpened] = useState(false);
  registerGsap();

  function finishOpen() {
    if (openedRef.current) return;
    openedRef.current = true;
    setOpened(true);
    persistEnvelopeOpened();
    onOpened?.();
  }

  function breathe() {
    gsap.to(".hero-portrait", {
      yPercent: 2.4,
      duration: MOTION.breath.duration,
      ease: MOTION.breath.ease,
      yoyo: true,
      repeat: -1,
    });
  }

  function playOpen() {
    const timeline = timelineRef.current;
    const trigger = timeline?.scrollTrigger;
    if (prefersReducedMotion() || !timeline || !trigger) {
      gsap.set(".hero-shutter-left", { rotateY: -78 });
      gsap.set(".hero-shutter-right", { rotateY: 78 });
      gsap.set(".hero-latch", { autoAlpha: 0 });
      gsap.set(".hero-portrait", { scale: 1.45, autoAlpha: 1 });
      finishOpen();
      return;
    }
    gsap.to(window, {
      duration: 1.2,
      scrollTo: trigger.end,
      ease: "power2.out",
    });
  }

  useGSAP(
    () => {
      const trigger = rootRef.current;
      if (!trigger) return;

      gsap.set(".hero-shutter-left", {
        rotateY: 0,
        transformPerspective: 1600,
        transformOrigin: "left center",
      });
      gsap.set(".hero-shutter-right", {
        rotateY: 0,
        transformPerspective: 1600,
        transformOrigin: "right center",
      });
      gsap.set(".hero-portrait", { scale: 1.18, autoAlpha: 0.4 });
      gsap.set(".hero-latch", { autoAlpha: 1, y: 0 });
      gsap.set(".hero-glow", { autoAlpha: 0 });

      if (prefersReducedMotion()) {
        gsap.set(".hero-shutter-left", { rotateY: -78 });
        gsap.set(".hero-shutter-right", { rotateY: 78 });
        gsap.set(".hero-latch", { autoAlpha: 0 });
        gsap.set(".hero-portrait", { scale: 1.45, autoAlpha: 1 });
        finishOpen();
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "none", force3D: true },
        scrollTrigger: {
          trigger,
          start: 0,
          end: () => Math.max(140, Math.round(window.innerHeight * 0.18)),
          scrub: 0.28,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (self.progress >= 0.88) {
              finishOpen();
            } else if (openedRef.current && self.progress < 0.7) {
              openedRef.current = false;
              setOpened(false);
            }
          },
          onLeave: () => finishOpen(),
        },
      });

      tl.to(".hero-latch", { autoAlpha: 0, y: 8, duration: 0.12 }, 0)
        .to(".hero-shutter-left", { rotateY: -78, duration: 0.88 }, 0.02)
        .to(".hero-shutter-right", { rotateY: 78, duration: 0.88 }, 0.04)
        .to(".hero-portrait", { scale: 1.45, autoAlpha: 1, duration: 0.8 }, 0.04)
        .to(".hero-glow", { autoAlpha: 0.55, duration: 0.35 }, 0.1);

      timelineRef.current = tl;

      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      return () => {
        window.removeEventListener("load", refresh);
        timelineRef.current = null;
      };
    },
    { scope: rootRef, dependencies: [] },
  );

  useGSAP(
    () => {
      if (!opened || prefersReducedMotion()) return;
      breathe();
    },
    { scope: rootRef, dependencies: [opened] },
  );

  return (
    <div ref={rootRef} className="hero-window-scene relative mx-auto mt-5 w-[min(88vw,420px)]">
      <button
        type="button"
        onClick={playOpen}
        aria-expanded={opened}
        aria-label={opened ? "Janela do convite aberta" : "Abrir a janela do convite"}
        className="focus-ring relative block w-full border-0 bg-transparent p-0"
      >
        <div className="hero-window-frame relative bg-[#efe4d0] shadow-[0_28px_50px_rgba(49,11,20,0.22)]">
          <div className="hero-glow pointer-events-none absolute inset-6 z-10 rounded-full bg-[#fbf6ee]/25 opacity-0" />
          <div className="relative h-[min(62svh,540px)] overflow-hidden rounded-[166px_166px_4px_4px]">
            <Image
              src={WEDDING_ASSETS.embrace}
              alt="Ilustração em aquarela de Alex e Paloma sorrindo um para o outro"
              width={1086}
              height={1448}
              priority
              sizes="(max-width: 430px) 88vw, 420px"
              className="hero-portrait watercolor-blend h-full w-full object-cover object-[50%_30%] will-change-transform"
            />
          </div>

          <div className="hero-shutter-left hero-shutter absolute inset-y-0 left-0 z-[2] w-1/2 will-change-transform">
            <ShutterFace side="left" />
          </div>
          <div className="hero-shutter-right hero-shutter absolute inset-y-0 right-0 z-[2] w-1/2 will-change-transform">
            <ShutterFace side="right" />
          </div>

          <div className="hero-latch pointer-events-none absolute top-1/2 left-1/2 z-20 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-burgundy text-ivory shadow-[0_8px_16px_rgba(49,11,20,0.28)]">
            <span className="font-script text-xl leading-none">A&P</span>
          </div>
        </div>
        <div className="mx-auto h-3 w-[92%] rounded-b-[10px] bg-[#d8c7b6] shadow-[0_10px_16px_rgba(49,11,20,0.12)]" />
      </button>
      {!opened ? (
        <p className="mt-3 text-center text-[0.7rem] tracking-[0.2em] text-olive uppercase">
          Role para a janela se abrir
        </p>
      ) : null}
    </div>
  );
}

function ShutterFace({ side }: { side: "left" | "right" }) {
  return (
    <div
      className={`flex h-full w-full flex-col justify-between border-[#c4b39d] bg-[#efe6d4] ${
        side === "left" ? "border-r" : "border-l"
      }`}
    >
      <div className="m-2 flex-1 rounded-[6px] border border-[#d8c7b6]/80 bg-[#f7efe3]/80" />
      <div className="mx-2 mb-2 flex-1 rounded-[6px] border border-[#d8c7b6]/80 bg-[#f7efe3]/80" />
    </div>
  );
}
