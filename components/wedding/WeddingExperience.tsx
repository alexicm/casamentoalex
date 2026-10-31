"use client";

import { useCallback, useEffect, useState } from "react";
import { DressCodeLookbook } from "@/components/wedding/DressCodeLookbook";
import { EventDetails } from "@/components/wedding/EventDetails";
import { FinalLetter } from "@/components/wedding/FinalLetter";
import { Hero } from "@/components/wedding/Hero";
import { RSVPForm } from "@/components/wedding/RSVPForm";
import { StickyConfirmBar } from "@/components/wedding/StickyConfirmBar";
import { Story } from "@/components/wedding/Story";
import type { PublicEvent } from "@/lib/event/defaults";
import { gsap, registerGsap, ScrollToPlugin } from "@/lib/gsap/register";

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
  const [formInView, setFormInView] = useState(false);
  const [answered, setAnswered] = useState(false);
  registerGsap();

  useEffect(() => {
    const form = document.getElementById("confirmar");
    if (!form) return;
    const observer = new IntersectionObserver(
      ([entry]) => setFormInView(Boolean(entry?.isIntersecting)),
      { threshold: 0.28 },
    );
    observer.observe(form);
    return () => observer.disconnect();
  }, []);

  const markAnswered = useCallback(() => setAnswered(true), []);

  const scrollToRsvp = useCallback(() => {
    const target = document.getElementById("confirmar");
    if (!target) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      target.scrollIntoView();
    } else {
      gsap.to(window, {
        duration: 0.9,
        scrollTo: { y: target, offsetY: 12 },
        ease: "power2.out",
      });
    }
    window.setTimeout(() => {
      const heading = target.querySelector("h2");
      heading?.setAttribute("tabindex", "-1");
      (heading as HTMLElement | null)?.focus();
    }, reduce ? 0 : 850);
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
      duration: 0.8,
      scrollTo: { y: target, offsetY: 8 },
      ease: "power2.out",
    });
  }, []);

  void ScrollToPlugin;

  return (
    <div className="paper-bg min-h-svh overflow-x-hidden">
      <Hero onConfirm={scrollToRsvp} onDiscover={scrollToDetails} />
      <Story />
      <EventDetails event={event} />
      <DressCodeLookbook event={event} />
      <RSVPForm
        inviteToken={inviteToken}
        setupPending={setupPending}
        onAnswered={markAnswered}
      />
      <FinalLetter onConfirm={scrollToRsvp} alreadyAnswered={answered} />
      <footer className="px-5 pb-[max(2rem,env(safe-area-inset-bottom))] text-center">
        <p className="text-xs tracking-[0.2em] text-sage uppercase">
          Alex & Paloma · 20.12.2026 · BuGú Delícias, Taguatinga
        </p>
      </footer>
      <StickyConfirmBar visible={!formInView && !answered} onConfirm={scrollToRsvp} />
    </div>
  );
}
