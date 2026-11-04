import { describe, expect, it } from "vitest";
import { buildCalendarLinks, eventBounds } from "@/lib/calendar/links";

describe("links de agenda", () => {
  it("marca 20.12.2026 às 17h30 no fuso de Brasília", () => {
    const bounds = eventBounds();
    expect(bounds.startCompact).toBe("20261220T173000");
    expect(bounds.endCompact).toBe("20261220T233000");
    expect(bounds.startIso).toBe("2026-12-20T17:30:00");
  });

  it("abre Google, Outlook e o arquivo .ics", () => {
    const links = buildCalendarLinks();
    expect(links.google).toContain("calendar.google.com");
    expect(links.google).toContain("20261220T173000");
    expect(links.google).toContain("America%2FSao_Paulo");
    expect(links.outlook).toContain("outlook.live.com");
    expect(links.outlook).toContain("2026-12-20T17%3A30%3A00");
    expect(links.apple).toBe("/api/calendar");
    expect(links.ics).toBe("/api/calendar");
  });
});
