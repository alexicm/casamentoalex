"use client";

import { SoftReveal } from "@/components/motion/SoftReveal";
import { SplitScale } from "@/components/motion/SplitScale";

export function GuestWitnesses() {
  return (
    <section id="testemunhas" className="px-5 py-16 sm:py-24">
      <div className="section-shell text-center">
        <p className="eyebrow">A cobertura do dia</p>
        <SplitScale className="mx-auto mt-4 max-w-lg font-serif text-[1.85rem] leading-tight text-burgundy sm:text-4xl">
          Não teremos paparazzi. Teremos vocês!
        </SplitScale>
        <SoftReveal>
          <div className="mx-auto mt-6 max-w-md space-y-4 text-[1rem] leading-relaxed text-ink/80">
            <p>
              Não haverá imprensa, fotógrafos perseguindo celebridades ou
              cobertura exclusiva. Mas teremos algo muito melhor: pessoas que
              conhecem a nossa história de perto.
            </p>
            <p>
              Queremos vocês como testemunhas, narradores e protagonistas dessa
              celebração. Afinal, cada um tem uma lembrança, uma história ou um
              capítulo da nossa vida para contar.
            </p>
            <p>
              Então, preparem as memórias, as histórias engraçadas e até aquelas
              que talvez a gente prefira que fiquem entre amigos! 😂
            </p>
            <p>
              Nesse dia, a imprensa é dispensável. O que queremos é a presença
              de quem faz parte da nossa história.
            </p>
          </div>
        </SoftReveal>
      </div>
    </section>
  );
}
