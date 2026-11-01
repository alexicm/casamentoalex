"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type PageReadyContextValue = {
  ready: boolean;
  markReady: () => void;
};

const PageReadyContext = createContext<PageReadyContextValue>({
  ready: true,
  markReady: () => undefined,
});

export function PageReadyProvider({
  children,
  initialReady = false,
}: {
  children: ReactNode;
  initialReady?: boolean;
}) {
  const [ready, setReady] = useState(initialReady);
  const value = useMemo(
    () => ({
      ready,
      markReady: () => setReady(true),
    }),
    [ready],
  );

  return <PageReadyContext.Provider value={value}>{children}</PageReadyContext.Provider>;
}

export function usePageReady() {
  return useContext(PageReadyContext);
}
