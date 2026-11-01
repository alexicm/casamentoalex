"use client";

import Image from "next/image";
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
        <p className="eyebrow">Vocês fazem parte dessa história</p>
        <SplitScale className="mx-auto mt-4 max-w-md font-serif text-[1.85rem] leading-tight text-burgundy sm:text-4xl">
          Não será sobre protocolos.
        </SplitScale>
        <SoftReveal>
          <div className="mx-auto mt-6 max-w-md space-y-4 text-[1rem] leading-relaxed text-ink/80">
            <p>
              Não será sobre formalidades ou uma programação tradicional. Será
              sobre encontros, abraços demorados, boas conversas, histórias
              compartilhadas, risadas e momentos que merecem ser lembrados.
            </p>
            <p>
              Queremos brindar à vida, ao amor e, principalmente, às pessoas que
              fazem parte de tudo isso.
            </p>
          </div>
        </SoftReveal>
        <div className="mx-auto mt-10 w-[min(86vw,420px)]">
          <Image
            src={WEDDING_ASSETS.dance}
            alt="Ilustração em aquarela de Alex e Paloma dançando em um campo florido, em moldura dourada"
            width={736}
            height={736}
            sizes="(max-width: 430px) 86vw, 420px"
            className="h-auto w-full"
          />
        </div>
        <p className="eyebrow mt-12">A lista</p>
        <h3 className="mx-auto mt-3 max-w-md font-serif text-2xl leading-tight text-burgundy sm:text-3xl">
          Cada pessoa foi escolhida com muito carinho
        </h3>
        <div className="mx-auto mt-6 max-w-md space-y-4 text-[1rem] leading-relaxed text-ink/80">
          <p>
            A nossa lista de convidados não foi construída por obrigação ou
            convenção. Cada pessoa que estará conosco tem um lugar especial na
            nossa história.
          </p>
          <p>
            São pessoas que participaram de diferentes fases da nossa vida, que
            acompanharam momentos importantes, que compartilharam alegrias,
            desafios, conquistas e tantas lembranças que fazem parte de quem
            somos hoje.
          </p>
          <p>
            Algumas estiveram presentes desde o início, outras chegaram ao
            longo do caminho, mas todas têm algo em comum: são pessoas que
            fazem diferença na nossa vida.
          </p>
          <p>
            Mais do que convidados, vocês são parte da nossa família, da nossa
            trajetória e das memórias que queremos continuar construindo.
          </p>
        </div>
        <StickerBoard
          label="Abrir uma nota carinhosa"
          note="Por isso, queremos vocês perto. Não apenas para assistir à nossa celebração, mas para fazer parte dela."
        />
      </div>
    </section>
  );
}
