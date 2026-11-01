"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { CalendarAdd } from "@/components/wedding/CalendarAdd";
import { gsap, registerGsap, useGSAP } from "@/lib/gsap";
import { MOTION, prefersReducedMotion } from "@/lib/motion";

type OpeningLetterProps = {
  attending: boolean;
  firstName: string;
  onOpened: () => void;
};

export function OpeningLetter({ attending, firstName, onOpened }: OpeningLetterProps) {
  const rootRef = useRef<HTMLElement>(null);
  const envRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLParagraphElement>(null);
  const finishedRef = useRef(false);
  const onOpenedRef = useRef(onOpened);
  const [opened, setOpened] = useState(false);
  onOpenedRef.current = onOpened;
  registerGsap();

  useGSAP(
    (_, contextSafe) => {
      const finish = contextSafe(() => {
        if (finishedRef.current) return;
        finishedRef.current = true;
        setOpened(true);
        onOpenedRef.current();
      });

      const env = envRef.current;
      const cover = coverRef.current;
      const wrap = wrapRef.current;
      const letter = letterRef.current;
      const seal = sealRef.current;
      const message = messageRef.current;
      if (!env || !cover || !wrap || !letter || !seal || !message) return;

      if (prefersReducedMotion()) {
        gsap.set(cover, { rotateX: 180, zIndex: 0 });
        gsap.set(wrap, { height: "150%", top: "-52%", zIndex: 5 });
        gsap.set(letter, { y: 0 });
        gsap.set(seal, { autoAlpha: 0 });
        gsap.set(message, { autoAlpha: 1, y: 0 });
        finish();
        return;
      }

      gsap.set(env, { rotateY: -16, rotateX: 12, z: -16, force3D: true });
      gsap.set(letter, { y: 36, force3D: true });
      gsap.set(message, { autoAlpha: 0, y: 12 });
      gsap.set(cover, { rotateX: 0, zIndex: 4, force3D: true });

      const tl = gsap.timeline({
        defaults: { ease: MOTION.window.ease, force3D: true },
        onComplete: finish,
      });

      tl.to(env, { rotateY: 18, rotateX: 10, z: 20, duration: 2.1 }, 0)
        .to(seal, { y: -28, scale: 0.7, autoAlpha: 0, duration: 0.4, ease: "power2.out" }, 0.1)
        .to(cover, { rotateX: 180, duration: 0.9 }, 0.24)
        .set(cover, { zIndex: 0 })
        .to(wrap, { height: "158%", top: "-88%", duration: 0.72, ease: "power2.out" }, 0.78)
        .to(letter, { y: 0, duration: 0.72, ease: "power2.out" }, 0.78)
        .to(wrap, { top: "-46%", zIndex: 6, duration: 0.55 }, 1.42)
        .to(env, { y: 14, duration: 0.55 }, 0.78)
        .to(message, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }, 1.55);
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
      <p className="eyebrow">A carta se abre</p>
      <h2 className="mt-3 text-center font-serif text-3xl text-burgundy">Sua resposta chegou</h2>
      <p className="mx-auto mt-3 max-w-xs text-center text-sm leading-relaxed text-ink/70">
        {attending
          ? `${capitalize(name)}, sua resposta já está conosco.`
          : `${capitalize(name)}, lemos sua resposta com o mesmo carinho.`}
      </p>

      <div className="gift-env-stage mt-8">
        <div ref={envRef} className="gift-env">
          <div className="gift-env-back" />

          <div ref={wrapRef} className="gift-env-letter-wrap">
            <div ref={letterRef} className="gift-env-letter">
              <p ref={messageRef} className="font-serif text-lg leading-snug text-burgundy">
                {attending
                  ? "Estamos reservando um lugar para você."
                  : "Você continua na nossa história."}
              </p>
              <p className="mt-4 font-serif text-xl tracking-[0.16em] text-burgundy uppercase">
                Alex & Paloma
              </p>
              <p className="mt-2 text-[0.68rem] tracking-[0.22em] text-olive uppercase">
                20.12.2026
              </p>
            </div>
          </div>

          <div className="gift-env-front">
            <div className="gift-env-inner">
              <div className="gift-env-tri left" />
              <div className="gift-env-tri right" />
              <div className="gift-env-rounded" />
              <div className="gift-env-bottom" />
            </div>
          </div>

          <div ref={coverRef} className="gift-env-cover">
            <div className="gift-env-flap gift-env-flap-front">
              <div className="gift-env-inner">
                <div className="gift-env-top-center" />
                <div className="gift-env-top" />
              </div>
            </div>
            <div className="gift-env-flap gift-env-flap-back">
              <div className="gift-env-inner">
                <div className="gift-env-top-center" />
                <div className="gift-env-top" />
              </div>
            </div>
          </div>

          <div ref={sealRef} className="gift-env-seal wax-seal rounded-full text-ivory">
            <span className="font-script text-[1.3rem] leading-none">A&P</span>
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
