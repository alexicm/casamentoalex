import { buildIcs } from "@/lib/calendar/ics";
import { getPublicEvent } from "@/lib/event/load";

export async function GET() {
  const event = await getPublicEvent();
  const ics = buildIcs(event);
  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="casamento-alex-paloma.ics"',
      "Cache-Control": "no-store",
    },
  });
}
