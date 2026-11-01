"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { CalendarAdd } from "@/components/wedding/CalendarAdd";
import { gsap, registerGsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import "./opening-letter.css";

type OpeningLetterProps = {
  attending: boolean;
  firstName: string;
  onOpened: () => void;
};

export function OpeningLetter({ attending, firstName, onOpened }: OpeningLetterProps) {
  const rootRef = useRef<HTMLElement>(null);
  const envRef = useRef<HTMLDivElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const finishedRef = useRef(false);
  const onOpenedRef = useRef(onOpened);
  const [opened, setOpened] = useState(false);
  onOpenedRef.current = onOpened;
  registerGsap();

  useGSAP(
    () => {
      const finish = () => {
        if (finishedRef.current) return;
        finishedRef.current = true;
        setOpened(true);
        onOpenedRef.current();
      };

      const env = envRef.current;
      const flap = flapRef.current;
      const letter = letterRef.current;
      const seal = sealRef.current;
      const message = messageRef.current;
      if (!env || !flap || !letter || !seal || !message) return;

      if (prefersReducedMotion()) {
        gsap.set(flap, { rotateX: 158, zIndex: 1 });
        gsap.set(letter, { y: -108, autoAlpha: 1, zIndex: 5 });
        gsap.set(seal, { autoAlpha: 0 });
        gsap.set(message, { autoAlpha: 1, y: 0 });
        finish();
        return;
      }

      gsap.set(env, { rotateX: 8, y: 6, force3D: true });
      gsap.set(flap, { rotateX: 0, transformOrigin: "top center", force3D: true });
      gsap.set(letter, { y: 56, autoAlpha: 1, zIndex: 1, force3D: true });
      gsap.set(seal, { autoAlpha: 1, scale: 1, y: 0 });
      gsap.set(message, { autoAlpha: 0, y: 8 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut", force3D: true },
        onComplete: finish,
      });

      tl.to(env, { rotateX: 5, y: 0, duration: 0.5, ease: "power2.out" }, 0)
        .to(seal, { y: -16, scale: 0.84, autoAlpha: 0, duration: 0.4, ease: "power2.out" }, 0.22)
        .to(flap, { rotateX: 158, duration: 0.85 }, 0.42)
        .set(flap, { zIndex: 1 }, 1.08)
        .to(letter, { y: -108, zIndex: 5, duration: 0.9, ease: "power2.out" }, 1)
        .to(env, { y: 16, rotateX: 2, duration: 0.75, ease: "power2.out" }, 1)
        .to(message, { autoAlpha: 1, y: 0, duration: 0.42, ease: "power2.out" }, 1.45);
    },
    { scope: rootRef },
  );

  const name = firstName === "você" ? "você" : firstName;

  return (
    <main
      ref={rootRef}
      className="letter-open-scene paper-bg relative isolate flex min-h-svh flex-col items-center justify-center px-5 py-10"
      aria-live="polite"
      data-letter-state={opened ? "open" : "opening"}
    >
      <p className="eyebrow">Uma carta para você</p>
      <h2 className="mt-3 text-center font-serif text-3xl text-burgundy">Sua resposta chegou</h2>
      <p className="mx-auto mt-3 max-w-xs text-center text-sm leading-relaxed text-ink/70">
        {attending
          ? `${capitalize(name)}, sua resposta já está conosco.`
          : `${capitalize(name)}, lemos sua resposta com o mesmo carinho.`}
      </p>

      <div className="open-env-stage mt-10">
        <div ref={envRef} className="open-env">
          <div className="open-env-back" />
          <div ref={letterRef} className="open-env-letter">
            <div ref={messageRef}>
              <p className="font-serif text-xl leading-snug text-burgundy">
                {attending
                  ? "Estamos reservando um lugar para você."
                  : "Você continua na nossa história."}
              </p>
              <p className="mt-5 font-serif text-2xl text-burgundy">
                Alex <span className="italic text-terracotta">&</span> Paloma
              </p>
              <p className="mt-2 text-[0.68rem] tracking-[0.18em] text-olive uppercase">
                20.12.2026
              </p>
            </div>
          </div>
          <div className="open-env-front" />
          <div ref={flapRef} className="open-env-flap">
            <div className="open-env-flap-face open-env-flap-outer" />
            <div className="open-env-flap-face open-env-flap-liner" />
          </div>
          <div ref={sealRef} className="open-env-seal wax-seal rounded-full text-ivory">
            <span className="font-script text-[1.25rem] leading-none">A&P</span>
          </div>
        </div>
      </div>

      {opened ? (
        <div className="mt-8 flex w-full flex-col items-center">
          {attending ? <CalendarAdd /> : null}
          <Link
            href="/"
            className="focus-ring mt-5 flex min-h-12 items-center justify-center rounded-full bg-burgundy px-6 text-sm tracking-[0.16em] text-ivory uppercase"
          >
            Voltar ao convite
          </Link>
        </div>
      ) : null}
    </main>
  );
}

function capitalize(value: string) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}
