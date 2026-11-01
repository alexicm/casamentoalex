"use client";

import { MaskImage } from "@/components/motion/MaskImage";
import { PopParallax } from "@/components/motion/PopParallax";
import { SoftReveal } from "@/components/motion/SoftReveal";
import { SplitScale } from "@/components/motion/SplitScale";
import { StickerBoard } from "@/components/motion/StickerBoard";
import { Foliage } from "@/components/wedding/Foliage";
import { WEDDING_ASSETS } from "@/lib/event/defaults";

export function Story() {
  return (
    <section className="relative px-5 py-16 sm:py-24">
      <PopParallax className="pointer-events-none absolute left-0 top-8 w-36" weight={0.25}>
        <Foliage variant="spray" />
      </PopParallax>
      <div className="section-shell text-center">
        <p className="eyebrow">Algumas histórias</p>
        <SplitScale className="mx-auto mt-4 max-w-md font-serif text-[1.85rem] leading-tight text-burgundy sm:text-4xl">
          ficam ainda mais bonitas quando são compartilhadas.
        </SplitScale>
        <SoftReveal>
          <p className="mx-auto mt-6 max-w-md text-[1rem] leading-relaxed text-ink/80">
            Existem momentos que a gente sonha viver. E existem pessoas que tornam
            esses momentos inesquecíveis. Você faz parte da nossa história e
            queremos dividir esse dia com você.
          </p>
        </SoftReveal>
        <div className="oval-frame mx-auto mt-10 w-[min(78vw,360px)] overflow-hidden bg-ivory p-2">
          <MaskImage
            src={WEDDING_ASSETS.dance}
            alt="Ilustração em aquarela de Alex e Paloma dançando em um campo florido"
            width={1086}
            height={1448}
            sizes="(max-width: 430px) 78vw, 360px"
          />
        </div>
        <StickerBoard note="Você faz parte da nossa história. Esse dia fica mais bonito com você perto." />
      </div>
    </section>
  );
}
