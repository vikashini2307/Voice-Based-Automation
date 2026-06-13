import { describe, it, expect } from "vitest";
import { deviceReducer } from "./deviceReducer";
import type { DeviceState } from "../types";

const defaultState: DeviceState = { light: false, fan: false, door: false, tv: false };
const allOnState: DeviceState = { light: true, fan: true, door: true, tv: true };

describe("deviceReducer", () => {
  // ── LIGHT_ON ──────────────────────────────────────────────────────────────

  describe("LIGHT_ON", () => {
    it("turns light on when it is off", () => {
      const next = deviceReducer(defaultState, { type: "LIGHT_ON" });
      expect(next.light).toBe(true);
    });
    it("does not affect fan or door", () => {
      const next = deviceReducer(defaultState, { type: "LIGHT_ON" });
      expect(next.fan).toBe(false);
      expect(next.door).toBe(false);
    });
    it("is idempotent — returns same reference when light is already on", () => {
      const state: DeviceState = { light: true, fan: false, door: false, tv: false };
      const next = deviceReducer(state, { type: "LIGHT_ON" });
      expect(next).toBe(state);
    });
  });

  // ── LIGHT_OFF ─────────────────────────────────────────────────────────────

  describe("LIGHT_OFF", () => {
    it("turns light off when it is on", () => {
      const next = deviceReducer(allOnState, { type: "LIGHT_OFF" });
      expect(next.light).toBe(false);
    });
    it("is idempotent — returns same reference when light is already off", () => {
      const next = deviceReducer(defaultState, { type: "LIGHT_OFF" });
      expect(next).toBe(defaultState);
    });
  });

  // ── FAN_ON ────────────────────────────────────────────────────────────────

  describe("FAN_ON", () => {
    it("turns fan on when it is off", () => {
      const next = deviceReducer(defaultState, { type: "FAN_ON" });
      expect(next.fan).toBe(true);
    });
    it("does not affect light or door", () => {
      const next = deviceReducer(defaultState, { type: "FAN_ON" });
      expect(next.light).toBe(false);
      expect(next.door).toBe(false);
    });
    it("is idempotent — returns same reference when fan is already on", () => {
      const state: DeviceState = { light: false, fan: true, door: false, tv: false };
      const next = deviceReducer(state, { type: "FAN_ON" });
      expect(next).toBe(state);
    });
  });

  // ── FAN_OFF ───────────────────────────────────────────────────────────────

  describe("FAN_OFF", () => {
    it("turns fan off when it is on", () => {
      const next = deviceReducer(allOnState, { type: "FAN_OFF" });
      expect(next.fan).toBe(false);
    });
    it("is idempotent — returns same reference when fan is already off", () => {
      const next = deviceReducer(defaultState, { type: "FAN_OFF" });
      expect(next).toBe(defaultState);
    });
  });

  // ── DOOR_OPEN ─────────────────────────────────────────────────────────────

  describe("DOOR_OPEN", () => {
    it("opens door when it is closed", () => {
      const next = deviceReducer(defaultState, { type: "DOOR_OPEN" });
      expect(next.door).toBe(true);
    });
    it("does not affect light or fan", () => {
      const next = deviceReducer(defaultState, { type: "DOOR_OPEN" });
      expect(next.light).toBe(false);
      expect(next.fan).toBe(false);
    });
    it("is idempotent — returns same reference when door is already open", () => {
      const state: DeviceState = { light: false, fan: false, door: true, tv: false };
      const next = deviceReducer(state, { type: "DOOR_OPEN" });
      expect(next).toBe(state);
    });
  });

  // ── DOOR_CLOSE ────────────────────────────────────────────────────────────

  describe("DOOR_CLOSE", () => {
    it("closes door when it is open", () => {
      const next = deviceReducer(allOnState, { type: "DOOR_CLOSE" });
      expect(next.door).toBe(false);
    });
    it("is idempotent — returns same reference when door is already closed", () => {
      const next = deviceReducer(defaultState, { type: "DOOR_CLOSE" });
      expect(next).toBe(defaultState);
    });
  });

  // ── UNKNOWN ───────────────────────────────────────────────────────────────

  describe("UNKNOWN", () => {
    it("returns the same state reference for UNKNOWN action", () => {
      const next = deviceReducer(defaultState, { type: "UNKNOWN", text: "play music" });
      expect(next).toBe(defaultState);
    });
    it("does not mutate any device field for UNKNOWN action", () => {
      const next = deviceReducer(allOnState, { type: "UNKNOWN", text: "gibberish" });
      expect(next).toBe(allOnState);
    });
  });

  // ── State isolation ───────────────────────────────────────────────────────

  describe("state isolation", () => {
    it("does not mutate the original state object", () => {
      const state: DeviceState = { light: false, fan: false, door: false, tv: false };
      deviceReducer(state, { type: "LIGHT_ON" });
      expect(state.light).toBe(false); // original unchanged
    });
    it("only changes the targeted device field", () => {
      const state: DeviceState = { light: true, fan: true, door: false, tv: false };
      const next = deviceReducer(state, { type: "DOOR_OPEN" });
      expect(next.light).toBe(true);
      expect(next.fan).toBe(true);
      expect(next.door).toBe(true);
    });
  });
});
