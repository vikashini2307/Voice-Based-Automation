import type { DeviceAction } from "../types";
import { FEEDBACK_MAP } from "../constants";

/**
 * Returns the exact speech synthesis feedback phrase for a known device action type.
 *
 * @param actionType - A DeviceAction type, excluding "UNKNOWN"
 * @returns The corresponding phrase from FEEDBACK_MAP
 *
 * @example
 * getFeedbackPhrase("LIGHT_ON")  // → "Light turned on"
 * getFeedbackPhrase("DOOR_CLOSE") // → "Door closed"
 */
export function getFeedbackPhrase(
  actionType: Exclude<DeviceAction["type"], "UNKNOWN">
): string {
  return FEEDBACK_MAP[actionType];
}

/**
 * Speaks the given text using the browser's SpeechSynthesis API.
 *
 * - If SpeechSynthesis is unavailable, silently skips (Requirement 7.9).
 * - Cancels any currently playing utterance before speaking the new one (Requirement 7.10).
 *
 * @param text - The string to be spoken aloud
 */
export function speak(text: string): void {
  // Silently skip if SpeechSynthesis is not available in this environment
  if (typeof window === "undefined" || typeof window.speechSynthesis === "undefined") {
    return;
  }

  // Cancel any utterance currently in progress so the new feedback is heard immediately
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
}
