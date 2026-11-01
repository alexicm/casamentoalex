"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { Flip, registerGsap } from "@/lib/gsap";
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

type Plate = {
  src: string;
  alt: string;
  caption: string;
};

const STYLES: {
  id: "dresses" | "tailoring" | "free";
  label: string;
  title: string;
  body: string;
  plates: Plate[];
}[] = [
  {
    id: "dresses",
    label: "Vestidos e conjuntos",
    title: "Leveza de final de tarde",
    body: "Midi ou longo, tecido fluido e um salto confortável ou sapato bloco. Um casaco leve se esfriar.",
    plates: [
      {
        src: "/assets/wedding/lookbook/vestidos-aquarela.jpg",
        alt: "Ilustração em aquarela de vestidos longos em amarelo, rosé, oliva, lilás, azul céu, terracota e menta",
        caption: "Vestidos longos",
      },
    ],
  },
  {
    id: "tailoring",
    label: "Alfaiataria",
    title: "Traje leve, bem cortado",
    body: "Alfaiataria fresca em tons naturais, camisa leve e sapato em que você consiga dançar.",
    plates: [
      {
        src: "/assets/wedding/lookbook/jardim-misto.jpg",
        alt: "Ilustração em aquarela de convidados com ternos, camisas e vestidos em tons de terra e jardim",
        caption: "Alfaiataria e vestidos",
      },
    ],
  },
  {
    id: "free",
    label: "Outras inspirações",
    title: "Do seu jeito mais especial",
    body: "A paleta é um convite, não uma regra. O importante é um look bonito, fresco e em que você se sinta bem.",
    plates: [
      {
        src: "/assets/wedding/lookbook/looks-inspiracao.jpg",
        alt: "Lookbook com vestidos florais e sólidos ao lado de camisas e alfaiataria clara",
        caption: "Looks de inspiração",
      },
    ],
  },
];

const DETAILS = [
  {
    id: "tecidos",
    title: "Tecidos leves",
    body: "Linhos, crepes e sedas leves funcionam melhor para o fim de tarde em Brasília.",
  },
  {
    id: "calcados",
    title: "Calçados confortáveis",
    body: "Prefira sapatos em que você consiga ficar o tempo todo em pé e dançar.",
  },
  {
    id: "cores",
    title: "Cores recomendadas",
    body: "Inspire-se na paleta: vinho, rosé, terracota, mostarda, oliva, sálvia, lilás e azul céu.",
  },
  {
    id: "evitar",
    title: "O que evitar",
    body: "Deixe o branco, off-white e marfim para a noiva. Prefira evitar o preto e looks muito casuais, como tênis, short ou boné.",
  },
];

type DressCodeLookbookProps = {
  event: PublicEvent;
};

export function DressCodeLookbook({ event }: DressCodeLookbookProps) {
  const tabId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<(typeof STYLES)[number]["id"]>("dresses");
  const [color, setColor] = useState<(typeof PALETTE)[number]>(PALETTE[0]);
  const [openDetail, setOpenDetail] = useState<string | null>(null);
  const current = STYLES.find((item) => item.id === style) ?? STYLES[0];
  registerGsap();

  function selectStyle(next: (typeof STYLES)[number]["id"]) {
    const panel = panelRef.current;
    if (!panel || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStyle(next);
      return;
    }
    const state = Flip.getState(panel);
    setStyle(next);
    requestAnimationFrame(() => {
      Flip.from(state, { duration: 0.7, ease: "power2.out", absolute: false });
    });
  }

  return (
    <section id="dress-code" className="px-5 py-16 sm:py-24">
      <div className="mx-auto w-[min(920px,calc(100%-0.25rem))]">
        <p className="eyebrow text-center">Dress code</p>
        <SplitScale className="mt-3 text-center font-serif text-3xl text-burgundy sm:text-4xl">
          Venha do seu jeito mais especial
        </SplitScale>
        <p className="mx-auto mt-4 max-w-md text-center text-[0.98rem] leading-relaxed text-ink/80">
          Sugerimos um visual elegante, leve e confortável para celebrar com a
          gente. Nome visual provisório: {event.dressCode.title}.
        </p>

        <div
          role="tablist"
          aria-label="Estilos de composição"
          className="mx-auto mt-8 grid max-w-xl grid-cols-3 gap-2"
        >
          {STYLES.map((item) => {
            const selected = item.id === style;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={`${tabId}-${item.id}`}
                aria-selected={selected}
                aria-controls={`${tabId}-panel`}
                onClick={() => selectStyle(item.id)}
                className={`focus-ring min-h-12 rounded-2xl px-2 text-[0.72rem] leading-tight tracking-wide ${
                  selected
                    ? "bg-burgundy text-ivory"
                    : "border border-line bg-ivory text-burgundy"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div
          ref={panelRef}
          role="tabpanel"
          id={`${tabId}-panel`}
          aria-labelledby={`${tabId}-${current.id}`}
          className="paper-card mt-6 overflow-hidden p-4 transition-colors duration-500 sm:p-6"
          style={{ background: `${color.value}14` }}
        >
          <div className="space-y-6">
            {current.plates.map((plate) => (
              <figure key={plate.src}>
                <div className="overflow-hidden rounded-2xl bg-ivory">
                  <Image
                    src={plate.src}
                    alt={plate.alt}
                    width={1024}
                    height={1024}
                    sizes="(max-width: 640px) 92vw, 920px"
                    className="h-auto w-full"
                  />
                </div>
                <figcaption className="mt-2 text-center text-[0.7rem] tracking-[0.2em] text-olive uppercase">
                  {plate.caption}
                </figcaption>
              </figure>
            ))}
          </div>
          {current.id === "free" ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-line bg-ivory/80 px-4 py-4">
                <p className="text-[0.68rem] tracking-[0.2em] text-olive uppercase">
                  Paleta de inspiração
                </p>
                <p className="mt-2 font-serif text-xl text-burgundy">Cores que enchem de vida</p>
                <p className="mt-2 text-sm leading-relaxed text-ink/75">
                  Você pode se inspirar nesta paleta ou em tons que conversem com o jardim.
                </p>
              </div>
              <div className="rounded-2xl border border-line bg-ivory/80 px-4 py-4">
                <p className="text-[0.68rem] tracking-[0.2em] text-olive uppercase">
                  Tenha em conta
                </p>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink/75">
                  <li>O branco, o marfim e o off-white ficam com a noiva.</li>
                  <li>Prefira evitar o preto.</li>
                  <li>Evite looks muito casuais, como tênis, short ou boné.</li>
                </ul>
              </div>
            </div>
          ) : null}
          <div className="mt-5 text-center">
            <h3 className="font-serif text-2xl text-burgundy">{current.title}</h3>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink/80">
              {current.body}
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
          O mais importante é que você se sinta bem para celebrar com a gente.
        </p>
      </div>
    </section>
  );
}
