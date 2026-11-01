import { DEFAULT_EVENT, type PublicEvent } from "@/lib/event/defaults";

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function stamp(date: Date): string {
  return [
    date.getUTCFullYear(),
    pad(date.getUTCMonth() + 1),
    pad(date.getUTCDate()),
    "T",
    pad(date.getUTCHours()),
    pad(date.getUTCMinutes()),
    pad(date.getUTCSeconds()),
    "Z",
  ].join("");
}

function fold(line: string): string {
  if (line.length <= 75) return line;
  const chunks = [line.slice(0, 75)];
  for (let i = 75; i < line.length; i += 74) {
    chunks.push(` ${line.slice(i, i + 74)}`);
  }
  return chunks.join("\r\n");
}

export function buildIcs(event: PublicEvent = DEFAULT_EVENT): string {
  const dtstart = `${event.eventDate.replaceAll("-", "")}T${event.startsAtLocal.replace(":", "")}00`;
  const now = stamp(new Date());
  const durationHours = event.calendarDurationHours;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Alex e Paloma//Casamento//PT-BR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VTIMEZONE",
    "TZID:America/Sao_Paulo",
    "BEGIN:STANDARD",
    "DTSTART:20190217T000000",
    "TZOFFSETFROM:-0300",
    "TZOFFSETTO:-0300",
    "TZNAME:-03",
    "END:STANDARD",
    "END:VTIMEZONE",
    "BEGIN:VEVENT",
    `UID:alex-paloma-2026@casamento`,
    `DTSTAMP:${now}`,
    `DTSTART;TZID=America/Sao_Paulo:${dtstart}`,
    `DURATION:PT${durationHours}H`,
    "SUMMARY:Casamento Alex & Paloma",
    `LOCATION:${event.venueName}\\, ${event.venueAddress}`,
    "DESCRIPTION:Encontro de Alex e Paloma a partir das 17h. Mais do que um casamento, um encontro. A duração neste arquivo é técnica e pode ser ajustada no seu calendário. Não há horário de encerramento oficial divulgado.",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}
