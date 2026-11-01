import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

export type LocalSubmission = {
  id: string;
  fullName: string;
  attending: boolean;
  contact: string | null;
  receipt: string;
  receiptHash: string;
  idempotencyKey: string | null;
  reviewStatus: "pending_review";
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

async function readStore(): Promise<StoreFile> {
  try {
    const raw = await readFile(DATA_PATH, "utf8");
    const parsed = JSON.parse(raw) as StoreFile;
    return { submissions: Array.isArray(parsed.submissions) ? parsed.submissions : [] };
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

export async function saveLocalRsvp(input: {
  fullName: string;
  attending: boolean;
  contact: string | null;
  receipt: string;
  receiptHash: string;
  idempotencyKey: string | null;
}): Promise<LocalSubmission> {
  return withLock(async () => {
    const store = await readStore();
    if (input.idempotencyKey) {
      const existing = store.submissions.find(
        (row) => row.idempotencyKey === input.idempotencyKey,
      );
      if (existing) return existing;
    }

    const row: LocalSubmission = {
      id: randomUUID(),
      fullName: input.fullName,
      attending: input.attending,
      contact: input.contact,
      receipt: input.receipt,
      receiptHash: input.receiptHash,
      idempotencyKey: input.idempotencyKey,
      reviewStatus: "pending_review",
      createdAt: new Date().toISOString(),
    };
    store.submissions.push(row);
    await writeStore(store);
    return row;
  });
}

export async function findLocalReceipt(receiptHash: string) {
  const store = await readStore();
  return store.submissions.find((row) => row.receiptHash === receiptHash) ?? null;
}
