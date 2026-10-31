"use client";

import { CalendarPlus, MapPin } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import type { PublicEvent } from "@/lib/event/defaults";
import { gsap, registerGsap, useGSAP } from "@/lib/gsap/register";

type EventDetailsProps = {
  event: PublicEvent;
};

function daysUntil(eventDate: string, startsAtLocal: string) {
  const target = new Date(`${eventDate}T${startsAtLocal}:00-03:00`);
  const diff = target.getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function EventDetails({ event }: EventDetailsProps) {
  const rootRef = useRef<HTMLElement>(null);
  const [remaining] = useState(() => daysUntil(event.eventDate, event.startsAtLocal));
  registerGsap();

  useGSAP(
    () => {
      gsap.from(".detail-card", {
        autoAlpha: 0,
        y: 22,
        duration: 0.7,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 80%",
        },
      });
    },
    { scope: rootRef },
  );

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
    <section id="grande-dia" ref={rootRef} className="px-5 py-16 sm:py-24">
      <div className="section-shell">
        <p className="eyebrow text-center">O grande dia</p>
        <h2 className="mt-3 text-center font-serif text-3xl text-olive sm:text-4xl">
          Nosso encontro está marcado
        </h2>

        <article className="detail-card mt-10 rounded-[28px] border border-olive/10 bg-paper-light/70 p-6 text-center shadow-[0_18px_40px_rgba(56,56,47,0.06)]">
          <p className="font-serif text-2xl capitalize text-ink">{prettyDate}</p>
          <p className="mt-2 text-sm tracking-[0.18em] text-olive uppercase">
            A partir das {event.startsAtLocal.replace(":00", "h")}
          </p>
          <div className="hairline my-6" />
          <p className="font-serif text-2xl text-olive">{event.venueName}</p>
          <p className="mt-2 text-sm leading-relaxed text-ink/75">
            {event.venueAddress}
          </p>
          {remaining > 0 ? (
            <p className="mt-5 text-xs tracking-[0.2em] text-sage uppercase">
              Faltam {remaining} {remaining === 1 ? "dia" : "dias"}
            </p>
          ) : null}
        </article>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <a
            href={event.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="detail-card focus-ring ink-button flex min-h-12 items-center justify-center gap-2 rounded-full bg-olive px-5 text-sm tracking-[0.14em] text-paper-light uppercase"
          >
            <MapPin size={16} aria-hidden="true" />
            Como chegar
          </a>
          <a
            href="/api/calendar"
            className="detail-card focus-ring flex min-h-12 items-center justify-center gap-2 rounded-full border border-olive/25 px-5 text-sm tracking-[0.14em] text-olive uppercase"
          >
            <CalendarPlus size={16} aria-hidden="true" />
            Adicionar ao calendário
          </a>
        </div>
      </div>
    </section>
  );
}
