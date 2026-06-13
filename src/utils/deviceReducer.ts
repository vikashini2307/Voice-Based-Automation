import type { DeviceAction, DeviceState } from "../types";

/**
 * Pure reducer for device state.
 *
 * Handles all six device actions (LIGHT_ON, LIGHT_OFF, FAN_ON, FAN_OFF,
 * DOOR_OPEN, DOOR_CLOSE). When the dispatched action already matches the
 * current device state the *same* state reference is returned unchanged
 * (idempotence), so callers can use reference equality to detect no-ops.
 *
 * UNKNOWN actions are ignored and the current state is returned as-is.
 */
export function deviceReducer(
  state: DeviceState,
  action: DeviceAction
): DeviceState {
  switch (action.type) {
    case "LIGHT_ON":
      // Idempotent: already ON → return same reference
      if (state.light === true) return state;
      return { ...state, light: true };

    case "LIGHT_OFF":
      // Idempotent: already OFF → return same reference
      if (state.light === false) return state;
      return { ...state, light: false };

    case "FAN_ON":
      if (state.fan === true) return state;
      return { ...state, fan: true };

    case "FAN_OFF":
      if (state.fan === false) return state;
      return { ...state, fan: false };

    case "DOOR_OPEN":
      if (state.door === true) return state;
      return { ...state, door: true };

    case "DOOR_CLOSE":
      if (state.door === false) return state;
      return { ...state, door: false };

    case "TV_ON":
      if (state.tv === true) return state;
      return { ...state, tv: true };

    case "TV_OFF":
      if (state.tv === false) return state;
      return { ...state, tv: false };

    case "UNKNOWN":
      // Unknown actions never mutate device state
      return state;

    default: {
      // Exhaustiveness check — TypeScript will error here if a new action
      // variant is added to DeviceAction without being handled above.
      const _exhaustive: never = action;
      return _exhaustive;
    }
  }
}
