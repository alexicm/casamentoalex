"use client";

import Image from "next/image";
import { useRef } from "react";
import { Foliage } from "@/components/wedding/Foliage";
import { WEDDING_ASSETS } from "@/lib/event/defaults";
import { gsap, registerGsap, useGSAP } from "@/lib/gsap/register";

type HeroProps = {
  onConfirm: () => void;
  onDiscover: () => void;
};

export function Hero({ onConfirm, onDiscover }: HeroProps) {
  const rootRef = useRef<HTMLElement>(null);
  registerGsap();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
          motion: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const reduceMotion = Boolean(context.conditions?.reduceMotion);
          if (reduceMotion) return;

          const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
          tl.from(".hero-leaf", {
            autoAlpha: 0,
            rotation: 8,
            y: 18,
            duration: 1.1,
            stagger: 0.12,
          })
            .fromTo(
              ".hero-portrait",
              { clipPath: "inset(38% 28% 38% 28% round 48%)", scale: 1.06 },
              { clipPath: "inset(0% 0% 0% 0% round 0%)", scale: 1, duration: 1.45 },
              "-=0.7",
            )
            .from(
              ".hero-name",
              { autoAlpha: 0, y: 18, duration: 0.7, stagger: 0.08 },
              "-=0.55",
            )
            .from(
              ".hero-copy",
              { autoAlpha: 0, y: 14, duration: 0.6, stagger: 0.08 },
              "-=0.25",
            );
        },
      );
      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      className="relative isolate flex min-h-svh flex-col justify-center overflow-hidden px-5 pb-24 pt-[max(2.5rem,env(safe-area-inset-top))]"
    >
      <Foliage className="hero-leaf pointer-events-none absolute -left-10 top-8 w-44 opacity-80 sm:w-56" />
      <Foliage className="hero-leaf pointer-events-none absolute -right-12 bottom-24 w-52 rotate-180 opacity-70 sm:w-64" />
      <Foliage
        variant="spray"
        className="hero-leaf pointer-events-none absolute right-6 top-24 w-28 opacity-70"
      />

      <div className="section-shell relative z-10 flex flex-col items-center text-center">
        <p className="hero-name eyebrow mb-5">Um dia para guardar na memória</p>
        <h1 className="hero-name display-title text-[clamp(2.4rem,10vw,4.6rem)] text-olive">
          Alex
          <span className="mx-2 inline-block font-script text-[0.55em] normal-case tracking-normal text-terracotta">
            &
          </span>
          Paloma
        </h1>

        <div className="hero-portrait relative mx-auto mt-6 w-[min(86vw,420px)] will-change-transform">
          <div className="absolute inset-6 -z-10 rounded-[40%] bg-sage/30 blur-2xl" />
          <Image
            src={WEDDING_ASSETS.embrace}
            alt="Ilustração em aquarela de Alex e Paloma sorrindo um para o outro"
            width={1086}
            height={1448}
            priority
            sizes="(max-width: 430px) 86vw, 420px"
            className="watercolor-blend h-auto w-full select-none"
          />
        </div>

        <p className="hero-copy mt-7 max-w-[22rem] font-serif text-2xl leading-snug text-ink sm:text-[1.7rem]">
          Nossa história fica ainda mais bonita com você.
        </p>
        <p className="hero-copy mt-4 max-w-[28rem] text-[0.98rem] leading-relaxed text-olive/90">
          No dia 20 de dezembro, vamos celebrar o amor e reunir pessoas que
          fazem parte da nossa história. Você é uma delas, e queremos muito ter
          você por perto.
        </p>
        <p className="hero-copy mt-5 font-serif text-xl tracking-[0.28em] text-olive">
          20.12.2026
        </p>

        <div className="hero-copy mt-8 flex w-full max-w-sm flex-col gap-3">
          <button
            type="button"
            onClick={onConfirm}
            className="ink-button focus-ring min-h-12 rounded-full bg-wine px-6 text-sm tracking-[0.16em] text-paper-light uppercase"
          >
            Confirmar minha presença
          </button>
          <button
            type="button"
            onClick={onDiscover}
            className="focus-ring min-h-12 rounded-full border border-olive/25 px-6 text-sm tracking-[0.12em] text-olive uppercase"
          >
            Descobrir nosso grande dia
          </button>
        </div>

        <p className="hero-copy mt-8 text-[0.7rem] tracking-[0.28em] text-sage uppercase">
          Deslize com calma
        </p>
      </div>
    </section>
  );
}
