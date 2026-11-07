import { describe, expect, it } from "vitest";
import {
  DEFAULT_EVENT,
  formatRsvpDeadline,
  rsvpDeadlinePassed,
} from "@/lib/event/defaults";

describe("prazo de confirmação", () => {
  it("usa 5 de dezembro de 2026", () => {
    expect(DEFAULT_EVENT.rsvpDeadline).toBe("2026-12-05");
    expect(formatRsvpDeadline(DEFAULT_EVENT.rsvpDeadline)).toBe("5 de dezembro");
  });

  it("encerra no fim do dia 5 em Brasília", () => {
    expect(rsvpDeadlinePassed("2026-12-05", new Date("2026-12-05T23:59:00-03:00"))).toBe(
      false,
    );
    expect(rsvpDeadlinePassed("2026-12-05", new Date("2026-12-06T00:00:00-03:00"))).toBe(
      true,
    );
  });
});
