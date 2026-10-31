"use client";

import { useState } from "react";
import { composeSubmittedName, needsLastName } from "@/lib/rsvp/normalize";

type RSVPFormProps = {
  inviteToken?: string;
  setupPending: boolean;
  onAnswered?: () => void;
};

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | {
      kind: "success";
      attending: boolean;
      validated: boolean;
    };

export function RSVPForm({ inviteToken, setupPending, onAnswered }: RSVPFormProps) {
  const [attending, setAttending] = useState<boolean | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [singleGivenName, setSingleGivenName] = useState(false);
  const [contact, setContact] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (attending === null) {
      setStatus({ kind: "error", message: "Escolha se poderá estar presente." });
      return;
    }

    const formData = new FormData(event.currentTarget);
    const submittedFirst = String(formData.get("firstName") ?? firstName);
    const submittedLast = singleGivenName
      ? ""
      : String(formData.get("lastName") ?? lastName);
    const fullName = composeSubmittedName(submittedFirst, submittedLast);
    if (needsLastName(submittedFirst, singleGivenName) && !submittedLast) {
      setStatus({
        kind: "error",
        message: "Escreva também o sobrenome, como no convite.",
      });
      return;
    }
    if (fullName.length < 2) {
      setStatus({ kind: "error", message: "Escreva seu nome como no convite." });
      return;
    }

    setStatus({ kind: "loading" });
    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          attending,
          contact,
          consent,
          website,
          inviteToken,
        }),
      });
      const payload = (await response.json()) as {
        message?: string;
        validated?: boolean;
        attending?: boolean;
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
      setStatus({
        kind: "success",
        attending: payload.attending ?? attending,
        validated: Boolean(payload.validated),
      });
      onAnswered?.();
    } catch {
      setStatus({
        kind: "error",
        message: "Não foi possível enviar agora. Confira sua conexão e tente novamente.",
      });
    }
  }

  if (status.kind === "success") {
    const title = status.validated
      ? status.attending
        ? "Presença confirmada! Estamos muito felizes em dividir esse dia com você."
        : "Vamos sentir sua falta, mas agradecemos por nos avisar."
      : "Recebemos sua resposta com carinho. Obrigado por nos contar!";
    return (
      <section
        id="confirmar"
        className="px-5 py-16 sm:py-24"
        aria-live="polite"
      >
        <div className="section-shell rounded-[28px] border border-olive/10 bg-paper-light/80 p-8 text-center">
          <p className="eyebrow">Obrigado</p>
          <h2 className="mt-4 font-serif text-3xl text-olive">{title}</h2>
          {!status.validated ? (
            <p className="mt-4 text-sm leading-relaxed text-ink/75">
              Vamos conferir os detalhes com carinho. Isso ainda não é a
              confirmação final da lista.
            </p>
          ) : null}
        </div>
      </section>
    );
  }

  return (
    <section id="confirmar" className="px-5 py-16 sm:py-24">
      <form onSubmit={onSubmit} className="section-shell">
        <p className="eyebrow text-center">RSVP</p>
        <h2 className="mt-3 text-center font-serif text-3xl text-olive sm:text-4xl">
          Só falta você confirmar
        </h2>
        <p className="mx-auto mt-4 max-w-md text-center text-[0.98rem] leading-relaxed text-ink/80">
          Estamos preparando tudo com muito carinho. Para organizar cada
          detalhe, conta pra gente: podemos esperar por você?
        </p>

        {setupPending ? (
          <p
            className="mt-6 rounded-2xl border border-terracotta/30 bg-terracotta/10 px-4 py-3 text-sm text-wine"
            role="status"
          >
            As confirmações ainda estão sendo ligadas ao sistema. Você pode
            preencher o formulário, mas a resposta pode não ser gravada agora.
          </p>
        ) : null}

        <fieldset className="mt-8 grid gap-3 sm:grid-cols-2">
          <legend className="sr-only">Você estará presente?</legend>
          <Choice
            selected={attending === true}
            onSelect={() => setAttending(true)}
            label="Sim, estarei presente"
          />
          <Choice
            selected={attending === false}
            onSelect={() => setAttending(false)}
            label="Não poderei comparecer"
          />
        </fieldset>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm text-olive">Nome</span>
            <input
              required
              name="firstName"
              autoComplete="given-name"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              placeholder="Como no convite"
              className="focus-ring min-h-12 w-full rounded-2xl border border-olive/20 bg-paper-light px-4 text-base text-ink"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-olive">Sobrenome</span>
            <input
              name="lastName"
              autoComplete="family-name"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              placeholder="Como no convite"
              required={needsLastName(firstName, singleGivenName)}
              disabled={singleGivenName}
              className="focus-ring min-h-12 w-full rounded-2xl border border-olive/20 bg-paper-light px-4 text-base text-ink disabled:opacity-50"
            />
          </label>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-olive/80">
          Use o nome e o sobrenome pelos quais você foi convidado(a). Isso nos
          ajuda a encontrar você na lista sem misturar pessoas com o mesmo
          prenome.
        </p>

        <label className="mt-4 flex items-start gap-3 text-sm leading-relaxed text-ink/80">
          <input
            type="checkbox"
            checked={singleGivenName}
            onChange={(event) => {
              const checked = event.target.checked;
              setSingleGivenName(checked);
              if (checked) setLastName("");
            }}
            className="mt-1 h-5 w-5 accent-olive"
          />
          Meu nome no convite tem só uma palavra
        </label>

        <label className="mt-4 block">
          <span className="mb-2 block text-sm text-olive">
            WhatsApp <span className="text-sage">(opcional)</span>
          </span>
          <input
            name="contact"
            inputMode="tel"
            autoComplete="tel"
            value={contact}
            onChange={(event) => setContact(event.target.value)}
            placeholder="Para falarmos se precisar"
            className="focus-ring min-h-12 w-full rounded-2xl border border-olive/20 bg-paper-light px-4 text-base text-ink"
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

        <label className="mt-5 flex items-start gap-3 text-sm leading-relaxed text-ink/80">
          <input
            type="checkbox"
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
            className="mt-1 h-5 w-5 accent-olive"
            required
          />
          Autorizo o uso do meu nome e contato apenas para organização deste
          casamento.
        </label>

        {status.kind === "error" ? (
          <p className="mt-4 text-sm text-wine" role="alert">
            {status.message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={status.kind === "loading"}
          className="ink-button focus-ring mt-7 min-h-12 w-full rounded-full bg-wine px-6 text-sm tracking-[0.16em] text-paper-light uppercase disabled:opacity-60"
        >
          {status.kind === "loading" ? "Enviando..." : "Enviar minha resposta"}
        </button>
      </form>
    </section>
  );
}

function Choice({
  selected,
  onSelect,
  label,
}: {
  selected: boolean;
  onSelect: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`focus-ring min-h-12 rounded-full px-4 text-sm tracking-[0.04em] ${
        selected
          ? "bg-olive text-paper-light"
          : "border border-olive/20 bg-paper-light text-olive"
      }`}
    >
      {label}
    </button>
  );
}
