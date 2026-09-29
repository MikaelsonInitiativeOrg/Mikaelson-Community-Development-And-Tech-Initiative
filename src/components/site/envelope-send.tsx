"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import styles from "./envelope-send.module.css";

/**
 * "The page goes in the envelope" for submit buttons. Wraps a form's
 * existing submit button without changing it: while the form is sending,
 * a sheet rises out of the top of the button, folds, slips into an
 * envelope and the flap seals. When the server confirms, the envelope
 * flies off up-right; if sending fails, it drops back into the button.
 *
 * The scene floats above the button (no layout space, no pointer events)
 * and is only clipped at the button's top edge, so the sheet appears to
 * come out of the button. Submitting is a rare, one-off action, so it gets
 * the delight budget; reduced motion skips the scene entirely.
 */

export type EnvelopeStatus = "idle" | "sending" | "sent" | "returned";
type Phase = "idle" | "rise" | "fold" | "tuck" | "seal" | "fly" | "return";

// Phase start times while sending (ms); each matches the CSS duration of
// the step before. The envelope is sealed by SEALED.
const AT = { fold: 440, tuck: 900, seal: 1280 };
const SEALED = 1600;
const FLY = 720;
const RETURN = 320;
const EASE_IN_OUT = "cubic-bezier(0.77, 0, 0.175, 1)";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * For forms that swap to a success screen: wraps the send so that screen
 * waits until the envelope has flown. `send` returns true on success (and
 * handles its own error messages); run resolves with the same value once
 * the animation has finished.
 */
export function useEnvelopeSend() {
  const [status, setStatus] = useState<EnvelopeStatus>("idle");
  const reduce = useReducedMotion() ?? false;

  const run = useCallback(
    async (send: () => Promise<boolean>) => {
      if (reduce) return send();
      setStatus("sending");
      const started = Date.now();
      let ok = false;
      try {
        ok = await send();
      } finally {
        if (ok) {
          await sleep(Math.max(0, SEALED - (Date.now() - started)));
          setStatus("sent");
          await sleep(FLY);
        } else {
          setStatus("returned");
          await sleep(RETURN);
        }
        setStatus("idle");
      }
      return ok;
    },
    [reduce],
  );

  return { status, run };
}

export function EnvelopeSend({ status, children }: { status: EnvelopeStatus; children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const envelopeRef = useRef<HTMLDivElement>(null);
  const flight = useRef<Animation | null>(null);

  // Status drives the phases; the folding steps run on timers.
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (fn: () => void, ms: number) => timers.push(setTimeout(fn, ms));
    if (status === "sending") {
      at(() => setPhase("rise"), 0);
      at(() => setPhase("fold"), AT.fold);
      at(() => setPhase("tuck"), AT.tuck);
      at(() => setPhase("seal"), AT.seal);
    }
    if (status === "sent") at(() => setPhase("fly"), 0);
    if (status === "returned") at(() => setPhase("return"), 0);
    if (status === "idle") {
      at(() => {
        flight.current?.cancel();
        flight.current = null;
        setPhase("idle");
      }, 0);
    }
    return () => timers.forEach(clearTimeout);
  }, [status]);

  // The flight: a small lift (it's picked up), then off up-right on a
  // flattening path, which reads as an arc.
  useLayoutEffect(() => {
    if (phase !== "fly" || !envelopeRef.current) return;
    flight.current = envelopeRef.current.animate(
      [
        { transform: "translate(0, 0) rotate(0deg) scale(1)", opacity: 1 },
        { transform: "translate(0, -8px) rotate(-2deg) scale(1.04)", opacity: 1, offset: 0.18 },
        { transform: "translate(70px, -46px) rotate(-10deg) scale(0.98)", opacity: 1, offset: 0.55 },
        { transform: "translate(240px, -110px) rotate(-18deg) scale(0.9)", opacity: 0 },
      ],
      { duration: FLY, easing: EASE_IN_OUT, fill: "forwards" },
    );
  }, [phase]);

  useEffect(() => () => flight.current?.cancel(), []);

  return (
    <div className={styles.wrap} data-phase={phase}>
      {children}
      <div className={styles.scene} aria-hidden="true">
        <div ref={envelopeRef} className={styles.envelope}>
          <div className={`${styles.part} ${styles.back}`} />
          <div className={`${styles.part} ${styles.flapLayer}`}>
            <div className={styles.flap} />
            <div className={styles.seal} />
          </div>
          <div className={styles.sheet}>
            <div className={styles.half}>
              <span className={styles.titleLine} />
              <span className={styles.line} />
              <span className={styles.line} style={{ width: "70%" }} />
            </div>
            <div className={`${styles.half} ${styles.lower}`}>
              <div className={styles.face}>
                <span className={styles.line} />
                <span className={styles.line} style={{ width: "85%" }} />
                <span className={styles.line} style={{ width: "55%" }} />
              </div>
              <div className={`${styles.face} ${styles.faceBack}`} />
            </div>
          </div>
          <div className={`${styles.part} ${styles.front}`} />
        </div>
      </div>
    </div>
  );
}
