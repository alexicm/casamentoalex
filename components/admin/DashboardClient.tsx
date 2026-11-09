"use client";

import { useMemo, useState } from "react";
import { signOut } from "@/app/admin/actions";
import type { AdminGuest } from "@/lib/rsvp/admin-view";
import { companionLabel, guestConfirmedViaSite } from "@/lib/rsvp/seats";

type Guest = AdminGuest;

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
  submissions: unknown[];
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

export function DashboardClient({
  guests,
  stats,
  localMode = false,
}: DashboardClientProps) {
  const [query, setQuery] = useState("");
  const [owner, setOwner] = useState("all");

  const confirmed = useMemo(
    () =>
      guests.filter((guest) =>
        guestConfirmedViaSite({
          officialStatus: guest.official_status,
          confirmationSource: guest.confirmation_source,
        }),
      ),
    [guests],
  );

  const declined = useMemo(
    () => guests.filter((guest) => guest.official_status === "declined"),
    [guests],
  );

  const filtered = useMemo(() => {
    return confirmed.filter((guest) => {
      const matchesQuery = guest.display_name.toLowerCase().includes(query.toLowerCase());
      const matchesOwner = owner === "all" || guest.group_owner === owner;
      return matchesQuery && matchesOwner;
    });
  }, [confirmed, owner, query]);

  return (
    <main className="admin-shell paper-bg min-h-svh px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Organização</p>
            <h1 className="mt-2 font-serif text-4xl text-olive">Painel Alex & Paloma</h1>
            <p className="mt-2 text-sm text-ink/70">
              Só quem confirmou pelo site aparece aqui, com acompanhante e se a
              criança até 10 anos não conta lugar.
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
          <Stat label="Confirmados pelo site" value={stats.siteConfirmed} />
          <Stat label="Lugares" value={stats.seats} />
          <Stat label="Acompanhantes adultos" value={stats.adultCompanions} />
          <Stat label="Crianças até 10" value={stats.children} />
          <Stat label="Recusas" value={stats.declined} />
        </section>

        <section className="rounded-[24px] border border-olive/10 bg-paper-light p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-serif text-2xl text-olive">Quem confirmou</h2>
              <p className="text-sm text-ink/70">
                {filtered.length}{" "}
                {filtered.length === 1 ? "pessoa" : "pessoas"} na lista de confirmação
              </p>
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
              <a
                href="/api/admin/export"
                className="focus-ring flex min-h-11 items-center rounded-full bg-olive px-4 text-sm text-paper-light"
              >
                Exportar CSV
              </a>
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="mt-6 text-sm text-ink/70">Ainda ninguém confirmou pelo site.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="text-olive">
                    <th className="py-2 pr-3">Nome</th>
                    <th className="py-2 pr-3">Lista</th>
                    <th className="py-2 pr-3">Acompanhante</th>
                    <th className="py-2">Contato</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((guest) => (
                    <tr key={guest.id} className="border-t border-olive/10">
                      <td className="py-3 pr-3 font-medium">{guest.display_name}</td>
                      <td className="py-3 pr-3">{guest.group_owner}</td>
                      <td className="py-3 pr-3">
                        {companionLabel({
                          officialStatus: guest.official_status,
                          confirmationSource: guest.confirmation_source,
                          bringingCompanion: guest.bringing_companion,
                          companionName: guest.companion_name,
                          companionIsChild: guest.companion_is_child,
                        })}
                      </td>
                      <td className="py-3">{guest.preferred_contact ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {declined.length > 0 ? (
            <p className="mt-6 text-sm text-ink/60">
              Não vão: {declined.map((guest) => guest.display_name).join(", ")}.
            </p>
          ) : null}
        </section>
      </div>
    </main>
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
