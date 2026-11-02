import { describe, expect, it } from "vitest";
import { rsvpInputSchema } from "@/lib/validators/rsvp";

describe("validação de RSVP", () => {
  it("pede o nome do acompanhante quando a pessoa leva alguém", () => {
    const result = rsvpInputSchema.safeParse({
      fullName: "Tânia Rodrigues",
      attending: true,
      consent: true,
      bringingCompanion: true,
      companionName: "",
    });
    expect(result.success).toBe(false);
  });

  it("aceita presença sem acompanhante", () => {
    const result = rsvpInputSchema.safeParse({
      fullName: "Tânia Rodrigues",
      attending: true,
      consent: true,
      bringingCompanion: false,
    });
    expect(result.success).toBe(true);
  });
});
