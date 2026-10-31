import { describe, expect, it } from "vitest";
import { protectCsvCell, toCsv } from "@/lib/rsvp/csv";

describe("exportação CSV", () => {
  it("bloqueia formula injection", () => {
    expect(protectCsvCell("=CMD()")).toBe("'=CMD()");
    expect(protectCsvCell("+1+1")).toBe("'+1+1");
    expect(protectCsvCell("-2+3")).toBe("'-2+3");
    expect(protectCsvCell("@SUM(A1)")).toBe("'@SUM(A1)");
  });

  it("inclui BOM UTF-8 para Excel", () => {
    const csv = toCsv(["Nome"], [["Paloma"]]);
    expect(csv.startsWith("\uFEFF")).toBe(true);
    expect(csv).toContain("Nome");
  });
});
