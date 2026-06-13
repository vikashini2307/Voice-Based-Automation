import type { DeviceAction } from "./types";

/**
 * Maps normalized voice utterances to their corresponding DeviceAction types.
 * All keys are already lowercase and trimmed (normalized form).
 * Contains exactly 18 synonym entries covering all 6 device actions.
 */
export type SynonymMap = Record<
  string,
  Exclude<DeviceAction["type"], "UNKNOWN">
>;

export const SYNONYM_MAP: SynonymMap = {
  // Light ON synonyms
  "turn on light": "LIGHT_ON",
  "light on": "LIGHT_ON",
  "switch on light": "LIGHT_ON",

  // Light OFF synonyms
  "turn off light": "LIGHT_OFF",
  "light off": "LIGHT_OFF",
  "switch off light": "LIGHT_OFF",

  // Fan ON synonyms
  "fan on": "FAN_ON",
  "fan start": "FAN_ON",
  "turn on fan": "FAN_ON",

  // Fan OFF synonyms
  "fan off": "FAN_OFF",
  "fan stop": "FAN_OFF",
  "turn off fan": "FAN_OFF",

  // Door OPEN synonyms
  "open door": "DOOR_OPEN",
  "unlock door": "DOOR_OPEN",
  "door open": "DOOR_OPEN",

  // Door CLOSE synonyms
  "close door": "DOOR_CLOSE",
  "lock door": "DOOR_CLOSE",
  "door close": "DOOR_CLOSE",

  // TV ON synonyms
  "turn on tv": "TV_ON",
  "tv on": "TV_ON",
  "switch on tv": "TV_ON",

  // TV OFF synonyms
  "turn off tv": "TV_OFF",
  "tv off": "TV_OFF",
  "switch off tv": "TV_OFF",
};

/**
 * Maps each known DeviceAction type to the exact speech synthesis feedback phrase.
 * Used by the speak() helper to provide audible confirmation after each command.
 */
export const FEEDBACK_MAP: Record<
  Exclude<DeviceAction["type"], "UNKNOWN">,
  string
> = {
  LIGHT_ON: "Light turned on",
  LIGHT_OFF: "Light turned off",
  FAN_ON: "Fan turned on",
  FAN_OFF: "Fan turned off",
  DOOR_OPEN: "Door opened",
  DOOR_CLOSE: "Door closed",
  TV_ON: "TV turned on",
  TV_OFF: "TV turned off",
};
