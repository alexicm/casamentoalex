import { z } from "zod";
import { isMononym, nameTokenCount } from "@/lib/rsvp/normalize";

export const CONSENT_VERSION = "v1-2026-10";

export const rsvpInputSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Escreva seu nome completo.")
    .max(120, "O nome está longo demais.")
    .refine((value) => !/https?:\/\//i.test(value), "Remova links do nome.")
    .refine((value) => nameTokenCount(value) >= 1, "Escreva seu nome como no convite."),
  attending: z.boolean(),
  contact: z.string().trim().max(40).optional(),
  consent: z.boolean().refine((value) => value === true, {
    message: "Precisamos da sua autorização para organizar a lista.",
  }),
  website: z.string().optional(),
  inviteToken: z.string().max(200).optional(),
  idempotencyKey: z.string().max(80).optional(),
});

export type RsvpInput = z.infer<typeof rsvpInputSchema>;

export function nameNeedsReview(fullName: string): boolean {
  return isMononym(fullName);
}
