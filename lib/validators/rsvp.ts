import { z } from "zod";
import { isMononym, nameTokenCount } from "@/lib/rsvp/normalize";

export const CONSENT_VERSION = "v1-2026-10";

export const rsvpInputSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Escreva seu nome.")
      .max(120, "O nome está longo demais.")
      .refine((value) => !/https?:\/\//i.test(value), "Remova links do nome.")
      .refine((value) => nameTokenCount(value) >= 1, "Escreva seu nome."),
    attending: z.boolean(),
    contact: z.string().trim().max(40).optional(),
    consent: z.boolean().refine((value) => value === true, {
      message: "Precisamos da sua autorização para organizar a lista.",
    }),
    website: z.string().optional(),
    inviteToken: z.string().max(200).optional(),
    idempotencyKey: z.string().max(80).optional(),
    bringingCompanion: z.boolean().optional(),
    companionName: z.string().trim().max(120).optional(),
    companionIsChild: z.boolean().optional(),
  })
  .superRefine((value, ctx) => {
    if (!value.attending) return;
    if (!value.bringingCompanion) return;
    if (!value.companionName || value.companionName.length < 2) {
      ctx.addIssue({
        code: "custom",
        path: ["companionName"],
        message: "Escreva o nome de quem vem com você.",
      });
    }
  });

export type RsvpInput = z.infer<typeof rsvpInputSchema>;

export function nameNeedsReview(fullName: string): boolean {
  return isMononym(fullName);
}

export const RSVP_MESSAGES = {
  unmatched: "Não encontramos esse nome na lista. Confira como está no convite.",
  ambiguous:
    "Há mais de uma pessoa com esse nome. Escreva o sobrenome como no convite.",
  already: "Essa presença já foi respondida. Se precisar alterar, fale com a gente.",
} as const;
