import { describe, expect, it } from "vitest";
import { createReceiptToken, hashReceiptToken, receiptsMatch } from "@/lib/rsvp/receipt";

describe("recibo opaco", () => {
  it("gera token e confere o hash sem expor o valor original", () => {
    const token = createReceiptToken();
    const hash = hashReceiptToken(token);
    expect(hash).not.toBe(token);
    expect(receiptsMatch(token, hash)).toBe(true);
    expect(receiptsMatch("outro", hash)).toBe(false);
  });
});
