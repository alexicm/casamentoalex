"use client";

import { useRef, useState } from "react";
import { usePageReady } from "@/components/motion/PageReadyProvider";
import { gsap, registerGsap, useGSAP } from "@/lib/gsap";
import { persistEnvelopeOpened, prefersReducedMotion, readEnvelopeOpened } from "@/lib/motion";

export function InvitationEnvelope() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const { markReady } = usePageReady();
  registerGsap();

  useGSAP(
    () => {
      if (readEnvelopeOpened()) {
        persistEnvelopeOpened();
        markReady();
        setVisible(false);
        return;
      }
      if (prefersReducedMotion()) return;
      gsap.set(".envelope-card", { yPercent: 28, autoAlpha: 0.55 });
    },
    { scope: rootRef },
  );

  function finish() {
    persistEnvelopeOpened();
    markReady();
    setVisible(false);
  }

  function openEnvelope() {
    if (!visible) return;
    if (prefersReducedMotion()) {
      finish();
      return;
    }

    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: finish,
    });
    tl.to(".wax-seal", { scale: 1.08, rotation: -8, duration: 0.28, ease: "power2.out" })
      .to(".wax-seal", { scale: 0.86, y: 10, autoAlpha: 0.15, duration: 0.32 }, "-=0.04")
      .to(".envelope-flap", { rotateX: -158, duration: 0.72 }, "-=0.12")
      .to(".envelope-card", { yPercent: -22, autoAlpha: 1, duration: 0.55, ease: "power3.out" }, "-=0.38")
      .to(rootRef.current, { autoAlpha: 0, duration: 0.42 }, "+=0.12");
  }

  if (!visible) return null;

  return (
    <div
      ref={rootRef}
      className="burgundy-stage envelope-scene fixed inset-0 z-50 flex min-h-svh flex-col items-center justify-center px-5"
    >
      <p className="mb-8 text-[0.7rem] tracking-[0.28em] text-ivory/70 uppercase">
        Um convite especial
      </p>

      <button
        type="button"
        aria-label="Toque para abrir o convite"
        onClick={openEnvelope}
        className="focus-ring relative w-[min(88vw,360px)] border-0 bg-transparent p-0"
      >
        <div className="envelope-body relative mx-auto h-[250px] w-full">
          <div className="absolute inset-x-[10%] top-[22%] z-10 overflow-hidden rounded-t-[10px]">
            <div className="envelope-card mx-auto w-full bg-[#fbf6ee] px-5 py-7 text-center shadow-[0_10px_24px_rgba(16,6,10,0.18)]">
              <p className="font-serif text-2xl text-burgundy">
                Alex <span className="italic text-terracotta">&</span> Paloma
              </p>
              <p className="mt-2 text-[0.68rem] tracking-[0.22em] text-olive uppercase">
                20.12.2026
              </p>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 z-20 h-[62%] overflow-hidden rounded-[8px_8px_22px_22px] bg-[#f3eadc] shadow-[0_28px_50px_rgba(16,6,10,0.38)]">
            <div className="absolute inset-x-0 top-0 h-10 bg-[#efe4d2]/80" />
            <Lace className="absolute inset-x-6 bottom-5 opacity-50" />
          </div>

          <div className="envelope-flap absolute inset-x-0 top-0 z-30 h-[54%]">
            <div
              className="h-full w-full bg-[#f7efe3] shadow-[0_10px_18px_rgba(16,6,10,0.12)]"
              style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
            />
          </div>

          <div className="wax-seal absolute top-[46%] left-1/2 z-40 flex h-[4.25rem] w-[4.25rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-ivory">
            <span className="font-script text-[1.35rem] leading-none">A&P</span>
          </div>
        </div>
        <p className="mt-7 text-center text-[0.78rem] tracking-[0.22em] text-ivory/80 uppercase">
          Toque para abrir
        </p>
      </button>

      <button
        type="button"
        onClick={finish}
        className="focus-ring mt-7 min-h-11 text-[0.68rem] tracking-[0.18em] text-ivory/65 uppercase underline-offset-4 hover:underline"
      >
        Pular animação / Ver convite
      </button>
    </div>
  );
}

function Lace({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 280 36" className={className} aria-hidden="true" fill="none">
      <path
        d="M8 22c18-16 36-16 54 0s36 16 54 0 36-16 54 0 36 16 54 0 36-16 48 0"
        stroke="#c9989b"
        strokeWidth="1.2"
      />
      <path
        d="M8 28c18-12 36-12 54 0s36 12 54 0 36-12 54 0 36 12 54 0 36-12 48 0"
        stroke="#a99986"
        strokeWidth="1"
      />
    </svg>
  );
}
