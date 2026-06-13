import type { DeviceAction } from "../types";
import { SYNONYM_MAP } from "../constants";

/**
 * Parses a raw voice transcript into a DeviceAction.
 *
 * Algorithm:
 * 1. Normalize the input by converting to lowercase and trimming whitespace.
 * 2. Perform an exact-match lookup against SYNONYM_MAP.
 * 3. Return the mapped DeviceAction, or { type: "UNKNOWN", text: normalized }
 *    if no match is found.
 *
 * Only full normalized utterances are matched — no substring matching.
 */
export function parseCommand(transcript: string): DeviceAction {
  const normalized = transcript.toLowerCase().trim();

  const actionType = SYNONYM_MAP[normalized];

  if (actionType !== undefined) {
    return { type: actionType };
  }

  return { type: "UNKNOWN", text: normalized };
}
