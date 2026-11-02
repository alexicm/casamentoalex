"use client";

import { useMemo, useState, useTransition } from "react";
import {
  createGuest,
  createGuestFromSubmission,
  discardSubmission,
  generateInviteLink,
  linkSubmission,
  signOut,
  updateEventSettings,
  updateGuestStatus,
} from "@/app/admin/actions";
import type { AdminGuest } from "@/lib/rsvp/admin-view";
import { companionLabel, guestIsConfirmed } from "@/lib/rsvp/seats";

type Guest = AdminGuest;

type Submission = {
  id: string;
  submitted_full_name: string;
  attendance_choice: boolean;
  optional_contact: string | null;
  matching_state: string;
  review_status: string;
  submitted_at: string;
  suggested_guest_ids: string[];
};

type EventRow = {
  venue_name: string;
  venue_address: string;
  maps_url: string;
  starts_at_local: string;
  dress_code_json: { title?: string; subtitle?: string };
};

type DashboardClientProps = {
  event: EventRow;
  guests: Guest[];
  submissions: Submission[];
  audit: { id: string; action: string; created_at: string }[];
  stats: {
    total: number;
    historicalConfirmed: number;
    awaiting: number;
    siteConfirmed: number;
    declined: number;
    pendingReview: number;
    responseRate: number;
    seats: number;
    adultCompanions: number;
    children: number;
  };
  localMode?: boolean;
};

const STATUS_LABEL: Record<string, string> = {
  awaiting_response: "Pendente",
  manually_confirmed: "Confirmado (manual)",
  confirmed_via_token: "Confirmado no site",
  declined: "Não vai",
  duplicate_flagged: "Possível duplicata",
};

export function DashboardClient({
  event,
  guests,
  submissions,
  audit,
  stats,
  localMode = false,
}: DashboardClientProps) {
  const [query, setQuery] = useState("");
  const [owner, setOwner] = useState("all");
  const [status, setStatus] = useState("all");
  const [inviteUrl, setInviteUrl] = useState("");
  const [inviteQr, setInviteQr] = useState("");
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    return guests.filter((guest) => {
      const matchesQuery = guest.display_name.toLowerCase().includes(query.toLowerCase());
      const matchesOwner = owner === "all" || guest.group_owner === owner;
      const matchesStatus = status === "all" || guest.official_status === status;
      return matchesQuery && matchesOwner && matchesStatus;
    });
  }, [guests, owner, query, status]);

  const queue = submissions.filter(
    (item) => item.review_status === "pending_review" || item.review_status === "duplicate_flagged",
  );

  return (
    <main className="admin-shell paper-bg min-h-svh px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Organização</p>
            <h1 className="mt-2 font-serif text-4xl text-olive">Painel Alex & Paloma</h1>
            <p className="mt-2 text-sm text-ink/70">
              Aqui aparece quem da lista confirmou, se leva alguém e se a criança
              até 10 anos não entra na conta de lugares.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {localMode ? (
              <p className="rounded-full bg-sage/20 px-4 py-2 text-sm text-olive">
                Respostas locais
              </p>
            ) : null}
            <form action={signOut}>
              <button className="focus-ring min-h-11 rounded-full border border-olive/20 px-4 text-sm">
                Sair
              </button>
            </form>
          </div>
        </header>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Convidados" value={stats.total} />
          <Stat label="Confirmados históricos" value={stats.historicalConfirmed} />
          <Stat label="Pendentes históricos" value={stats.awaiting} />
          <Stat label="Confirmados pelo site" value={stats.siteConfirmed} />
          <Stat label="Lugares" value={stats.seats} />
          <Stat label="Acompanhantes adultos" value={stats.adultCompanions} />
          <Stat label="Crianças até 10" value={stats.children} />
          <Stat label="Recusas" value={stats.declined} />
          <Stat label="Em análise" value={stats.pendingReview} />
          <Stat label="Taxa de resposta" value={`${stats.responseRate}%`} />
        </section>

        <ConfirmedList guests={guests} />

        {localMode ? null : (
        <section className="rounded-[24px] border border-olive/10 bg-paper-light p-5">
          <h2 className="font-serif text-2xl text-olive">Fila de revisão</h2>
          {queue.length === 0 ? (
            <p className="mt-3 text-sm text-ink/70">Nenhuma resposta aguardando decisão.</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {queue.map((item) => (
                <li key={item.id} className="rounded-2xl border border-olive/10 p-4">
                  <p className="font-medium">{item.submitted_full_name}</p>
                  <p className="text-sm text-olive">
                    {item.attendance_choice ? "Vai" : "Não vai"} · {item.matching_state} ·{" "}
                    {item.review_status}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.suggested_guest_ids.map((guestId) => {
                      const guest = guests.find((entry) => entry.id === guestId);
                      return (
                        <button
                          key={guestId}
                          type="button"
                          className="focus-ring min-h-11 rounded-full bg-olive px-4 text-xs text-paper-light"
                          onClick={() =>
                            startTransition(() => linkSubmission(item.id, guestId))
                          }
                        >
                          Vincular a {guest?.display_name ?? "registro"}
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      className="focus-ring min-h-11 rounded-full border border-olive/20 px-4 text-xs"
                      onClick={() =>
                        startTransition(() => createGuestFromSubmission(item.id, "Alex"))
                      }
                    >
                      Criar na lista Alex
                    </button>
                    <button
                      type="button"
                      className="focus-ring min-h-11 rounded-full border border-olive/20 px-4 text-xs"
                      onClick={() =>
                        startTransition(() => createGuestFromSubmission(item.id, "Paloma"))
                      }
                    >
                      Criar na lista Paloma
                    </button>
                    <button
                      type="button"
                      className="focus-ring min-h-11 rounded-full px-4 text-xs text-wine"
                      onClick={() => startTransition(() => discardSubmission(item.id))}
                    >
                      Descartar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
        )}

        <section className="rounded-[24px] border border-olive/10 bg-paper-light p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-serif text-2xl text-olive">Lista</h2>
              <p className="text-sm text-ink/70">{filtered.length} registros visíveis</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar nome"
                className="focus-ring min-h-11 rounded-full border border-olive/20 px-4"
              />
              <select
                value={owner}
                onChange={(event) => setOwner(event.target.value)}
                className="focus-ring min-h-11 rounded-full border border-olive/20 px-3"
              >
                <option value="all">Todos</option>
                <option value="Alex">Alex</option>
                <option value="Paloma">Paloma</option>
              </select>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="focus-ring min-h-11 rounded-full border border-olive/20 px-3"
              >
                <option value="all">Qualquer status</option>
                <option value="awaiting_response">Pendente</option>
                <option value="manually_confirmed">Confirmado manual</option>
                <option value="confirmed_via_token">Confirmado no site</option>
                <option value="declined">Não vai</option>
              </select>
              <a
                href="/api/admin/export"
                className="focus-ring flex min-h-11 items-center rounded-full bg-olive px-4 text-sm text-paper-light"
              >
                Exportar CSV
              </a>
            </div>
          </div>

          {localMode ? null : (
          <form
            className="mt-4 flex flex-col gap-2 sm:flex-row"
            action={createGuest}
          >
            <input
              name="displayName"
              required
              placeholder="Novo convidado"
              className="focus-ring min-h-11 flex-1 rounded-full border border-olive/20 px-4"
            />
            <select
              name="groupOwner"
              className="focus-ring min-h-11 rounded-full border border-olive/20 px-3"
            >
              <option>Alex</option>
              <option>Paloma</option>
            </select>
            <button className="focus-ring min-h-11 rounded-full bg-wine px-4 text-sm text-paper-light">
              Adicionar
            </button>
          </form>
          )}

          {inviteUrl ? (
            <div className="mt-3 rounded-2xl bg-sage/20 p-4 text-sm">
              <p className="break-all">
                Link gerado (o anterior deixa de valer): {inviteUrl}
              </p>
              {inviteQr ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={inviteQr} alt="QR code do convite pessoal" className="mt-3 h-40 w-40" />
              ) : null}
            </div>
          ) : null}

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="text-olive">
                  <th className="py-2 pr-3">Nome</th>
                  <th className="py-2 pr-3">Lista</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 pr-3">Origem</th>
                  <th className="py-2 pr-3">Acompanhante</th>
                  {localMode ? null : <th className="py-2">Ações</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map((guest) => (
                  <tr key={guest.id} className="border-t border-olive/10">
                    <td className="py-3 pr-3">{guest.display_name}</td>
                    <td className="py-3 pr-3">{guest.group_owner}</td>
                    <td className="py-3 pr-3">
                      {STATUS_LABEL[guest.official_status] ?? guest.official_status}
                    </td>
                    <td className="py-3 pr-3">{guest.confirmation_source}</td>
                    <td className="py-3 pr-3">
                      {companionLabel({
                        officialStatus: guest.official_status,
                        confirmationSource: guest.confirmation_source,
                        bringingCompanion: guest.bringing_companion,
                        companionName: guest.companion_name,
                        companionIsChild: guest.companion_is_child,
                      })}
                    </td>
                    {localMode ? null : (
                    <td className="py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="underline"
                          onClick={() =>
                            startTransition(() =>
                              updateGuestStatus(guest.id, "manually_confirmed"),
                            )
                          }
                        >
                          Confirmar
                        </button>
                        <button
                          type="button"
                          className="underline"
                          onClick={() =>
                            startTransition(() => updateGuestStatus(guest.id, "declined"))
                          }
                        >
                          Ausência
                        </button>
                        <button
                          type="button"
                          className="underline"
                          onClick={() =>
                            startTransition(async () => {
                              const result = await generateInviteLink(guest.id);
                              setInviteUrl(result.url);
                              setInviteQr(result.qr);
                            })
                          }
                        >
                          Gerar link
                        </button>
                      </div>
                    </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pending ? <p className="mt-3 text-sm text-olive">Atualizando...</p> : null}
        </section>

        {localMode ? null : (
        <>
        <section className="rounded-[24px] border border-olive/10 bg-paper-light p-5">
          <h2 className="font-serif text-2xl text-olive">Dados do evento</h2>
          <form action={updateEventSettings} className="mt-4 grid gap-3">
            <label className="text-sm">
              Local
              <input
                name="venueName"
                defaultValue={event.venue_name}
                className="focus-ring mt-1 min-h-11 w-full rounded-2xl border border-olive/20 px-3"
              />
            </label>
            <label className="text-sm">
              Endereço
              <input
                name="venueAddress"
                defaultValue={event.venue_address}
                className="focus-ring mt-1 min-h-11 w-full rounded-2xl border border-olive/20 px-3"
              />
            </label>
            <label className="text-sm">
              URL do Google Maps
              <input
                name="mapsUrl"
                defaultValue={event.maps_url}
                className="focus-ring mt-1 min-h-11 w-full rounded-2xl border border-olive/20 px-3"
              />
            </label>
            <label className="text-sm">
              Horário de abertura
              <input
                name="startsAtLocal"
                defaultValue={String(event.starts_at_local).slice(0, 5)}
                className="focus-ring mt-1 min-h-11 w-full rounded-2xl border border-olive/20 px-3"
              />
            </label>
            <label className="text-sm">
              Dress code
              <input
                name="dressTitle"
                defaultValue={event.dress_code_json?.title ?? "Coquetel elegante"}
                className="focus-ring mt-1 min-h-11 w-full rounded-2xl border border-olive/20 px-3"
              />
            </label>
            <label className="text-sm">
              Texto do dress code
              <input
                name="dressSubtitle"
                defaultValue={event.dress_code_json?.subtitle ?? ""}
                className="focus-ring mt-1 min-h-11 w-full rounded-2xl border border-olive/20 px-3"
              />
            </label>
            <button className="ink-button focus-ring min-h-12 rounded-full bg-olive px-5 text-sm text-paper-light">
              Salvar evento
            </button>
          </form>
        </section>

        <section className="rounded-[24px] border border-olive/10 bg-paper-light p-5">
          <h2 className="font-serif text-2xl text-olive">Histórico recente</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {audit.map((item) => (
              <li key={item.id}>
                {new Date(item.created_at).toLocaleString("pt-BR")} · {item.action}
              </li>
            ))}
          </ul>
        </section>
        </>
        )}
      </div>
    </main>
  );
}

function ConfirmedList({ guests }: { guests: Guest[] }) {
  const confirmed = guests.filter((guest) => guestIsConfirmed(guest.official_status));
  const declined = guests.filter((guest) => guest.official_status === "declined");

  return (
    <section className="rounded-[24px] border border-olive/10 bg-paper-light p-5">
      <h2 className="font-serif text-2xl text-olive">Quem confirmou</h2>
      <p className="mt-1 text-sm text-ink/70">
        {confirmed.length} da lista confirmados. Criança até 10 anos aparece, mas não
        soma lugar.
      </p>
      {confirmed.length === 0 ? (
        <p className="mt-3 text-sm text-ink/70">Ainda não há confirmações novas além da lista histórica.</p>
      ) : (
        <ul className="mt-4 divide-y divide-olive/10">
          {confirmed.map((guest) => (
            <li key={guest.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:justify-between">
              <div>
                <p className="font-medium">{guest.display_name}</p>
                <p className="text-sm text-olive">{guest.group_owner}</p>
              </div>
              <p className="text-sm text-ink/75">
                {companionLabel({
                  officialStatus: guest.official_status,
                  confirmationSource: guest.confirmation_source,
                  bringingCompanion: guest.bringing_companion,
                  companionName: guest.companion_name,
                  companionIsChild: guest.companion_is_child,
                })}
              </p>
            </li>
          ))}
        </ul>
      )}
      {declined.length > 0 ? (
        <p className="mt-4 text-sm text-ink/60">
          Não vão: {declined.map((guest) => guest.display_name).join(", ")}.
        </p>
      ) : null}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <article className="rounded-[24px] border border-olive/10 bg-paper-light p-4">
      <p className="text-xs tracking-[0.18em] text-sage uppercase">{label}</p>
      <p className="mt-2 font-serif text-3xl text-olive">{value}</p>
    </article>
  );
}
