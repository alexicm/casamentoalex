export const RITUAL_MS = 5 * 1000;
export const STAGE_MS = 1000;
export const RITUAL_SESSION_KEY = "wedding-confirmation-ritual";
export const STAGE_COUNT = 5;

export type RitualState = {
  receipt: string;
  attending: boolean;
  firstName: string;
  startedAt: number;
  stage: number;
  stageStartedAt: number;
  interacted: boolean[];
  choice?: string;
  done?: boolean;
};

export function firstNameOf(fullName: string) {
  const token = fullName.trim().split(/\s+/).filter(Boolean)[0];
  return token || "você";
}

export function formatClock(ms: number) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function readRitual(): RitualState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(RITUAL_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as RitualState;
    if (!parsed.receipt || !Array.isArray(parsed.interacted)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeRitual(state: RitualState) {
  try {
    window.sessionStorage.setItem(RITUAL_SESSION_KEY, JSON.stringify(state));
  } catch {
    /* private mode */
  }
}

export function clearRitual() {
  try {
    window.sessionStorage.removeItem(RITUAL_SESSION_KEY);
  } catch {
    /* private mode */
  }
}

export function createRitual(input: {
  receipt: string;
  attending: boolean;
  firstName: string;
}): RitualState {
  const now = Date.now();
  return {
    receipt: input.receipt,
    attending: input.attending,
    firstName: input.firstName,
    startedAt: now,
    stage: 0,
    stageStartedAt: now,
    interacted: [false, false, false, false, false],
  };
}

export const PROCESS_STEPS = [
  "A carta chegou",
  "Lendo com calma",
  "Preparando o lugar",
  "Um desejo",
  "Selando a resposta",
] as const;
