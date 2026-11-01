"use client";

import { useCallback } from "react";
import { PageReadyProvider } from "@/components/motion/PageReadyProvider";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { DressCodeLookbook } from "@/components/wedding/DressCodeLookbook";
import { EventDetails } from "@/components/wedding/EventDetails";
import { FinalLetter } from "@/components/wedding/FinalLetter";
import { Hero } from "@/components/wedding/Hero";
import { RSVPForm } from "@/components/wedding/RSVPForm";
import { GuestWitnesses } from "@/components/wedding/GuestWitnesses";
import { StickyConfirmBar } from "@/components/wedding/StickyConfirmBar";
import { Story } from "@/components/wedding/Story";
import { WineToast } from "@/components/wedding/WineToast";
import type { PublicEvent } from "@/lib/event/defaults";
import { gsap, registerGsap, ScrollToPlugin } from "@/lib/gsap";

type WeddingExperienceProps = {
  event: PublicEvent;
  inviteToken?: string;
  setupPending: boolean;
};

export function WeddingExperience({
  event,
  inviteToken,
  setupPending,
}: WeddingExperienceProps) {
  registerGsap();

  const scrollToRsvp = useCallback(() => {
    const target = document.getElementById("confirmar");
    if (!target) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      target.scrollIntoView();
    } else {
      gsap.to(window, {
        duration: 1.15,
        scrollTo: { y: target, offsetY: 12 },
        ease: "sine.inOut",
      });
    }
    window.setTimeout(() => {
      const heading = target.querySelector("h2");
      heading?.setAttribute("tabindex", "-1");
      (heading as HTMLElement | null)?.focus();
    }, reduce ? 0 : 1100);
  }, []);

  const scrollToDetails = useCallback(() => {
    const target = document.getElementById("grande-dia");
    if (!target) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      target.scrollIntoView();
      return;
    }
    gsap.to(window, {
      duration: 1.05,
      scrollTo: { y: target, offsetY: 8 },
      ease: "sine.inOut",
    });
  }, []);

  void ScrollToPlugin;

  return (
    <PageReadyProvider initialReady>
      <SmoothScroll />
      <div className="paper-bg min-h-svh overflow-x-clip">
        <Hero onConfirm={scrollToRsvp} onDiscover={scrollToDetails} />
        <Story />
        <GuestWitnesses />
        <EventDetails event={event} />
        <DressCodeLookbook event={event} />
        <WineToast />
        <RSVPForm inviteToken={inviteToken} setupPending={setupPending} />
        <FinalLetter onConfirm={scrollToRsvp} />
        <footer className="burgundy-stage px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-8 text-center">
          <p className="text-xs tracking-[0.2em] text-ivory/65 uppercase">
            20.12.2026 · Alex & Paloma
          </p>
        </footer>
      </div>
      <StickyConfirmBar onConfirm={scrollToRsvp} />
    </PageReadyProvider>
  );
}
