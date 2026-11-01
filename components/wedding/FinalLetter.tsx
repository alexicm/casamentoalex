"use client";

import Image from "next/image";
import { BounceButton } from "@/components/motion/BounceButton";
import { WEDDING_ASSETS } from "@/lib/event/defaults";

type FinalLetterProps = {
  onConfirm: () => void;
};

export function FinalLetter({ onConfirm }: FinalLetterProps) {
  return (
    <section className="burgundy-stage relative px-5 pb-32 pt-16 sm:pb-24">
      <div className="section-shell text-center">
        <div className="mx-auto w-[min(88vw,420px)]">
          <Image
            src={WEDDING_ASSETS.family}
            alt="Retrato em aquarela da família, em moldura de madeira"
            width={1024}
            height={576}
            sizes="(max-width: 430px) 88vw, 420px"
            className="h-auto w-full"
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
