"use client";

import Image from "next/image";
import { useState } from "react";
import { SplitScale } from "@/components/motion/SplitScale";
import type { PublicEvent } from "@/lib/event/defaults";

const PALETTE = [
  { id: "wine", label: "Vinho", value: "#4B1321", hint: "Um tom profundo, próximo ao envelope." },
  { id: "rose", label: "Rosé", value: "#C9989B", hint: "Suave, em seda ou crepe leve." },
  { id: "terracotta", label: "Terracota", value: "#B77657", hint: "Terra quente, muito fotogênico." },
  { id: "mustard", label: "Mostarda", value: "#D4B46A", hint: "Um amarelo de jardim, claro e fresco." },
  { id: "olive", label: "Oliva", value: "#596346", hint: "Verde de jardim, fresco ao fim da tarde." },
  { id: "sage", label: "Sálvia", value: "#9AA78D", hint: "Leve, em linho ou crepe." },
  { id: "lilac", label: "Lilás", value: "#B8A4D4", hint: "Um toque suave para vestidos longos." },
  { id: "sky", label: "Azul céu", value: "#A8C5E2", hint: "Claro, fresco e fácil de dançar." },
] as const;

const DETAILS = [
  {
    id: "tecidos",
    title: "Roupas leves",
    body: "Prefira roupas leves, fluidas e confortáveis, adequadas para um final de tarde de celebração.",
  },
  {
    id: "estampas",
    title: "Estampas e cores",
    body: "Estampas delicadas e cores suaves são muito bem-vindas.",
  },
  {
    id: "evitar",
    title: "O que evitar",
    body: "Evite o uso de preto e branco.",
  },
  {
    id: "leveza",
    title: "Elegância com leveza",
    body: "Escolha uma produção elegante, mas sem perder a leveza da ocasião.",
  },
];

type DressCodeLookbookProps = {
  event: PublicEvent;
};

export function DressCodeLookbook({ event }: DressCodeLookbookProps) {
  const [color, setColor] = useState<(typeof PALETTE)[number]>(PALETTE[0]);
  const [openDetail, setOpenDetail] = useState<string | null>(null);

  return (
    <section id="dress-code" className="px-5 py-16 sm:py-24">
      <div className="mx-auto w-[min(920px,calc(100%-0.25rem))]">
        <p className="eyebrow text-center">Dress code</p>
        <SplitScale className="mt-3 text-center font-serif text-3xl text-burgundy sm:text-4xl">
          Coquetel elegante
        </SplitScale>
        <p className="mx-auto mt-4 max-w-md text-center text-[0.98rem] leading-relaxed text-ink/80">
          Queremos um encontro bonito, elegante e, acima de tudo, confortável.
          A proposta é um {event.dressCode.title.trim().toLowerCase()}, com
          roupas leves, fluidas e adequadas para um final de tarde de
          celebração.
        </p>

        <div
          className="paper-card mt-8 overflow-hidden p-4 transition-colors duration-500 sm:p-6"
          style={{ background: `${color.value}14` }}
        >
          <figure>
            <div className="overflow-hidden rounded-2xl bg-ivory">
              <Image
                src="/assets/wedding/lookbook/looks-inspiracao.jpg"
                alt="Lookbook com vestidos florais e sólidos ao lado de camisas e alfaiataria clara"
                width={1024}
                height={1024}
                sizes="(max-width: 640px) 92vw, 920px"
                className="h-auto w-full"
              />
            </div>
            <figcaption className="mt-2 text-center text-[0.7rem] tracking-[0.2em] text-olive uppercase">
              Looks de inspiração
            </figcaption>
          </figure>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-line bg-ivory/80 px-4 py-4">
              <p className="text-[0.68rem] tracking-[0.2em] text-olive uppercase">
                Paleta de inspiração
              </p>
              <p className="mt-2 font-serif text-xl text-burgundy">Cores suaves</p>
              <p className="mt-2 text-sm leading-relaxed text-ink/75">
                Estampas delicadas e cores suaves são muito bem-vindas. Você
                também pode se inspirar em tons que conversem com o jardim.
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-ivory/80 px-4 py-4">
              <p className="text-[0.68rem] tracking-[0.2em] text-olive uppercase">
                Tenha em conta
              </p>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink/75">
                <li>Evite o uso de preto e branco.</li>
                <li>Prefira roupas leves, fluidas e confortáveis.</li>
                <li>Escolha uma produção elegante, sem perder a leveza.</li>
              </ul>
            </div>
          </div>
          <div className="mt-5 text-center">
            <h3 className="font-serif text-2xl text-burgundy">Do seu jeito mais especial</h3>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink/80">
              Vale apostar em tecidos naturais, peças sofisticadas sem excessos,
              estampas delicadas e produções que combinem elegância e
              descontração.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {PALETTE.map((swatch) => {
            const selected = swatch.id === color.id;
            return (
              <button
                key={swatch.id}
                type="button"
                onClick={() => setColor(swatch)}
                className="focus-ring flex min-h-11 min-w-11 flex-col items-center gap-1"
                aria-pressed={selected}
                aria-label={`Ver paleta ${swatch.label}`}
              >
                <span
                  className={`block h-9 w-9 rounded-full border ${
                    selected ? "border-ink scale-110" : "border-line"
                  }`}
                  style={{ background: swatch.value }}
                />
                <span className="text-[0.62rem] tracking-wide text-olive">{swatch.label}</span>
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-center text-sm text-ink/65">{color.hint}</p>

        <div className="mx-auto mt-8 grid max-w-xl gap-2">
          {DETAILS.map((item) => {
            const expanded = openDetail === item.id;
            return (
              <div key={item.id} className="paper-card overflow-hidden">
                <button
                  type="button"
                  className="focus-ring flex min-h-12 w-full items-center justify-between px-4 text-left text-sm text-burgundy"
                  aria-expanded={expanded}
                  onClick={() => setOpenDetail(expanded ? null : item.id)}
                >
                  {item.title}
                  <span aria-hidden="true">{expanded ? "–" : "+"}</span>
                </button>
                {expanded ? (
                  <p className="px-4 pb-4 text-sm leading-relaxed text-ink/75">{item.body}</p>
                ) : null}
              </div>
            );
          })}
        </div>
        <p className="mt-6 text-center text-sm text-olive">
          A ideia é que todos se sintam bonitos, à vontade e prontos para
          aproveitar cada momento.
        </p>
      </div>
    </section>
  );
}
