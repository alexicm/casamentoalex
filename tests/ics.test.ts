import { describe, expect, it } from "vitest";
import { buildIcs } from "@/lib/calendar/ics";

describe("arquivo de calendário", () => {
  it("usa o fuso de Brasília e não afirma horário de encerramento", () => {
    const ics = buildIcs();
    expect(ics).toContain("DTSTART;TZID=America/Sao_Paulo:20261220T170000");
    expect(ics).toContain("SUMMARY:Casamento Alex & Paloma");
    expect(ics).toContain("DURATION:PT6H");
    expect(ics).not.toContain("DTEND");
    expect(ics).toContain("DURATION:PT6H");
    expect(ics.replace(/\r\n /g, "")).toContain("duração neste arquivo é técnica");
  });
});
