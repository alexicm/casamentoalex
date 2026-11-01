"use client";

import { SoftReveal } from "@/components/motion/SoftReveal";
import { SplitScale } from "@/components/motion/SplitScale";

export function SharedStories() {
  return (
    <section id="historias" className="px-5 py-16 sm:py-24">
      <div className="section-shell text-center">
        <p className="eyebrow">Esse espaço também é seu</p>
        <SplitScale className="mx-auto mt-4 max-w-lg font-serif text-[1.85rem] leading-tight text-burgundy sm:text-4xl">
          Não precisa trazer discurso pronto. Só uma boa história.
        </SplitScale>
        <SoftReveal>
          <div className="paper-card mx-auto mt-8 max-w-md px-6 py-7">
            <p className="text-[1rem] leading-relaxed text-ink/80">
              Se você tem uma lembrança nossa, uma história engraçada, algo que
              sempre quis dizer ou simplesmente uma memória que merece ser
              compartilhada, esse espaço também é seu. Queremos que esse dia
              tenha um pouquinho de cada pessoa que ajudou a escrever a nossa
              história.
            </p>
          </div>
        </SoftReveal>
      </div>
    </section>
  );
}
