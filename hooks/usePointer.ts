"use client";

import { useEffect, useRef } from "react";

type PointerVelocity = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

export function usePointerVelocity() {
  const velocity = useRef<PointerVelocity>({ x: 0, y: 0, vx: 0, vy: 0 });

  useEffect(() => {
    let previous = { x: 0, y: 0, t: 0 };
    const onMove = (event: PointerEvent) => {
      const now = performance.now();
      const dt = Math.max(16, now - (previous.t || now));
      const vx = (event.clientX - previous.x) / dt;
      const vy = (event.clientY - previous.y) / dt;
      const current = velocity.current;
      current.x = event.clientX;
      current.y = event.clientY;
      current.vx = current.vx * 0.7 + vx * 0.3;
      current.vy = current.vy * 0.7 + vy * 0.3;
      previous = { x: event.clientX, y: event.clientY, t: now };
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return velocity;
}
