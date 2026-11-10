"use client";

import { CalendarPlus, MapPin } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { SplitScale } from "@/components/motion/SplitScale";
import type { PublicEvent } from "@/lib/event/defaults";
import { formatRsvpDeadline, publicLocationLine } from "@/lib/event/defaults";

type EventDetailsProps = {
  event: PublicEvent;
};

function formatStartTime(startsAtLocal: string) {
  const [hour = "0", minute = "00"] = startsAtLocal.split(":");
  return minute === "00" ? `${Number(hour)}h` : `${Number(hour)}h${minute}`;
}

function remainingParts(eventDate: string, startsAtLocal: string) {
  const target = new Date(`${eventDate}T${startsAtLocal}:00-03:00`);
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return null;
  const totalMinutes = Math.floor(diff / 60000);
  return {
    days: Math.floor(totalMinutes / (60 * 24)),
    hours: Math.floor((totalMinutes % (60 * 24)) / 60),
    minutes: totalMinutes % 60,
  };
}

export function EventDetails({ event }: EventDetailsProps) {
  const [open, setOpen] = useState(false);
  const [parts, setParts] = useState(() =>
    remainingParts(event.eventDate, event.startsAtLocal),
  );
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      setParts(remainingParts(event.eventDate, event.startsAtLocal));
    }, 30000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [event.eventDate, event.startsAtLocal]);

  const prettyDate = useMemo(
    () =>
      new Intl.DateTimeFormat("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: event.timezone,
      }).format(new Date(`${event.eventDate}T12:00:00-03:00`)),
    [event.eventDate, event.timezone],
  );

  return (
    <section id="grande-dia" className="px-5 py-16 sm:py-24">
      <div className="section-shell">
        <p className="eyebrow text-center">O encontro</p>
        <SplitScale className="mt-3 text-center font-serif text-3xl text-burgundy sm:text-4xl">
          No dia 20 de dezembro
        </SplitScale>

        <article className="paper-card mt-10 p-6 text-center">
          <p className="font-serif text-2xl capitalize text-ink">{prettyDate}</p>
          <p className="mt-2 text-sm tracking-[0.18em] text-olive uppercase">
            A partir das {formatStartTime(event.startsAtLocal)}
          </p>
          {formatRsvpDeadline(event.rsvpDeadline) ? (
            <p className="mt-3 text-sm leading-relaxed text-ink/70">
              Confirmação até {formatRsvpDeadline(event.rsvpDeadline)}. Se
              levar convidado, informe o nome. Criança até 10 anos não conta
              lugar.
            </p>
          ) : null}
          <div className="hairline my-6" />
          <button
            type="button"
            className="focus-ring mx-auto block"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <p className="font-serif text-2xl text-burgundy">{event.venueName}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink/75">
              {publicLocationLine(event)}
            </p>
          </button>
          {open ? (
            <p className="mt-4 text-sm leading-relaxed text-ink/70">
              O endereço completo fica com quem estará conosco. Use o mapa para
              chegar ao BuGú Delícias, em Taguatinga.
            </p>
          ) : null}
          {parts ? (
            <p className="mt-5 text-xs tracking-[0.2em] text-taupe uppercase">
              Faltam {parts.days}d {parts.hours}h {parts.minutes}min
            </p>
          ) : (
            <p className="mt-5 text-xs tracking-[0.2em] text-olive uppercase">
              O encontro chegou
            </p>
          )}
        </article>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <a
            href={event.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="ink-button focus-ring flex min-h-12 items-center justify-center gap-2 rounded-full bg-burgundy px-5 text-sm tracking-[0.14em] text-ivory uppercase"
          >
            <MapPin size={16} aria-hidden="true" />
            Como chegar
          </a>
          <a
            href="/api/calendar"
            className="focus-ring flex min-h-12 items-center justify-center gap-2 rounded-full border border-line px-5 text-sm tracking-[0.14em] text-burgundy uppercase"
          >
            <CalendarPlus size={16} aria-hidden="true" />
            Adicionar ao calendário
          </a>
        </div>
      </div>
    </section>
  );
}
