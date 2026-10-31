"use client";

import Image from "next/image";
import { Foliage } from "@/components/wedding/Foliage";
import { WEDDING_ASSETS } from "@/lib/event/defaults";

type FinalLetterProps = {
  onConfirm: () => void;
  alreadyAnswered: boolean;
};

export function FinalLetter({ onConfirm, alreadyAnswered }: FinalLetterProps) {
  return (
    <section className="relative px-5 pb-32 pt-10 sm:pb-24">
      <Foliage className="pointer-events-none absolute right-0 bottom-10 w-40 opacity-60" />
      <div className="section-shell text-center">
        <div className="mx-auto w-[min(70vw,280px)]">
          <Image
            src={WEDDING_ASSETS.embrace}
            alt="Alex e Paloma em aquarela, um último olhar carinhoso"
            width={1086}
            height={1448}
            sizes="280px"
            className="watercolor-blend h-auto w-full"
          />
        </div>
        <p className="script-line mt-6 text-3xl text-wine">Com carinho</p>
        <p className="display-title mt-2 text-2xl text-olive">Alex & Paloma</p>
        <p className="mt-3 text-sm tracking-[0.24em] text-sage">20.12.2026</p>
        {!alreadyAnswered ? (
          <button
            type="button"
            onClick={onConfirm}
            className="ink-button focus-ring mt-8 min-h-12 rounded-full bg-olive px-8 text-sm tracking-[0.16em] text-paper-light uppercase"
          >
            Confirmar minha presença
          </button>
        ) : null}
      </div>
    </section>
  );
}
