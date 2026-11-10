"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createRitual, firstNameOf, writeRitual } from "@/lib/confirmation-ritual";
import { formatRsvpDeadline, type PublicEvent } from "@/lib/event/defaults";

type RSVPFormProps = {
  event: PublicEvent;
  inviteToken?: string;
  setupPending: boolean;
};

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "error"; message: string };

function createIdempotencyKey() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `rsvp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function RSVPForm({ event, inviteToken, setupPending }: RSVPFormProps) {
  const deadlineLabel = formatRsvpDeadline(event.rsvpDeadline);
  const router = useRouter();
  const idempotencyKey = useRef(createIdempotencyKey());
  const [attending, setAttending] = useState<boolean | null>(null);
  const [fullName, setFullName] = useState("");
  const [bringingCompanion, setBringingCompanion] = useState(false);
  const [companionName, setCompanionName] = useState("");
  const [companionIsChild, setCompanionIsChild] = useState(false);
  const [contact, setContact] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const sending = useRef(false);

  function chooseAttendance(next: boolean) {
    setAttending(next);
    if (!next) {
      setBringingCompanion(false);
      setCompanionName("");
      setCompanionIsChild(false);
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
    if (attending === null) {
      setStatus({ kind: "error", message: "Escolha se poderá estar presente." });
      return;
    }

    const formData = new FormData(event.currentTarget);
    const submittedName = String(formData.get("fullName") ?? fullName).trim();
    if (submittedName.length < 2) {
      setStatus({ kind: "error", message: "Escreva seu nome." });
      return;
    }
    if (attending && bringingCompanion && companionName.trim().length < 2) {
      setStatus({ kind: "error", message: "Escreva o nome de quem vem com você." });
      return;
    }

    sending.current = true;
    setStatus({ kind: "loading" });
    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: submittedName,
          attending,
          contact,
          consent,
          website,
          inviteToken,
          idempotencyKey: idempotencyKey.current,
          bringingCompanion: attending ? bringingCompanion : false,
          companionName: attending && bringingCompanion ? companionName.trim() : "",
          companionIsChild: attending && bringingCompanion && companionIsChild,
        }),
      });
      const payload = (await response.json()) as {
        message?: string;
        receipt?: string;
      };
      if (!response.ok) {
        setStatus({
          kind: "error",
          message:
            payload.message ??
            "Não foi possível enviar agora. Confira sua conexão e tente novamente.",
        });
        return;
      }
      const ritual = createRitual({
        receipt: payload.receipt ?? "",
        attending,
        firstName: firstNameOf(submittedName),
      });
      writeRitual(ritual);
      const query = new URLSearchParams();
      if (payload.receipt) query.set("r", payload.receipt);
      query.set("p", attending ? "1" : "0");
      router.push(`/confirmando?${query.toString()}`);
    } catch {
      setStatus({
        kind: "error",
        message: "Não foi possível enviar agora. Confira sua conexão e tente novamente.",
      });
    } finally {
      sending.current = false;
    }
  }

  return (
    <section id="confirmar" className="px-5 py-16 sm:py-24">
      <form onSubmit={onSubmit} className="letter-sheet section-shell">
        <div className="letter-ribbon">
          <span className="font-script text-2xl text-ivory">A & P</span>
        </div>

        <p className="mt-7 text-center text-[0.7rem] tracking-[0.28em] text-olive uppercase">
          Confirmação
        </p>
        <h2 className="mt-3 text-center font-serif text-3xl text-burgundy sm:text-4xl">
          Confirma sua presença
        </h2>
        {deadlineLabel ? (
          <p className="mx-auto mt-4 max-w-md text-center font-serif text-xl text-burgundy">
            Confirme até {deadlineLabel}.
          </p>
        ) : null}
        <p className="mx-auto mt-3 max-w-md text-center text-[0.98rem] leading-relaxed text-ink/80">
          Qualquer pessoa pode confirmar. Escreva seu nome e, se for levar
          convidado, coloque o nome dele também. Nós validamos depois.
        </p>
        <p className="mx-auto mt-3 max-w-md rounded-[16px] border border-olive/15 bg-[#f7f1e7] px-4 py-3 text-center text-sm leading-relaxed text-ink/80">
          <span className="font-medium text-burgundy">Importante:</span> criança
          de até 10 anos é bem-vinda e deve ser informada, mas{" "}
          <span className="font-medium text-burgundy">não conta como lugar</span>{" "}
          na mesa.
        </p>

        {setupPending ? (
          <p className="mt-5 rounded-xl border border-terracotta/30 bg-terracotta/8 px-4 py-3 text-sm text-wine-soft" role="status">
            As confirmações ainda estão sendo ligadas ao sistema. Você pode
            preencher, mas a resposta pode não ser gravada agora.
          </p>
        ) : null}

        <fieldset className="mt-8 grid gap-3">
          <legend className="sr-only">Você estará presente?</legend>
          <Choice
            selected={attending === true}
            onSelect={() => chooseAttendance(true)}
            title="Sim, estarei presente"
            note="Quero fazer parte desse encontro."
          />
          <Choice
            selected={attending === false}
            onSelect={() => chooseAttendance(false)}
            title="Não poderei comparecer"
            note="Vou sentir falta, mas aviso com carinho."
          />
        </fieldset>

        <label className="mt-8 block">
          <span className="mb-1 block text-[0.7rem] tracking-[0.18em] text-olive uppercase">
            Seu nome completo
          </span>
          <input
            required
            name="fullName"
            autoComplete="name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Seu nome"
            className="letter-field focus-ring min-h-12 w-full bg-transparent px-1 text-lg text-ink"
          />
        </label>
        <p className="mt-2 text-xs leading-relaxed text-ink/55">
          Pode escrever o nome como você usa no dia a dia.
        </p>

        {attending ? (
          <fieldset className="mt-8 grid gap-3">
            <legend className="mb-1 text-[0.7rem] tracking-[0.18em] text-olive uppercase">
              Vai levar convidado?
            </legend>
            <p className="mb-1 text-sm leading-relaxed text-ink/65">
              Se levar alguém, o nome dele também entra na confirmação.
            </p>
            <Choice
              selected={!bringingCompanion}
              onSelect={() => {
                setBringingCompanion(false);
                setCompanionName("");
                setCompanionIsChild(false);
              }}
              title="Não, vou sozinho(a)"
              note="Um lugar na mesa já está reservado para você."
            />
            <Choice
              selected={bringingCompanion}
              onSelect={() => setBringingCompanion(true)}
              title="Sim, vou levar alguém"
              note="Adulto conta lugar. Criança até 10 anos não conta."
            />
          </fieldset>
        ) : null}

        {attending && bringingCompanion ? (
          <div className="mt-6 rounded-[18px] border border-olive/15 bg-[#fbf6ee] px-4 py-5">
            <label className="block">
              <span className="mb-1 block text-[0.7rem] tracking-[0.18em] text-olive uppercase">
                Nome do convidado
              </span>
              <input
                required
                name="companionName"
                autoComplete="off"
                value={companionName}
                onChange={(event) => setCompanionName(event.target.value)}
                placeholder="Nome de quem vem com você"
                className="letter-field focus-ring min-h-12 w-full bg-transparent px-1 text-lg text-ink"
              />
            </label>
            <label className="mt-4 flex items-start gap-3 text-sm leading-relaxed text-ink/80">
              <input
                type="checkbox"
                checked={companionIsChild}
                onChange={(event) => setCompanionIsChild(event.target.checked)}
                className="mt-1 h-5 w-5 accent-burgundy"
              />
              <span>
                É criança de até 10 anos. Pode vir, mas{" "}
                <span className="font-medium text-burgundy">não conta lugar</span>{" "}
                na mesa.
              </span>
            </label>
            {companionIsChild ? (
              <p className="mt-3 text-sm leading-relaxed text-ink/65">
                Combinado: a criança entra na lista e não ocupa assento extra.
              </p>
            ) : (
              <p className="mt-3 text-sm leading-relaxed text-ink/65">
                Se for adulto, vamos reservar um lugar a mais.
              </p>
            )}
          </div>
        ) : null}

        <label className="mt-6 block">
          <span className="mb-1 block text-[0.7rem] tracking-[0.18em] text-olive uppercase">
            WhatsApp <span className="normal-case tracking-normal text-ink/45">(opcional)</span>
          </span>
          <input
            name="contact"
            inputMode="tel"
            autoComplete="tel"
            value={contact}
            onChange={(event) => setContact(event.target.value)}
            placeholder="Para falarmos se precisar"
            className="letter-field focus-ring min-h-12 w-full bg-transparent px-1 text-lg text-ink"
          />
        </label>

        <div aria-hidden="true" className="hidden">
          <input
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
          />
        </div>

        <label className="mt-6 flex items-start gap-3 text-sm leading-relaxed text-ink/75">
          <input
            type="checkbox"
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
            className="mt-1 h-5 w-5 accent-burgundy"
            required
          />
          Autorizo o uso do meu nome e contato apenas para organização deste
          encontro.
        </label>

        {status.kind === "error" ? (
          <p className="mt-4 text-sm text-wine-soft" role="alert">
            {status.message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={status.kind === "loading"}
          className="ink-button focus-ring mt-8 min-h-12 w-full rounded-full bg-burgundy px-6 text-sm tracking-[0.16em] text-ivory uppercase disabled:opacity-60"
        >
          {status.kind === "loading" ? "Enviando..." : "Enviar minha resposta"}
        </button>
        <p className="mx-auto mt-5 max-w-md text-center text-sm leading-relaxed text-ink/65">
          O resto a gente constrói junto.
        </p>
      </form>
    </section>
  );
}

function Choice({
  selected,
  onSelect,
  title,
  note,
}: {
  selected: boolean;
  onSelect: () => void;
  title: string;
  note: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`focus-ring rounded-[18px] border px-4 py-4 text-left ${
        selected
          ? "border-burgundy bg-burgundy text-ivory"
          : "border-line bg-[#fbf6ee] text-ink"
      }`}
    >
      <span className="block font-serif text-xl">{title}</span>
      <span className={`mt-1 block text-sm ${selected ? "text-ivory/75" : "text-ink/60"}`}>
        {note}
      </span>
    </button>
  );
}
