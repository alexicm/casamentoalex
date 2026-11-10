import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { ALL_SEED_GUESTS } from "@/lib/rsvp/guest-seed";
import { normalizeName } from "@/lib/rsvp/normalize";

export type LocalSubmission = {
  id: string;
  guestSeedKey: string;
  guestDisplayName: string;
  fullName: string;
  attending: boolean;
  contact: string | null;
  receipt: string;
  receiptHash: string;
  idempotencyKey: string | null;
  bringingCompanion: boolean;
  companionName: string | null;
  companionIsChild: boolean;
  reviewStatus: "pending_review" | "linked" | "discarded";
  createdAt: string;
};

type StoreFile = {
  submissions: LocalSubmission[];
};

const DATA_PATH = path.join(process.cwd(), ".data", "rsvps.json");

let writeChain: Promise<unknown> = Promise.resolve();

function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = writeChain.then(fn, fn);
  writeChain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

function hydrate(row: Partial<LocalSubmission> & { fullName: string }): LocalSubmission {
  return {
    id: row.id ?? randomUUID(),
    guestSeedKey: row.guestSeedKey ?? "",
    guestDisplayName: row.guestDisplayName ?? row.fullName,
    fullName: row.fullName,
    attending: Boolean(row.attending),
    contact: row.contact ?? null,
    receipt: row.receipt ?? "",
    receiptHash: row.receiptHash ?? "",
    idempotencyKey: row.idempotencyKey ?? null,
    bringingCompanion: Boolean(row.bringingCompanion),
    companionName: row.companionName ?? null,
    companionIsChild: Boolean(row.companionIsChild),
    reviewStatus: row.reviewStatus ?? "pending_review",
    createdAt: row.createdAt ?? new Date().toISOString(),
  };
}

async function readStore(): Promise<StoreFile> {
  try {
    const raw = await readFile(DATA_PATH, "utf8");
    const parsed = JSON.parse(raw) as StoreFile;
    return {
      submissions: Array.isArray(parsed.submissions)
        ? parsed.submissions.map((row) => hydrate(row))
        : [],
    };
  } catch {
    return { submissions: [] };
  }
}

async function writeStore(store: StoreFile) {
  await mkdir(path.dirname(DATA_PATH), { recursive: true });
  await writeFile(DATA_PATH, JSON.stringify(store, null, 2));
}

export function canUseLocalRsvp() {
  return (
    process.env.ALLOW_LOCAL_RSVP === "1" ||
    (process.env.VERCEL !== "1" && process.env.NODE_ENV !== "production")
  );
}

function alreadyHasGuest(store: StoreFile, guestSeedKey: string, fullName: string) {
  const normalized = normalizeName(fullName);
  return store.submissions.some((row) => {
    if (row.guestSeedKey && row.guestSeedKey === guestSeedKey) return true;
    return !row.guestSeedKey && normalizeName(row.fullName) === normalized;
  });
}

export async function saveLocalRsvp(input: {
  guestSeedKey: string;
  guestDisplayName: string;
  fullName: string;
  attending: boolean;
  contact: string | null;
  receipt: string;
  receiptHash: string;
  idempotencyKey: string | null;
  bringingCompanion: boolean;
  companionName: string | null;
  companionIsChild: boolean;
}): Promise<{ alreadyAnswered: true } | (LocalSubmission & { alreadyAnswered: false })> {
  return withLock(async () => {
    const store = await readStore();
    if (input.idempotencyKey) {
      const existing = store.submissions.find(
        (row) => row.idempotencyKey === input.idempotencyKey,
      );
      if (existing) return { ...existing, alreadyAnswered: false };
    }
    if (alreadyHasGuest(store, input.guestSeedKey, input.fullName)) {
      return { alreadyAnswered: true };
    }

    const row = hydrate({
      id: randomUUID(),
      guestSeedKey: input.guestSeedKey,
      guestDisplayName: input.guestDisplayName,
      fullName: input.fullName,
      attending: input.attending,
      contact: input.contact,
      receipt: input.receipt,
      receiptHash: input.receiptHash,
      idempotencyKey: input.idempotencyKey,
      bringingCompanion: input.bringingCompanion,
      companionName: input.companionName,
      companionIsChild: input.companionIsChild,
      reviewStatus: "pending_review",
      createdAt: new Date().toISOString(),
    });
    store.submissions.push(row);
    await writeStore(store);
    return { ...row, alreadyAnswered: false };
  });
}

export async function findLocalReceipt(receiptHash: string) {
  const store = await readStore();
  return store.submissions.find((row) => row.receiptHash === receiptHash) ?? null;
}

export async function listLocalRsvps() {
  const store = await readStore();
  return store.submissions;
}

export function listedGuestsForMatching() {
  return ALL_SEED_GUESTS.map((guest) => ({
    id: guest.seedKey,
    displayName: guest.displayName,
    normalizedName: normalizeName(guest.displayName),
    officialStatus: guest.officialStatus,
  }));
}
