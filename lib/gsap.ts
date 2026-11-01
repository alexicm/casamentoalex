"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

let registered = false;

export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin, SplitText, Flip);
  registered = true;
}

export { Flip, gsap, ScrollToPlugin, ScrollTrigger, SplitText, useGSAP };
