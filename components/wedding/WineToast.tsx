"use client";

import { SoftReveal } from "@/components/motion/SoftReveal";
import { SplitScale } from "@/components/motion/SplitScale";

const STEPS = [
  {
    mark: "🍷",
    text: "Escolha uma garrafa de vinho de sua preferência.",
  },
  {
    mark: "💌",
    text: "Anexe um cartão com seu nome e a ocasião sugerida para abrir.",
  },
  {
    mark: "❤️",
    text: "Se quiser, conte por que escolheu aquele vinho ou deixe uma mensagem para nós.",
  },
] as const;

export function WineToast() {
  return (
    <section id="brinde" className="px-5 py-16 sm:py-24">
      <div className="section-shell text-center">
        <p className="eyebrow">Se quiser nos presentear</p>
        <SplitScale className="mx-auto mt-4 max-w-lg font-serif text-[1.85rem] leading-tight text-burgundy sm:text-4xl">
          Um brinde a nós!
        </SplitScale>

        <SoftReveal>
          <div className="mx-auto mt-8 max-w-md space-y-4 text-left text-[1rem] leading-relaxed text-ink/80">
            <p>
              Se você deseja nos presentear, temos uma sugestão um pouquinho
              diferente: que tal uma garrafa de vinho?
            </p>
            <p>
              A nossa ideia é que cada convidado escolha um vinho e, junto com
              ele, deixe uma sugestão de quando deveríamos abri-lo.
            </p>
            <p>
              Pode ser em uma ocasião especial, em uma viagem, em uma noite
              tranquila a dois, para comemorar uma conquista, lembrar de alguém
              querido ou simplesmente em um dia que mereça um brinde.
            </p>
            <p>
              Queremos que cada garrafa carregue um pouquinho de vocês e que, ao
              abri-la, a gente também se lembre desse momento e de quem nos
              presenteou.
            </p>
            <p>
              Mas já fica o aviso: somos do tipo que não precisa de muita
              desculpa para abrir um bom vinho! 😂 Então, mesmo que você sugira
              uma ocasião especial, não garantimos que ele vá esperar até lá.
            </p>
            <p>
              O importante é que cada garrafa venha acompanhada de carinho, boas
              histórias e motivos para brindar.
            </p>
            <p>
              Afinal, a vida é feita de momentos. E queremos brindar muitos
              deles com vocês! ❤️
            </p>
          </div>
        </SoftReveal>

        <SoftReveal>
          <div className="mx-auto mt-10 grid max-w-md gap-3 text-left">
            {STEPS.map((step) => (
              <div key={step.text} className="paper-card flex gap-3 px-5 py-4">
                <span className="mt-0.5 text-lg" aria-hidden="true">
                  {step.mark}
                </span>
                <p className="text-sm leading-relaxed text-ink/80">{step.text}</p>
              </div>
            ))}
          </div>
        </SoftReveal>
      </div>
    </section>
  );
}
