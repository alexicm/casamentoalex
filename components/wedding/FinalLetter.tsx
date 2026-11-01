"use client";

import { BounceButton } from "@/components/motion/BounceButton";
import { MaskImage } from "@/components/motion/MaskImage";
import { WEDDING_ASSETS } from "@/lib/event/defaults";

type FinalLetterProps = {
  onConfirm: () => void;
};

export function FinalLetter({ onConfirm }: FinalLetterProps) {
  return (
    <section className="burgundy-stage relative px-5 pb-32 pt-16 sm:pb-24">
      <div className="section-shell text-center">
        <div className="mx-auto w-[min(70vw,260px)] overflow-hidden rounded-[40%] bg-ivory/10 p-2">
          <MaskImage
            src={WEDDING_ASSETS.embrace}
            alt="Alex e Paloma em aquarela, um último olhar carinhoso"
            width={1086}
            height={1448}
            sizes="260px"
          />
        </div>
        <p className="script-line mt-6 text-3xl text-ivory">Com amor</p>
        <p className="display-title mt-2 text-2xl text-ivory">Alex & Paloma</p>
        <p className="mt-3 text-sm tracking-[0.24em] text-ivory/60">20.12.2026</p>
        <BounceButton variant="ivory" onClick={onConfirm} className="mt-8">
          Confirmar minha presença
        </BounceButton>
      </div>
    </section>
  );
}
