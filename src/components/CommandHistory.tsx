import { AnimatePresence, motion } from "framer-motion";
import type { CommandEntry } from "../types";

/**
 * CommandHistory — displays a scrollable log of all voice utterances processed
 * during the current session, with Framer Motion slide-in animations.
 *
 * Requirements: 8.1–8.6
 */
interface CommandHistoryProps {
  /** List of command entries; index 0 is the most recent (prepended by parent) */
  entries: CommandEntry[];
}

export function CommandHistory({ entries }: CommandHistoryProps) {
  return (
    <div
      className="
        bg-white/[0.08]
        backdrop-blur-xl
        border border-white/[0.15]
        rounded-2xl
        p-6
        flex flex-col gap-4
        w-full
      "
    >
      {/* Section title */}
      <h2 className="text-xl font-semibold text-slate-100">Command History</h2>

      {/* Scrollable list */}
      <div className="max-h-64 overflow-y-auto flex flex-col gap-2 pr-1">
        {entries.length === 0 ? (
          /* Empty state placeholder — no animation needed */
          <p className="text-sm text-slate-400 text-center py-4">
            No commands yet. Start listening to control your home.
          </p>
        ) : (
          <AnimatePresence initial={false}>
            {entries.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="
                  flex items-start justify-between gap-3
                  rounded-xl
                  px-4 py-3
                  bg-white/[0.05]
                  border border-white/[0.08]
                "
              >
                {/* Recognized text */}
                <span
                  className={`text-sm font-medium flex-1 break-words ${
                    entry.status === "not_recognized"
                      ? "text-red-400"
                      : "text-slate-100"
                  }`}
                >
                  {entry.text}
                </span>

                {/* Timestamp */}
                <span className="text-xs text-slate-400 shrink-0 mt-0.5 font-mono">
                  {entry.timestamp}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

export default CommandHistory;
