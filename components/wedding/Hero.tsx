"use client";

import { useRef } from "react";
import { BounceButton } from "@/components/motion/BounceButton";
import { PopParallax } from "@/components/motion/PopParallax";
import { usePageReady } from "@/components/motion/PageReadyProvider";
import { Foliage } from "@/components/wedding/Foliage";
import { HeroWindow } from "@/components/wedding/HeroWindow";
import { gsap, registerGsap, useGSAP } from "@/lib/gsap";
import { MOTION } from "@/lib/motion";

type HeroProps = {
  onConfirm: () => void;
  onDiscover: () => void;
};

export function Hero({ onConfirm, onDiscover }: HeroProps) {
  const rootRef = useRef<HTMLElement>(null);
  const { markReady } = usePageReady();
  registerGsap();

  useGSAP(
    () => {
      markReady();
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".hero-name", {
          y: 14,
          duration: MOTION.titleEnter.duration,
          ease: MOTION.titleEnter.ease,
        });
        gsap.from(".hero-copy", {
          y: 10,
          duration: 1.1,
          stagger: MOTION.stagger,
          delay: 0.15,
          ease: "power2.out",
        });
        gsap.to(".hero-leaf", {
          y: 10,
          rotation: 2.5,
          duration: MOTION.breath.duration,
          ease: MOTION.breath.ease,
          yoyo: true,
          repeat: -1,
          stagger: 0.55,
        });
      });
      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      id="inicio"
      className="relative isolate px-5 pb-20 pt-[max(1.75rem,env(safe-area-inset-top))]"
    >
      <PopParallax className="pointer-events-none absolute -left-10 top-6 w-40 sm:w-52" weight={0.12}>
        <div className="hero-leaf">
          <Foliage />
        </div>
      </PopParallax>
      <PopParallax className="pointer-events-none absolute -right-10 bottom-16 w-44 rotate-180 sm:w-56" weight={0.28}>
        <div className="hero-leaf">
          <Foliage />
        </div>
      </PopParallax>

      <div className="section-shell relative z-10 flex min-h-[calc(100svh-2rem)] flex-col items-center justify-center text-center">
        <p className="hero-copy eyebrow mb-3">Um encontro</p>
        <h1 className="hero-name display-title text-[clamp(2.6rem,11vw,4.8rem)] text-burgundy">
          Alex
          <span className="mx-1 inline-block font-serif text-[0.62em] italic font-normal tracking-normal text-terracotta">
            &
          </span>
          Paloma
        </h1>
        <p className="hero-copy mt-3 text-[0.72rem] tracking-[0.28em] text-olive uppercase">
          20 de dezembro de 2026
        </p>

        <HeroWindow onOpened={markReady} />
      </div>

      <div className="section-shell relative z-10 flex flex-col items-center text-center">
        <p className="hero-copy mt-7 max-w-[24rem] font-serif text-2xl leading-snug text-ink sm:text-[1.7rem]">
          Mais do que um casamento, um encontro.
        </p>
        <p className="hero-copy mt-3 max-w-[28rem] text-[0.98rem] leading-relaxed text-ink/80">
          Não queremos reunir pessoas para testemunhar um casamento. Queremos
          reunir as pessoas que amamos para celebrar uma história que já estamos
          vivendo. Vocês fazem parte disso!
        </p>

        <div className="hero-copy mt-7 flex w-full max-w-sm flex-col gap-3">
          <BounceButton onClick={onConfirm}>Confirmar minha presença</BounceButton>
          <BounceButton variant="ghost" onClick={onDiscover}>
            Descobrir o encontro
          </BounceButton>
        </div>
      </div>
    </section>
  );
}
