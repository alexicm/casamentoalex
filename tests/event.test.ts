import { describe, expect, it } from "vitest";
import { DEFAULT_EVENT, publicLocationLine } from "@/lib/event/defaults";

describe("local público", () => {
  it("não publica o endereço de rua enquanto não estiver validado", () => {
    expect(DEFAULT_EVENT.addressVerified).toBe(false);
    expect(publicLocationLine(DEFAULT_EVENT)).toBe(
      "BuGú Delícias, Taguatinga, Brasília/DF",
    );
    expect(publicLocationLine(DEFAULT_EVENT)).not.toContain("QNJ");
  });
});
