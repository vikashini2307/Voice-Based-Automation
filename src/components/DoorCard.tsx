import { motion } from "framer-motion";

/**
 * Props for the DoorCard component.
 * - isOpen: true = OPEN (rotateY -75°), false = CLOSED (rotateY 0°)
 * - onToggle: optional callback; when not provided the toggle button is disabled
 */
interface DoorCardProps {
  isOpen: boolean;
  onToggle?: () => void;
}

/**
 * DoorCard — displays a smart door device card with a 3D Y-axis open/close animation.
 *
 * Framer Motion spec:
 *   - Wrapper div: style={{ perspective: 800 }} to establish 3D context
 *   - Door panel: motion.div with animate={{ rotateY: isOpen ? -75 : 0 }}
 *   - Transition: { duration: 0.6, ease: "easeInOut" }
 *
 * Glassmorphism card style consistent with LightCard and FanCard:
 *   bg-white/[0.08] backdrop-blur-xl border border-white/[0.15] rounded-2xl p-6
 *
 * Color accent: emerald-400 (#34d399) for OPEN state indicator.
 */
export function DoorCard({ isOpen, onToggle }: DoorCardProps) {
  return (
    <div className="bg-white/[0.08] backdrop-blur-xl border border-white/[0.15] rounded-2xl p-6 flex flex-col gap-4">
      {/* Card header */}
      <h2 className="text-xl font-semibold text-slate-100">Smart Door</h2>

      {/* Door icon with 3D perspective wrapper */}
      <div
        className="flex items-center justify-center"
        style={{ perspective: 800 }}
      >
        <motion.div
          className="w-12 h-12 flex items-center justify-center text-5xl select-none"
          animate={{ rotateY: isOpen ? -75 : 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{ transformStyle: "preserve-3d" }}
        >
          🚪
        </motion.div>
      </div>

      {/* Status indicator */}
      <div className="flex items-center gap-2">
        {/* Color dot: emerald when OPEN, slate when CLOSED */}
        <span
          className={`inline-block w-2.5 h-2.5 rounded-full ${
            isOpen ? "bg-emerald-400" : "bg-slate-600"
          }`}
        />
        <span
          data-testid="door-status"
          className={`text-base font-medium ${
            isOpen ? "text-emerald-400" : "text-slate-400"
          }`}
        >
          {isOpen ? "OPEN" : "CLOSED"}
        </span>
      </div>

      {/* Toggle button — disabled when onToggle is not provided */}
      <button
        onClick={onToggle}
        disabled={!onToggle}
        className={`mt-auto min-h-[44px] min-w-[44px] rounded-xl px-4 py-2 text-sm font-semibold transition-colors
          ${
            onToggle
              ? "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 cursor-pointer"
              : "bg-slate-700/30 text-slate-600 cursor-not-allowed"
          }`}
        aria-label={isOpen ? "Close door" : "Open door"}
      >
        {isOpen ? "Close Door" : "Open Door"}
      </button>
    </div>
  );
}

export default DoorCard;
