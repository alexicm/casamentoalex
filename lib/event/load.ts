import { DEFAULT_EVENT, type PublicEvent } from "@/lib/event/defaults";
import { createServiceClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";

type EventRow = {
  slug: string;
  couple_names: string;
  event_date: string;
  starts_at_local: string;
  timezone: string;
  venue_name: string;
  venue_address: string;
  maps_url: string;
  dress_code_json: PublicEvent["dressCode"];
  rsvp_deadline: string | null;
  public_enabled: boolean;
  calendar_duration_hours: number;
};

export async function getPublicEvent(): Promise<PublicEvent> {
  if (!isSupabaseConfigured()) return DEFAULT_EVENT;

  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("events")
      .select(
        "slug, couple_names, event_date, starts_at_local, timezone, venue_name, venue_address, maps_url, dress_code_json, rsvp_deadline, public_enabled, calendar_duration_hours",
      )
      .eq("slug", DEFAULT_EVENT.slug)
      .maybeSingle();

    if (error || !data) return DEFAULT_EVENT;
    const row = data as EventRow;
    return {
      slug: row.slug,
      coupleNames: row.couple_names,
      eventDate: row.event_date,
      startsAtLocal: row.starts_at_local.slice(0, 5),
      timezone: row.timezone,
      venueName: row.venue_name,
      venueAddress: row.venue_address,
      mapsUrl: row.maps_url,
      dressCode: {
        title: row.dress_code_json?.title ?? DEFAULT_EVENT.dressCode.title,
        subtitle: row.dress_code_json?.subtitle ?? DEFAULT_EVENT.dressCode.subtitle,
        palette: row.dress_code_json?.palette ?? DEFAULT_EVENT.dressCode.palette,
        notes: row.dress_code_json?.notes ?? DEFAULT_EVENT.dressCode.notes,
      },
      rsvpDeadline: row.rsvp_deadline
        ? new Date(row.rsvp_deadline).toLocaleDateString("en-CA", {
            timeZone: "America/Sao_Paulo",
          })
        : DEFAULT_EVENT.rsvpDeadline,
      publicEnabled: row.public_enabled,
      calendarDurationHours: row.calendar_duration_hours,
      addressVerified: DEFAULT_EVENT.addressVerified,
    };
  } catch {
    return DEFAULT_EVENT;
  }
}
