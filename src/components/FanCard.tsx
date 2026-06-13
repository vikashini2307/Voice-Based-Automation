import { motion } from "framer-motion";
import { useState, useEffect } from "react";

/**
 * FanCard — displays the smart fan device state with a rotation animation.
 *
 * Animation behaviour:
 *  - OFF → ON: spin-up via easeIn over 500 ms, then switches to an infinite
 *              loop at 1 s/rev (steady-state).
 *  - ON  → OFF: decelerate to stop via easeOut over 500 ms.
 *
 * Requirements: 4.1–4.9, 1.4, 1.5, 11.3
 */
interface FanCardProps {
  /** true = fan is ON, false = fan is OFF */
  isOn: boolean;
  /** Optional toggle callback; when omitted the toggle button is disabled */
  onToggle?: () => void;
}

type TransitionConfig =
  | {
      duration: number;
      ease: string;
      repeat: number;
      repeatType: "loop";
    }
  | {
      duration: number;
      ease: string;
    };

export function FanCard({ isOn, onToggle }: FanCardProps) {
  /**
   * `transition` drives the Framer Motion animate prop.
   * We start with the spin-up config and switch to steady-state after 500 ms.
   */
  const [transition, setTransition] = useState<TransitionConfig>({
    duration: 0.5,
    ease: "easeOut",
  });

  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout> | null = null;

    if (isOn) {
      // Phase 1 — spin-up: easeIn over 500 ms
      setTransition({ duration: 0.5, ease: "easeIn" });

      // Phase 2 — steady-state: infinite loop at 1 s/rev
      timerId = setTimeout(() => {
        setTransition({
          duration: 1,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        });
      }, 500);
    } else {
      // Spin-down: easeOut over 500 ms
      setTransition({ duration: 0.5, ease: "easeOut" });
    }

    return () => {
      if (timerId !== null) clearTimeout(timerId);
    };
  }, [isOn]);

  return (
    <div
      className="
        bg-white/[0.08]
        backdrop-blur-xl
        border border-white/[0.15]
        rounded-2xl
        p-6
        flex flex-col items-center gap-4
      "
    >
      {/* Card title */}
      <h2 className="text-xl font-semibold text-slate-100 self-start">
        Smart Fan
      </h2>

      {/* Fan icon with Framer Motion rotation animation */}
      <motion.span
        aria-hidden="true"
        className="text-5xl w-12 h-12 flex items-center justify-center select-none"
        animate={{ rotate: isOn ? 360 : 0 }}
        transition={transition}
        style={{ color: isOn ? "#60a5fa" : "#6b7280" }}
      >
        🌀
      </motion.span>

      {/* Status text */}
      <p className="text-base font-medium text-slate-100">
        Status:{" "}
        <span
          data-testid="fan-status"
          className={isOn ? "text-blue-400" : "text-slate-500"}
        >
          {isOn ? "ON" : "OFF"}
        </span>
      </p>

      {/* Toggle button */}
      <button
        onClick={onToggle}
        disabled={!onToggle}
        aria-label={isOn ? "Turn fan off" : "Turn fan on"}
        className="
          mt-2
          w-full
          min-h-[44px]
          rounded-xl
          px-4 py-2
          text-base font-semibold
          transition-colors duration-200
          disabled:opacity-40 disabled:cursor-not-allowed
          enabled:cursor-pointer
          bg-blue-400/20
          text-blue-300
          border border-blue-400/30
          enabled:hover:bg-blue-400/30
          enabled:active:bg-blue-400/40
        "
      >
        {isOn ? "Turn Off" : "Turn On"}
      </button>
    </div>
  );
}

export default FanCard;
