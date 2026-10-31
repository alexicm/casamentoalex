import { describe, expect, it } from "vitest";
import { PALOMA_GUESTS } from "@/lib/rsvp/guest-seed";
import { suggestMatches } from "@/lib/rsvp/matching";
import { normalizeName } from "@/lib/rsvp/normalize";

const guests = PALOMA_GUESTS.map((guest, index) => ({
  id: `${index}`,
  displayName: guest.displayName,
  normalizedName: normalizeName(guest.displayName),
}));

describe("sugestão interna de nomes", () => {
  it("não vincula automaticamente duas Carolinas", () => {
    const result = suggestMatches("Carolina", guests);
    expect(result.state).toBe("ambiguous");
    expect(result.candidates).toHaveLength(2);
  });

  it("sugere um único nome exato sem confirmar", () => {
    const result = suggestMatches("Heloísa", guests);
    expect(result.state).toBe("suggested");
    expect(result.candidates).toHaveLength(1);
    expect(result.candidates[0]?.displayName).toBe("Heloísa Noleto");
  });

  it("distingue Carolina Abreu de Carolina Fonseca no nome completo", () => {
    const result = suggestMatches("Carolina Abreu", guests);
    expect(result.state).toBe("suggested");
    expect(result.candidates).toHaveLength(1);
    expect(result.candidates[0]?.displayName).toBe("Carolina Abreu");
  });

  it("marca nomes desconhecidos como unmatched", () => {
    const result = suggestMatches("Pessoa Inexistente", guests);
    expect(result.state).toBe("unmatched");
  });
});
