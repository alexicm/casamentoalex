import { describe, expect, it } from "vitest";
import { PALOMA_GUESTS } from "@/lib/rsvp/guest-seed";
import {
  companionCounts,
  guestMayConfirmViaForm,
  resolveListedGuest,
  suggestMatches,
} from "@/lib/rsvp/matching";
import { normalizeName } from "@/lib/rsvp/normalize";
import { companionLabel, guestConfirmedViaSite, guestSeatCount } from "@/lib/rsvp/seats";

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

  it("reconhece nome completo maior que o da lista", () => {
    const result = suggestMatches("Heloísa Noleto Silva", guests);
    expect(result.state).toBe("suggested");
    expect(result.candidates[0]?.displayName).toBe("Heloísa Noleto");
  });

  it("reconhece sobrenome único mesmo com nome diferente do WhatsApp", () => {
    const list = [
      {
        id: "1",
        displayName: "Clério Rodrigo",
        normalizedName: normalizeName("Clério Rodrigo"),
      },
      {
        id: "2",
        displayName: "Victoria Silva",
        normalizedName: normalizeName("Victoria Silva"),
      },
    ];
    const result = suggestMatches("C.Rodrigo Silva Leite", list);
    expect(result.state).toBe("suggested");
    expect(result.candidates[0]?.displayName).toBe("Clério Rodrigo");
  });

  it("só aceita nomes únicos da lista", () => {
    expect(resolveListedGuest("Heloísa", guests).ok).toBe(true);
    expect(resolveListedGuest("Carolina", guests)).toEqual({ ok: false, code: "ambiguous" });
    expect(resolveListedGuest("Pessoa Inexistente", guests)).toEqual({
      ok: false,
      code: "unmatched",
    });
  });

  it("não conta criança até 10 anos como lugar extra", () => {
    expect(companionCounts(true, true)).toBe(false);
    expect(companionCounts(true, false)).toBe(true);
    expect(companionCounts(false, false)).toBe(false);
    expect(
      guestSeatCount({
        officialStatus: "confirmed_via_token",
        bringingCompanion: true,
        companionIsChild: true,
      }),
    ).toBe(1);
    expect(
      guestSeatCount({
        officialStatus: "confirmed_via_token",
        bringingCompanion: true,
        companionIsChild: false,
      }),
    ).toBe(2);
    expect(
      companionLabel({
        officialStatus: "confirmed_via_token",
        bringingCompanion: true,
        companionName: "Lia",
        companionIsChild: true,
      }),
    ).toContain("não conta");
  });

  it("só conta confirmação pelo site, não a lista histórica", () => {
    expect(
      guestConfirmedViaSite({
        officialStatus: "confirmed_via_token",
        confirmationSource: "public_form",
      }),
    ).toBe(true);
    expect(
      guestConfirmedViaSite({
        officialStatus: "manually_confirmed",
        confirmationSource: "import",
      }),
    ).toBe(false);
  });

  it("permite a lista histórica confirmar pelo formulário", () => {
    expect(guestMayConfirmViaForm("awaiting_response", "import")).toBe(true);
    expect(guestMayConfirmViaForm("manually_confirmed", "import")).toBe(true);
    expect(guestMayConfirmViaForm("confirmed_via_token", "public_form")).toBe(false);
    expect(guestMayConfirmViaForm("declined", "public_form")).toBe(false);
  });
});
