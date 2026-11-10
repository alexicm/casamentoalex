"use client";

import Link from "next/link";
import Image from "next/image";
import { CalendarAdd } from "@/components/wedding/CalendarAdd";
import { PageTransition } from "@/components/motion/PageTransition";
import { PopParallax } from "@/components/motion/PopParallax";
import { Foliage } from "@/components/wedding/Foliage";
import { WEDDING_ASSETS } from "@/lib/event/defaults";

type ThankYouSceneProps = {
  attending: boolean;
  validated: boolean;
  found: boolean;
};

export function ThankYouScene({ attending, validated, found }: ThankYouSceneProps) {
  const title = !found
    ? "Obrigado por visitar o convite."
    : attending
      ? validated
        ? "Que alegria ter você com a gente."
        : "Resposta recebida."
      : "Vamos sentir sua falta.";

  const body = !found
    ? "Se você acabou de enviar uma resposta, ela já está conosco. Volte ao convite quando quiser reler os detalhes do encontro."
    : attending
      ? validated
        ? "Recebemos sua resposta com muito carinho. Vamos validar sua presença e organizar os lugares com calma."
        : "Recebemos seu aviso com muito carinho. Obrigado por nos contar."
      : "Obrigado por nos contar. Você continua fazendo parte da nossa história.";

  return (
    <PageTransition>
      <main className="paper-bg relative min-h-svh overflow-hidden px-5 py-16">
        <PopParallax className="pointer-events-none absolute -left-8 top-10 w-40" weight={0.3}>
          <Foliage />
        </PopParallax>
        <PopParallax className="pointer-events-none absolute -right-10 bottom-16 w-44" weight={0.7}>
          <Foliage variant="spray" />
        </PopParallax>
        <div className="section-shell relative z-10 text-center">
          <p className="eyebrow">Obrigado</p>
          <h1 className="mt-4 font-serif text-4xl text-burgundy">{title}</h1>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-ink/80">{body}</p>
          {attending && found ? (
            <div className="mx-auto mt-10 w-[min(80vw,360px)]">
              <Image
                src={WEDDING_ASSETS.dance}
                alt="Alex e Paloma dançando em aquarela, em moldura dourada"
                width={736}
                height={736}
                sizes="360px"
                className="h-auto w-full"
              />
            </div>
          ) : null}
          <p className="script-line mt-8 text-3xl text-burgundy">Com amor, Alex & Paloma</p>
          <p className="mt-2 text-xs tracking-[0.24em] text-taupe uppercase">20.12.2026</p>
          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/"
              className="focus-ring mx-auto flex min-h-12 items-center justify-center rounded-full bg-burgundy px-6 text-sm tracking-[0.16em] text-ivory uppercase"
            >
              Voltar ao convite
            </Link>
            {attending && found ? <CalendarAdd className="mx-auto mt-2" /> : null}
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
