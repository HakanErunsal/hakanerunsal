"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * Steps a looping scene while it sits on screen. Scenes off screen do not tick,
 * so a page carrying several of them costs one timer.
 *
 * A reader who has asked for reduced motion gets one still frame instead of the
 * loop, held at restStep.
 *
 * @param durations Milliseconds to hold each step, in order.
 * @param restStep Frame to hold under reduced motion. Defaults to the last step.
 *   Pass the step that shows the most of what the scene is explaining, which is
 *   rarely the finished state.
 * @returns The current step index and the ref to put on the scene's outer element.
 */
export function useSceneClock(durations: number[], restStep?: number) {
  const lastStep = durations.length - 1;
  const [step, setStep] = useState(0);
  const [onScreen, setOnScreen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const holdFor = useRef(durations);

  useLayoutEffect(() => {
    holdFor.current = durations;
  });

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { threshold: 0.25 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setStep(restStep ?? lastStep);
      return;
    }
    if (!onScreen) return;

    const timer = setTimeout(
      () => setStep((current) => (current >= lastStep ? 0 : current + 1)),
      holdFor.current[step] ?? 900,
    );
    return () => clearTimeout(timer);
  }, [step, onScreen, reducedMotion, lastStep, restStep]);

  return { step, ref, reducedMotion };
}
