/**
 * Represents the current state of all smart home devices.
 * - light: true = ON, false = OFF
 * - fan:   true = ON, false = OFF
 * - door:  true = OPEN, false = CLOSED
 */
export interface DeviceState {
  light: boolean;
  fan: boolean;
  door: boolean;
  tv: boolean;
}

/**
 * A single entry in the voice command history log.
 */
export interface CommandEntry {
  /** Unique identifier (uuid or Date.now() string) */
  id: string;
  /** The recognized utterance text */
  text: string;
  /** Timestamp formatted as HH:MM:SS */
  timestamp: string;
  /** Whether the command was matched to a known action or not recognized */
  status: "matched" | "not_recognized";
}

/**
 * Discriminated union of all possible device actions that can be dispatched.
 * UNKNOWN carries the normalized text of the unrecognized utterance.
 */
export type DeviceAction =
  | { type: "LIGHT_ON" }
  | { type: "LIGHT_OFF" }
  | { type: "FAN_ON" }
  | { type: "FAN_OFF" }
  | { type: "DOOR_OPEN" }
  | { type: "DOOR_CLOSE" }
  | { type: "TV_ON" }
  | { type: "TV_OFF" }
  | { type: "UNKNOWN"; text: string };
