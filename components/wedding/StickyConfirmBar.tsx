"use client";

type StickyConfirmBarProps = {
  visible: boolean;
  onConfirm: () => void;
};

export function StickyConfirmBar({ visible, onConfirm }: StickyConfirmBarProps) {
  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:hidden">
      <div className="mx-auto flex max-w-md justify-center rounded-full bg-burgundy/95 px-2 py-2 shadow-[0_12px_30px_rgba(49,11,20,0.32)] backdrop-blur">
        <button
          type="button"
          onClick={onConfirm}
          className="focus-ring min-h-12 w-full rounded-full text-sm tracking-[0.16em] text-ivory uppercase"
        >
          Confirmar presença
        </button>
      </div>
    </div>
  );
}
