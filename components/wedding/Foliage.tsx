type FoliageProps = {
  className?: string;
  variant?: "corner" | "spray" | "wreath";
};

export function Foliage({ className = "", variant = "corner" }: FoliageProps) {
  if (variant === "wreath") {
    return (
      <svg
        viewBox="0 0 220 90"
        className={className}
        aria-hidden="true"
        fill="none"
      >
        <path
          className="leaf-path"
          d="M18 58c18-22 38-31 62-34 12 10 7 24-4 32-16 4-34 8-58 2Z"
          fill="#A5AC91"
          fillOpacity="0.55"
        />
        <path
          className="leaf-path"
          d="M202 58c-18-22-38-31-62-34-12 10-7 24 4 32 16 4 34 8 58 2Z"
          fill="#515B40"
          fillOpacity="0.42"
        />
        <path
          className="leaf-path"
          d="M70 38c8-18 24-26 40-22 2 14-8 24-22 26-8 0-14-2-18-4Z"
          fill="#B77759"
          fillOpacity="0.35"
        />
        <circle cx="110" cy="28" r="3.2" fill="#6E303D" fillOpacity="0.55" />
        <circle cx="48" cy="44" r="2.4" fill="#C89991" fillOpacity="0.7" />
        <circle cx="172" cy="44" r="2.4" fill="#C89991" fillOpacity="0.7" />
      </svg>
    );
  }

  if (variant === "spray") {
    return (
      <svg
        viewBox="0 0 160 90"
        className={className}
        aria-hidden="true"
        fill="none"
      >
        <path
          className="leaf-path"
          d="M12 70c22-28 44-40 78-46 8 16-6 30-24 36C46 66 28 70 12 70Z"
          fill="#515B40"
          fillOpacity="0.38"
        />
        <path
          className="leaf-path"
          d="M36 78c18-18 38-24 64-22-2 14-18 22-36 22-10 0-20-1-28 0Z"
          fill="#A5AC91"
          fillOpacity="0.55"
        />
        <path
          className="leaf-path"
          d="M88 30c10-16 28-22 46-14-4 16-18 24-34 22-6 0-10-4-12-8Z"
          fill="#B77759"
          fillOpacity="0.4"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 220 220"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <path
        className="leaf-path"
        d="M24 168c36-62 78-88 148-96 8 28-18 54-56 70C84 160 48 170 24 168Z"
        fill="#A5AC91"
        fillOpacity="0.42"
      />
      <path
        className="leaf-path"
        d="M18 126c28-48 62-70 118-74-2 24-28 42-62 52-24 8-42 16-56 22Z"
        fill="#515B40"
        fillOpacity="0.33"
      />
      <path
        className="leaf-path"
        d="M70 196c22-28 54-36 86-28-8 22-32 32-58 30-12 0-20-1-28-2Z"
        fill="#B77759"
        fillOpacity="0.28"
      />
      <circle cx="48" cy="92" r="7" fill="#9DB7C4" fillOpacity="0.35" />
      <circle cx="166" cy="58" r="5" fill="#C89991" fillOpacity="0.45" />
    </svg>
  );
}
