"use client";

import { useState } from "react";
import { MOTION } from "@/lib/motion";

type StickerBoardProps = {
  note: string;
  label?: string;
};

export function StickerBoard({
  note,
  label = "Abrir uma nota carinhosa",
}: StickerBoardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative mx-auto mt-8 max-w-sm">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="sticker-seal focus-ring mx-auto flex min-h-14 min-w-14 items-center justify-center rounded-full bg-burgundy text-ivory"
        style={{ transition: `transform ${MOTION.stickerEnter.duration}s` }}
      >
        <span className="font-script text-2xl">A&P</span>
        <span className="sr-only">{label}</span>
      </button>
      {open ? (
        <p
          role="status"
          className="paper-card mt-4 px-5 py-4 text-sm leading-relaxed text-ink/85"
        >
          {note}
        </p>
      ) : null}
    </div>
  );
}
