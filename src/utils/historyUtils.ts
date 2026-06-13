import type { CommandEntry } from "../types";

/**
 * Formats a Date object as a zero-padded HH:MM:SS string.
 */
function formatTimestamp(date: Date): string {
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

/**
 * Creates a new CommandEntry from the given text and status.
 *
 * @param text   - The recognized utterance text.
 * @param status - Whether the command was matched or not recognized.
 * @param date   - Optional date to use for the timestamp; defaults to `new Date()`.
 * @returns A new CommandEntry with a unique id and formatted HH:MM:SS timestamp.
 */
export function createHistoryEntry(
  text: string,
  status: "matched" | "not_recognized",
  date?: Date
): CommandEntry {
  const resolvedDate = date ?? new Date();
  return {
    id: Date.now().toString(),
    text,
    timestamp: formatTimestamp(resolvedDate),
    status,
  };
}

/**
 * Prepends a new entry to the front of the history array without mutating the original.
 *
 * @param history - The existing array of CommandEntry items.
 * @param entry   - The new entry to add at index 0.
 * @returns A new array with `entry` at index 0 followed by all existing entries.
 */
export function prependToHistory(
  history: CommandEntry[],
  entry: CommandEntry
): CommandEntry[] {
  return [entry, ...history];
}
