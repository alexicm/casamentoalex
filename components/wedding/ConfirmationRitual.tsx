"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Foliage } from "@/components/wedding/Foliage";
import { OpeningLetter } from "@/components/wedding/OpeningLetter";
import { gsap, registerGsap, useGSAP } from "@/lib/gsap";
import {
  PROCESS_STEPS,
  RITUAL_MS,
  STAGE_COUNT,
  STAGE_MS,
  createRitual,
  formatClock,
  readRitual,
  writeRitual,
  type RitualState,
} from "@/lib/confirmation-ritual";
import { MOTION, prefersReducedMotion } from "@/lib/motion";

type ConfirmationRitualProps = {
  receipt?: string;
  attending: boolean;
};

const SEAT_CHOICES = [
  { id: "dance", label: "Perto da pista", note: "Para dançar e celebrar com vocês." },
  { id: "people", label: "Perto de quem eu amo", note: "Quero estar entre os meus." },
  { id: "talk", label: "Um canto para conversar", note: "Boas conversas, abraços demorados." },
] as const;

const ABSENCE_CHOICES = [
  { id: "heart", label: "Estarei de coração", note: "Mesmo de longe." },
  { id: "toast", label: "Faço um brinde", note: "No mesmo horário." },
  { id: "later", label: "A gente se vê depois", note: "A história continua." },
] as const;

const WISHES = [
  { id: "love", label: "Que o amor de vocês dure" },
  { id: "light", label: "Que a festa seja leve" },
  { id: "near", label: "Que eu esteja lá com o coração" },
] as const;

export function ConfirmationRitual({ receipt, attending }: ConfirmationRitualProps) {
  const router = useRouter();
  const rootRef = useRef<HTMLElement>(null);
  const holdRef = useRef<number | null>(null);
  const finishingRef = useRef(false);
  const [state, setState] = useState<RitualState | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [hold, setHold] = useState(0);
  const [letterOpen, setLetterOpen] = useState(false);
  registerGsap();

  useEffect(() => {
    const existing = readRitual();
    if (existing?.done && (!receipt || existing.receipt === receipt)) {
      setState(existing);
      finishingRef.current = true;
      setLetterOpen(true);
      return;
    }
    if (existing && (!receipt || existing.receipt === receipt)) {
      setState(existing);
      if (Date.now() - existing.startedAt >= RITUAL_MS) {
        finishingRef.current = true;
        setLetterOpen(true);
      }
      return;
    }
    if (!receipt) {
      router.replace("/");
      return;
    }
    const created = createRitual({
      receipt,
      attending,
      firstName: "você",
    });
    writeRitual(created);
    setState(created);
  }, [attending, receipt, router]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!state) return;
    writeRitual(state);
  }, [state]);

  const stageRemaining = state
    ? Math.max(0, STAGE_MS - (now - state.stageStartedAt))
    : STAGE_MS;
  const totalRemaining = state
    ? Math.max(0, RITUAL_MS - (now - state.startedAt))
    : RITUAL_MS;
  const interacted = Boolean(state?.interacted[state.stage]);
  const canAdvance = Boolean(state && !letterOpen && stageRemaining === 0);

  useEffect(() => {
    if (!state || !canAdvance) return;
    if (state.stage < STAGE_COUNT - 1) {
      setState({
        ...state,
        stage: state.stage + 1,
        stageStartedAt: Date.now(),
      });
      return;
    }
    if (finishingRef.current) return;
    finishingRef.current = true;
    setLetterOpen(true);
  }, [canAdvance, state]);

  useGSAP(
    () => {
      if (!state || letterOpen) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".ritual-act", {
          y: 16,
          duration: MOTION.titleEnter.duration,
          ease: MOTION.titleEnter.ease,
        });
        gsap.to(".ritual-leaf", {
          y: 8,
          duration: MOTION.breath.duration,
          ease: MOTION.breath.ease,
          yoyo: true,
          repeat: -1,
        });
      });
      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [state?.stage, letterOpen], revertOnUpdate: true },
  );

  function markInteracted(choice?: string) {
    setState((current) => {
      if (!current) return current;
      const interactedNext = [...current.interacted];
      interactedNext[current.stage] = true;
      return { ...current, interacted: interactedNext, choice: choice ?? current.choice };
    });
  }

  function startHold() {
    if (prefersReducedMotion()) {
      setHold(1);
      markInteracted("seal");
      return;
    }
    const started = performance.now();
    const tick = (time: number) => {
      const progress = Math.min(1, (time - started) / 1600);
      setHold(progress);
      if (progress >= 1) {
        markInteracted("seal");
        holdRef.current = null;
        return;
      }
      holdRef.current = window.requestAnimationFrame(tick);
    };
    holdRef.current = window.requestAnimationFrame(tick);
  }

  function stopHold() {
    if (holdRef.current) window.cancelAnimationFrame(holdRef.current);
    holdRef.current = null;
    setHold((value) => (value >= 1 ? 1 : 0));
  }

  const progress = useMemo(() => {
    if (!state) return 0;
    const elapsed = now - state.startedAt;
    return Math.min(1, elapsed / RITUAL_MS);
  }, [now, state]);

  function markLetterOpened() {
    if (!state) return;
    writeRitual({ ...state, done: true });
  }

  if (!state) {
    return (
      <main className="paper-bg grid min-h-svh place-items-center px-5">
        <p className="text-sm text-olive">Abrindo o processo de confirmação…</p>
      </main>
    );
  }

  if (letterOpen) {
    return (
      <OpeningLetter
        attending={state.attending}
        firstName={state.firstName}
        onOpened={markLetterOpened}
      />
    );
  }

  const name = state.firstName === "você" ? "você" : state.firstName;
  const steps = state.attending
    ? PROCESS_STEPS
        : (["A carta chegou", "Lendo com calma", "Um lugar no coração", "Um desejo", "Selando a resposta"] as const);

  return (
    <main
      ref={rootRef}
      className="paper-bg relative isolate min-h-svh overflow-hidden px-5 pb-16 pt-[max(1.5rem,env(safe-area-inset-top))]"
    >
      <div className="ritual-leaf pointer-events-none absolute -left-10 top-8 w-36" aria-hidden="true">
        <Foliage />
      </div>
      <div className="ritual-leaf pointer-events-none absolute -right-12 bottom-10 w-40 rotate-180" aria-hidden="true">
        <Foliage variant="spray" />
      </div>

      <div className="section-shell relative z-10">
        <p className="eyebrow text-center">Processo de confirmação</p>
        <h1 className="mt-3 text-center font-serif text-3xl text-burgundy sm:text-4xl">
          Sua resposta está em nossas mãos
        </h1>
        <p className="mx-auto mt-3 max-w-md text-center text-sm leading-relaxed text-ink/75">
          {state.attending
            ? `${capitalize(name)}, vamos tratar isso com o mesmo cuidado de uma carta. São cinco segundos, e ela se abre sozinha.`
            : `${capitalize(name)}, lemos sua resposta sem pressa. Em cinco segundos, a carta se abre.`}
        </p>

        <div className="mt-6" aria-hidden="true">
          <div className="flex items-center justify-between text-[0.68rem] tracking-[0.2em] text-olive uppercase">
            <span>Tempo do rito</span>
            <span>{formatClock(totalRemaining)}</span>
          </div>
          <div className="ritual-thread mt-2">
            <span style={{ width: `${progress * 100}%` }} />
          </div>
        </div>

        <ol className="mx-auto mt-6 max-w-sm">
          {steps.map((label, index) => {
            const done = index < state.stage || (index === state.stage && interacted && stageRemaining === 0);
            const current = index === state.stage;
            return (
              <li
                key={label}
                className={`flex items-baseline gap-3 border-l py-1.5 pl-3 text-sm ${
                  current
                    ? "border-burgundy text-burgundy"
                    : done
                      ? "border-olive/40 text-olive"
                      : "border-line text-ink/40"
                }`}
              >
                <span>{label}</span>
              </li>
            );
          })}
        </ol>

        <section
          className="ritual-act letter-sheet mt-8"
          aria-live="polite"
          aria-atomic="true"
        >
          <p className="text-center text-[0.68rem] tracking-[0.24em] text-olive uppercase">
            Passo {state.stage + 1} de {STAGE_COUNT}
          </p>
          <StageBody
            stage={state.stage}
            attending={state.attending}
            name={name}
            choice={state.choice}
            interacted={interacted}
            hold={hold}
            onInteract={markInteracted}
            onHoldStart={startHold}
            onHoldEnd={stopHold}
          />
          <p className="mt-6 text-center text-xs tracking-[0.16em] text-taupe uppercase">
            {stageRemaining > 0
              ? `Neste passo · ${formatClock(stageRemaining)}`
              : "Abrindo o próximo passo"}
          </p>
        </section>
      </div>
    </main>
  );
}

function StageBody({
  stage,
  attending,
  name,
  choice,
  interacted,
  hold,
  onInteract,
  onHoldStart,
  onHoldEnd,
}: {
  stage: number;
  attending: boolean;
  name: string;
  choice?: string;
  interacted: boolean;
  hold: number;
  onInteract: (choice?: string) => void;
  onHoldStart: () => void;
  onHoldEnd: () => void;
}) {
  if (stage === 0) {
    return (
      <div className="mt-5 text-center">
        <h2 className="font-serif text-2xl text-burgundy">A carta chegou</h2>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-ink/75">
          Sua resposta já foi guardada. Agora o lacre abre devagar, como se
          Alex e Paloma estivessem lendo juntos.
        </p>
        <button
          type="button"
          onClick={() => onInteract("seal-open")}
          disabled={interacted}
          className="wax-seal focus-ring mx-auto mt-8 flex h-20 w-20 items-center justify-center rounded-full text-ivory disabled:opacity-80"
          aria-label="Abrir o lacre da resposta"
        >
          <span className="font-script text-2xl">A&P</span>
        </button>
        <p className="mt-3 text-xs text-olive">
          {interacted ? "Lacre aberto. Estamos lendo." : "Toque o lacre para abrir"}
        </p>
      </div>
    );
  }

  if (stage === 1) {
    return (
      <div className="mt-5 text-center">
        <h2 className="font-serif text-2xl text-burgundy">Lendo com calma</h2>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-ink/75">
          Há mais de um João e mais de uma Carolina. Por isso não confirmamos
          só pelo primeiro nome. {capitalize(name)}, este é você?
        </p>
        <p className="script-line mt-6 text-4xl text-burgundy">{capitalize(name)}</p>
        <button
          type="button"
          onClick={() => onInteract("name")}
          disabled={interacted}
          className="ink-button focus-ring mx-auto mt-6 min-h-12 rounded-full bg-burgundy px-6 text-sm tracking-[0.16em] text-ivory uppercase disabled:opacity-70"
        >
          {interacted ? "Nome conferido" : "Sim, este sou eu"}
        </button>
      </div>
    );
  }

  if (stage === 2) {
    const options = attending ? SEAT_CHOICES : ABSENCE_CHOICES;
    return (
      <div className="mt-5 text-center">
        <h2 className="font-serif text-2xl text-burgundy">
          {attending ? "Preparando o seu lugar" : "Um lugar no coração"}
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-ink/75">
          {attending
            ? "Ainda não é a lista final. É o jeito que você imagina estar nesse encontro."
            : "Mesmo de longe, você continua fazendo parte da história."}
        </p>
        <div className="mt-6 grid gap-2">
          {options.map((option) => {
            const selected = choice === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onInteract(option.id)}
                className={`focus-ring rounded-[18px] border px-4 py-3 text-left ${
                  selected
                    ? "border-burgundy bg-burgundy text-ivory"
                    : "border-line bg-[#fbf6ee] text-ink"
                }`}
              >
                <span className="block font-serif text-lg">{option.label}</span>
                <span className={`mt-1 block text-sm ${selected ? "text-ivory/75" : "text-ink/60"}`}>
                  {option.note}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (stage === 3) {
    return (
      <div className="mt-5 text-center">
        <h2 className="font-serif text-2xl text-burgundy">Um desejo para o dia</h2>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-ink/75">
          Escolha um recado. Ele fica neste encontro, com a gente.
        </p>
        <div className="mt-6 grid gap-2">
          {WISHES.map((wish) => (
            <button
              key={wish.id}
              type="button"
              onClick={() => onInteract(wish.id)}
              className={`focus-ring rounded-[18px] border px-4 py-3 font-serif text-lg ${
                choice === wish.id
                  ? "border-burgundy bg-burgundy text-ivory"
                  : "border-line bg-[#fbf6ee] text-burgundy"
              }`}
            >
              {wish.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-5 text-center">
        <h2 className="font-serif text-2xl text-burgundy">Selando a resposta</h2>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-ink/75">
          Segure o lacre até ele aquecer. Depois disso, a carta se abre.
        </p>
      <button
        type="button"
        onPointerDown={onHoldStart}
        onPointerUp={onHoldEnd}
        onPointerLeave={onHoldEnd}
        onPointerCancel={onHoldEnd}
        disabled={interacted}
        className="wax-seal focus-ring relative mx-auto mt-8 flex h-24 w-24 items-center justify-center rounded-full text-ivory disabled:opacity-80"
        aria-label="Pressionar o lacre para selar a resposta"
      >
        <span
          className="pointer-events-none absolute inset-1 rounded-full border-2 border-ivory/40"
          style={{
            clipPath: `inset(${(1 - hold) * 100}% 0 0 0)`,
          }}
        />
        <span className="font-script text-3xl">A&P</span>
      </button>
      <p className="mt-3 text-xs text-olive">
        {interacted ? "Lacre quente. Estamos fechando a carta." : "Pressione e segure"}
      </p>
    </div>
  );
}

function capitalize(value: string) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}
