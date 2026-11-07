import { companionCounts } from "@/lib/rsvp/matching";

const CONFIRMED = new Set(["manually_confirmed", "confirmed_via_token"]);

export function guestIsConfirmed(status: string) {
  return CONFIRMED.has(status);
}

export function guestConfirmedViaSite(input: {
  officialStatus: string;
  confirmationSource: string;
}) {
  if (input.officialStatus === "confirmed_via_token") return true;
  return (
    input.officialStatus === "manually_confirmed" &&
    input.confirmationSource !== "import"
  );
}

export function guestSeatCount(input: {
  officialStatus: string;
  bringingCompanion: boolean;
  companionIsChild: boolean;
}) {
  if (!guestIsConfirmed(input.officialStatus)) return 0;
  return 1 + (companionCounts(input.bringingCompanion, input.companionIsChild) ? 1 : 0);
}

export function companionLabel(input: {
  officialStatus: string;
  confirmationSource?: string;
  bringingCompanion: boolean;
  companionName: string | null;
  companionIsChild: boolean;
}) {
  if (!guestIsConfirmed(input.officialStatus)) return "-";
  if (!input.bringingCompanion) {
    if (input.confirmationSource === "import") return "Ainda não informado";
    return "Vem sozinho(a)";
  }
  const name = input.companionName?.trim() || "Nome pendente";
  if (input.companionIsChild) return `${name} (criança até 10, não conta)`;
  return name;
}
