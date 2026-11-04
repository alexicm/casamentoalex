"use client";

import { CalendarPlus } from "lucide-react";
import { buildCalendarLinks } from "@/lib/calendar/links";
import { DEFAULT_EVENT } from "@/lib/event/defaults";

type CalendarAddProps = {
  className?: string;
};

export function CalendarAdd({ className = "" }: CalendarAddProps) {
  const links = buildCalendarLinks(DEFAULT_EVENT);

  return (
    <div className={`w-full max-w-sm ${className}`}>
      <p className="flex items-center justify-center gap-2 text-[0.68rem] tracking-[0.22em] text-olive uppercase">
        <CalendarPlus size={14} aria-hidden="true" />
        Adicionar à agenda
      </p>
      <p className="mt-2 text-center text-sm leading-relaxed text-ink/65">
        20 de dezembro de 2026, a partir das 17h30.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <CalendarLink href={links.google} label="Google" note="Gmail" />
        <CalendarLink href={links.outlook} label="Outlook" note="Hotmail" />
        <CalendarLink href={links.apple} label="Apple" note="iPhone e Mac" download />
        <CalendarLink href={links.ics} label="Outras" note="Arquivo .ics" download />
      </div>
    </div>
  );
}

function CalendarLink({
  href,
  label,
  note,
  download,
}: {
  href: string;
  label: string;
  note: string;
  download?: boolean;
}) {
  return (
    <a
      href={href}
      target={download ? undefined : "_blank"}
      rel={download ? undefined : "noreferrer"}
      className="focus-ring rounded-[16px] border border-line bg-[#fbf6ee] px-3 py-3 text-left"
    >
      <span className="block font-serif text-lg text-burgundy">{label}</span>
      <span className="mt-0.5 block text-xs text-ink/55">{note}</span>
    </a>
  );
}
