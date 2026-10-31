"use client";

import Image from "next/image";
import { useId, useState } from "react";
import type { PublicEvent } from "@/lib/event/defaults";

const PALETTE = [
  { id: "olive", label: "Verde oliva", value: "#515B40" },
  { id: "sage", label: "Sálvia", value: "#A5AC91" },
  { id: "terracotta", label: "Terracota", value: "#B77759" },
  { id: "rose", label: "Rosé", value: "#C89991" },
  { id: "wine", label: "Vinho", value: "#6E303D" },
  { id: "sand", label: "Areia", value: "#D1BDAB" },
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
        src: "/assets/wedding/lookbook/vestidos-coquetel.jpg",
        alt: "Cinco vestidos de coquetel em ilustração de moda: preto, terracota, sálvia, rosé e malva",
        caption: "Coquetel elegante",
      },
      {
        src: "/assets/wedding/lookbook/vestidos-jardim.jpg",
        alt: "Seis vestidos longos em ilustração de moda: oliva, terracota, chocolate, champanhe, azul-marinho e blush",
        caption: "Comprimento longo",
      },
    ],
  },
  {
    id: "tailoring",
    label: "Alfaiataria",
    title: "Traje leve, bem cortado",
    body: "Terno completo em tons escuros ou oliva, camisa fresca e sapato fechado. Preto combina especialmente depois que a luz baixar.",
    plates: [
      {
        src: "/assets/wedding/lookbook/alfaiataria.jpg",
        alt: "Cinco ternos em ilustração de moda: verde-floresta, marfim, sálvia, cinza-claro e taupe",
        caption: "Alfaiataria fresca",
      },
      {
        src: "/assets/wedding/lookbook/alfaiataria-formal.jpg",
        alt: "Quatro ternos formais em ilustração de moda: azul-marinho, grafite, chocolate e oliva",
        caption: "Tom mais formal",
      },
    ],
  },
  {
    id: "free",
    label: "Inspirações livres",
    title: "Do seu jeito mais especial",
    body: "A paleta é um convite, não uma regra. O importante é um look bonito, fresco e em que você se sinta bem.",
    plates: [
      {
        src: "/assets/wedding/lookbook/livres.jpg",
        alt: "Inspirações livres em ilustração de moda: vestidos midi e camisas com calça de alfaiataria",
        caption: "Conjuntos e camisas",
      },
    ],
  },
];

type DressCodeLookbookProps = {
  event: PublicEvent;
};

export function DressCodeLookbook({ event }: DressCodeLookbookProps) {
  const tabId = useId();
  const [style, setStyle] = useState<(typeof STYLES)[number]["id"]>("dresses");
  const [color, setColor] = useState<(typeof PALETTE)[number]>(PALETTE[0]);
  const [openDetails, setOpenDetails] = useState(false);
  const current = STYLES.find((item) => item.id === style) ?? STYLES[0];

  return (
    <section id="dress-code" className="px-5 py-16 sm:py-24">
      <div className="mx-auto w-[min(920px,calc(100%-0.25rem))]">
        <p className="eyebrow text-center">Dress code</p>
        <h2 className="mt-3 text-center font-serif text-3xl text-olive sm:text-4xl">
          Venha do seu jeito mais especial
        </h2>
        <p className="mx-auto mt-4 max-w-md text-center text-[0.98rem] leading-relaxed text-ink/80">
          Sugerimos {event.dressCode.title.toLowerCase()}: {event.dressCode.subtitle}
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
                onClick={() => setStyle(item.id)}
                className={`focus-ring min-h-12 rounded-2xl px-2 text-[0.72rem] leading-tight tracking-wide ${
                  selected
                    ? "bg-olive text-paper-light"
                    : "border border-olive/15 bg-paper-light text-olive"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`${tabId}-panel`}
          aria-labelledby={`${tabId}-${current.id}`}
          className="mt-6 overflow-hidden rounded-[28px] border border-olive/10 p-4 transition-colors duration-500 sm:p-6"
          style={{ background: `${color.value}14` }}
        >
          <div className="space-y-6">
            {current.plates.map((plate) => (
              <LookPlate key={plate.src} plate={plate} />
            ))}
          </div>
          <div className="mt-5 text-center">
            <h3 className="font-serif text-2xl text-olive">{current.title}</h3>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink/80">
              {current.body}
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-olive">
          Inspire-se nos tons da natureza: verde oliva, sálvia, terracota, rosé,
          vinho e tons terrosos.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
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
                    selected ? "border-ink scale-110" : "border-olive/20"
                  }`}
                  style={{ background: swatch.value }}
                />
                <span className="text-[0.62rem] tracking-wide text-olive">
                  {swatch.label}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className="focus-ring mx-auto mt-8 block min-h-12 text-sm tracking-[0.16em] text-wine uppercase underline-offset-4 hover:underline"
          aria-expanded={openDetails}
          onClick={() => setOpenDetails((value) => !value)}
        >
          {openDetails ? "Fechar inspirações" : "Ver inspirações"}
        </button>

        {openDetails ? (
          <div className="mt-4 space-y-3 rounded-[24px] border border-olive/10 bg-paper-light/80 p-5 text-sm leading-relaxed text-ink/80">
            <p>Tecidos leves e frescos funcionam melhor para o fim de tarde.</p>
            <p>Prefira sapatos em que você consiga ficar o tempo todo em pé e dançar.</p>
            <p>Se possível, deixe o branco, off-white e marfim para a noiva.</p>
            <p>Escolha um look em que você se sinta bem para aproveitar cada momento.</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function LookPlate({ plate }: { plate: Plate }) {
  return (
    <figure>
      <div className="-mx-1 overflow-x-auto">
        <Image
          src={plate.src}
          alt={plate.alt}
          width={1280}
          height={720}
          sizes="(max-width: 640px) 220vw, 920px"
          className="watercolor-blend h-[230px] w-auto max-w-none sm:h-auto sm:w-full"
        />
      </div>
      <figcaption className="mt-2 text-center text-[0.7rem] tracking-[0.2em] text-olive uppercase">
        {plate.caption}
      </figcaption>
    </figure>
  );
}
