"use client";

import Image from "next/image";
import { useRef } from "react";
import { Foliage } from "@/components/wedding/Foliage";
import { WEDDING_ASSETS } from "@/lib/event/defaults";
import { gsap, registerGsap, useGSAP } from "@/lib/gsap/register";

export function Story() {
  const rootRef = useRef<HTMLElement>(null);
  registerGsap();

  useGSAP(
    () => {
      gsap.from(".story-copy", {
        autoAlpha: 0,
        y: 24,
        duration: 0.9,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 78%",
        },
      });
      gsap.fromTo(
        ".story-portrait",
        { clipPath: "inset(18% 22% 18% 22% round 40%)", y: 30 },
        {
          clipPath: "inset(0% 0% 0% 0% round 0%)",
          y: 0,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".story-portrait",
            start: "top 82%",
          },
        },
      );
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className="relative px-5 py-16 sm:py-24">
      <Foliage
        variant="spray"
        className="pointer-events-none absolute left-0 top-8 w-36 opacity-70"
      />
      <div className="section-shell text-center">
        <p className="story-copy eyebrow">Algumas histórias</p>
        <h2 className="story-copy mx-auto mt-4 max-w-md font-serif text-[1.85rem] leading-tight text-olive sm:text-4xl">
          ficam ainda mais bonitas quando são compartilhadas.
        </h2>
        <p className="story-copy mx-auto mt-6 max-w-md text-[1rem] leading-relaxed text-ink/80">
          Existem momentos que a gente sonha viver. E existem pessoas que tornam
          esses momentos inesquecíveis. Você faz parte da nossa história e
          queremos dividir esse dia com você.
        </p>
        <div className="story-portrait relative mx-auto mt-10 w-[min(88vw,460px)]">
          <Image
            src={WEDDING_ASSETS.dance}
            alt="Ilustração em aquarela de Alex e Paloma dançando em um campo florido"
            width={1086}
            height={1448}
            sizes="(max-width: 430px) 88vw, 460px"
            className="watercolor-blend h-auto w-full"
          />
        </div>
      </div>
    </section>
  );
}
