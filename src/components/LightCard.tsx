import { motion } from "framer-motion";

/**
 * LightCard — displays the smart light device state with a glow animation.
 *
 * Requirements: 3.1–3.8, 1.4, 1.5, 11.3
 */
interface LightCardProps {
  /** true = light is ON, false = light is OFF */
  isOn: boolean;
  /** Optional toggle callback; when omitted the toggle button is disabled */
  onToggle?: () => void;
}

export function LightCard({ isOn, onToggle }: LightCardProps) {
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
        Smart Light
      </h2>

      {/* Bulb icon with Framer Motion glow animation */}
      <motion.span
        aria-hidden="true"
        className="text-5xl w-12 h-12 flex items-center justify-center select-none"
        animate={{
          filter: isOn
            ? "drop-shadow(0 0 12px #fbbf24)"
            : "drop-shadow(0 0 0px transparent)",
          color: isOn ? "#fbbf24" : "#6b7280",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        💡
      </motion.span>

      {/* Status text */}
      <p className="text-base font-medium text-slate-100">
        Status:{" "}
        <span
          data-testid="light-status"
          className={isOn ? "text-amber-400" : "text-slate-500"}
        >
          {isOn ? "ON" : "OFF"}
        </span>
      </p>

      {/* Toggle button */}
      <button
        onClick={onToggle}
        disabled={!onToggle}
        aria-label={isOn ? "Turn light off" : "Turn light on"}
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
          bg-amber-400/20
          text-amber-300
          border border-amber-400/30
          enabled:hover:bg-amber-400/30
          enabled:active:bg-amber-400/40
        "
      >
        {isOn ? "Turn Off" : "Turn On"}
      </button>
    </div>
  );
}

export default LightCard;
