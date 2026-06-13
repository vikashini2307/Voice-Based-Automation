import { describe, it, expect } from "vitest";
import { parseCommand } from "./parseCommand";
import { SYNONYM_MAP } from "../constants";

describe("parseCommand", () => {
  // ── All 18 synonyms ──────────────────────────────────────────────────────

  describe("Light ON synonyms", () => {
    it('maps "turn on light" → LIGHT_ON', () => {
      expect(parseCommand("turn on light")).toEqual({ type: "LIGHT_ON" });
    });
    it('maps "light on" → LIGHT_ON', () => {
      expect(parseCommand("light on")).toEqual({ type: "LIGHT_ON" });
    });
    it('maps "switch on light" → LIGHT_ON', () => {
      expect(parseCommand("switch on light")).toEqual({ type: "LIGHT_ON" });
    });
  });

  describe("Light OFF synonyms", () => {
    it('maps "turn off light" → LIGHT_OFF', () => {
      expect(parseCommand("turn off light")).toEqual({ type: "LIGHT_OFF" });
    });
    it('maps "light off" → LIGHT_OFF', () => {
      expect(parseCommand("light off")).toEqual({ type: "LIGHT_OFF" });
    });
    it('maps "switch off light" → LIGHT_OFF', () => {
      expect(parseCommand("switch off light")).toEqual({ type: "LIGHT_OFF" });
    });
  });

  describe("Fan ON synonyms", () => {
    it('maps "fan on" → FAN_ON', () => {
      expect(parseCommand("fan on")).toEqual({ type: "FAN_ON" });
    });
    it('maps "fan start" → FAN_ON', () => {
      expect(parseCommand("fan start")).toEqual({ type: "FAN_ON" });
    });
    it('maps "turn on fan" → FAN_ON', () => {
      expect(parseCommand("turn on fan")).toEqual({ type: "FAN_ON" });
    });
  });

  describe("Fan OFF synonyms", () => {
    it('maps "fan off" → FAN_OFF', () => {
      expect(parseCommand("fan off")).toEqual({ type: "FAN_OFF" });
    });
    it('maps "fan stop" → FAN_OFF', () => {
      expect(parseCommand("fan stop")).toEqual({ type: "FAN_OFF" });
    });
    it('maps "turn off fan" → FAN_OFF', () => {
      expect(parseCommand("turn off fan")).toEqual({ type: "FAN_OFF" });
    });
  });

  describe("Door OPEN synonyms", () => {
    it('maps "open door" → DOOR_OPEN', () => {
      expect(parseCommand("open door")).toEqual({ type: "DOOR_OPEN" });
    });
    it('maps "unlock door" → DOOR_OPEN', () => {
      expect(parseCommand("unlock door")).toEqual({ type: "DOOR_OPEN" });
    });
    it('maps "door open" → DOOR_OPEN', () => {
      expect(parseCommand("door open")).toEqual({ type: "DOOR_OPEN" });
    });
  });

  describe("Door CLOSE synonyms", () => {
    it('maps "close door" → DOOR_CLOSE', () => {
      expect(parseCommand("close door")).toEqual({ type: "DOOR_CLOSE" });
    });
    it('maps "lock door" → DOOR_CLOSE', () => {
      expect(parseCommand("lock door")).toEqual({ type: "DOOR_CLOSE" });
    });
    it('maps "door close" → DOOR_CLOSE', () => {
      expect(parseCommand("door close")).toEqual({ type: "DOOR_CLOSE" });
    });
  });

  // ── Normalization ─────────────────────────────────────────────────────────

  describe("normalization", () => {
    it("normalizes uppercase input", () => {
      expect(parseCommand("TURN ON LIGHT")).toEqual({ type: "LIGHT_ON" });
    });
    it("normalizes mixed-case input", () => {
      expect(parseCommand("Fan On")).toEqual({ type: "FAN_ON" });
    });
    it("trims leading/trailing whitespace", () => {
      expect(parseCommand("  open door  ")).toEqual({ type: "DOOR_OPEN" });
    });
  });

  // ── UNKNOWN cases ─────────────────────────────────────────────────────────

  describe("UNKNOWN handling", () => {
    it("returns UNKNOWN for empty string", () => {
      const result = parseCommand("");
      expect(result.type).toBe("UNKNOWN");
    });
    it("returns UNKNOWN for whitespace-only string", () => {
      const result = parseCommand("   ");
      expect(result.type).toBe("UNKNOWN");
    });
    it("returns UNKNOWN for unrecognized command", () => {
      const result = parseCommand("play music");
      expect(result.type).toBe("UNKNOWN");
      if (result.type === "UNKNOWN") {
        expect(result.text).toBe("play music");
      }
    });
    it("returns UNKNOWN for partial synonym match", () => {
      // "light" alone is not a synonym
      const result = parseCommand("light");
      expect(result.type).toBe("UNKNOWN");
    });
    it("UNKNOWN carries the normalized text", () => {
      const result = parseCommand("  HELLO WORLD  ");
      expect(result.type).toBe("UNKNOWN");
      if (result.type === "UNKNOWN") {
        expect(result.text).toBe("hello world");
      }
    });
  });

  // ── Completeness check ────────────────────────────────────────────────────

  it("SYNONYM_MAP has exactly 18 entries (all covered above)", () => {
    expect(Object.keys(SYNONYM_MAP)).toHaveLength(18);
  });
});
