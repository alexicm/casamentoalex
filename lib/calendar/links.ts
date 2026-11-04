import { DEFAULT_EVENT, publicLocationLine, type PublicEvent } from "@/lib/event/defaults";

const TITLE = "Casamento Alex & Paloma";
const DETAILS =
  "Encontro de Alex e Paloma a partir das 17h30. Mais do que um casamento, um encontro. A duração no calendário é técnica e pode ser ajustada. Não há horário de encerramento oficial divulgado.";

export type CalendarLinks = {
  google: string;
  outlook: string;
  office: string;
  apple: string;
  ics: string;
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function clockAfter(startsAtLocal: string, hours: number) {
  const [hour, minute] = startsAtLocal.split(":").map(Number);
  return `${pad(hour + hours)}:${pad(minute)}`;
}

export function eventBounds(event: PublicEvent = DEFAULT_EVENT) {
  const endTime = clockAfter(event.startsAtLocal, event.calendarDurationHours);
  return {
    startCompact: `${event.eventDate.replaceAll("-", "")}T${event.startsAtLocal.replace(":", "")}00`,
    endCompact: `${event.eventDate.replaceAll("-", "")}T${endTime.replace(":", "")}00`,
    startIso: `${event.eventDate}T${event.startsAtLocal}:00`,
    endIso: `${event.eventDate}T${endTime}:00`,
  };
}

export function buildCalendarLinks(event: PublicEvent = DEFAULT_EVENT): CalendarLinks {
  const { startCompact, endCompact, startIso, endIso } = eventBounds(event);
  const location = publicLocationLine(event);
  const details = `${DETAILS} ${event.mapsUrl}`;
  const dates = `${startCompact}/${endCompact}`;

  const google = new URL("https://calendar.google.com/calendar/render");
  google.searchParams.set("action", "TEMPLATE");
  google.searchParams.set("text", TITLE);
  google.searchParams.set("dates", dates);
  google.searchParams.set("ctz", event.timezone);
  google.searchParams.set("details", details);
  google.searchParams.set("location", location);

  const outlookQuery = new URLSearchParams({
    rru: "addevent",
    subject: TITLE,
    startdt: startIso,
    enddt: endIso,
    body: details,
    location,
  });

  return {
    google: google.toString(),
    outlook: `https://outlook.live.com/calendar/0/action/compose?${outlookQuery}`,
    office: `https://outlook.office.com/calendar/0/action/compose?${outlookQuery}`,
    apple: "/api/calendar",
    ics: "/api/calendar",
  };
}
