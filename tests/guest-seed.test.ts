import { describe, expect, it } from "vitest";
import {
  ALEX_GUESTS,
  ALL_SEED_GUESTS,
  EXCLUDED_ALEX_NAMES,
  PALOMA_GUESTS,
} from "@/lib/rsvp/guest-seed";
import { composeSubmittedName, needsLastName, normalizeName } from "@/lib/rsvp/normalize";

describe("lista-base privada", () => {
  it("tem 50 registros, 19 da Paloma e 31 do Alex", () => {
    expect(PALOMA_GUESTS).toHaveLength(19);
    expect(ALEX_GUESTS).toHaveLength(31);
    expect(ALL_SEED_GUESTS).toHaveLength(50);
  });

  it("mantém duas Carolinas distintas na lista da Paloma", () => {
    const carolinas = PALOMA_GUESTS.filter((guest) =>
      guest.displayName.startsWith("Carolina "),
    );
    expect(carolinas.map((guest) => guest.displayName)).toEqual([
      "Carolina Abreu",
      "Carolina Fonseca",
    ]);
    expect(carolinas[0]?.seedKey).not.toBe(carolinas[1]?.seedKey);
  });

  it("confirma historicamente só o grupo Paloma", () => {
    expect(PALOMA_GUESTS.every((guest) => guest.officialStatus === "manually_confirmed")).toBe(true);
    expect(ALEX_GUESTS.every((guest) => guest.officialStatus === "awaiting_response")).toBe(true);
  });

  it("não recoloca os 14 nomes removidos na lista do Alex", () => {
    const alexNames = new Set(ALEX_GUESTS.map((guest) => guest.displayName));
    for (const name of EXCLUDED_ALEX_NAMES) {
      expect(alexNames.has(name)).toBe(false);
    }
    expect(PALOMA_GUESTS.some((guest) => guest.displayName === "Suellen Vale")).toBe(true);
    expect(ALEX_GUESTS.map((guest) => guest.displayName)).toContain("Marcos Araújo");
    expect(ALEX_GUESTS.map((guest) => guest.displayName)).toContain("Carolina Seidner");
    expect(ALEX_GUESTS.map((guest) => guest.displayName)).toContain("João Victor Freitas");
    expect(ALEX_GUESTS.map((guest) => guest.displayName)).toContain("Victor Luiz");
  });

  it("usa seed keys únicas", () => {
    const keys = ALL_SEED_GUESTS.map((guest) => guest.seedKey);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("normaliza homônimos sem fundir registros", () => {
    expect(normalizeName("Carolina")).toBe("carolina");
    expect(normalizeName("Cláudio")).toBe("claudio");
    expect(normalizeName("João Victor")).toBe("joao victor");
  });

  it("monta o nome do formulário sem inventar sobrenome", () => {
    expect(composeSubmittedName("Carolina", "Abreu")).toBe("Carolina Abreu");
    expect(composeSubmittedName("Ana Paula", "")).toBe("Ana Paula");
    expect(composeSubmittedName("Jian", "")).toBe("Jian");
    expect(needsLastName("Carolina", false)).toBe(true);
    expect(needsLastName("Ana Paula", false)).toBe(false);
    expect(needsLastName("Jian", true)).toBe(false);
  });
});
