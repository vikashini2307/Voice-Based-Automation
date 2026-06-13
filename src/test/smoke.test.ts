import { describe, it, expect } from "vitest";
import { SYNONYM_MAP, FEEDBACK_MAP } from "../constants";
import type { DeviceAction, DeviceState, CommandEntry } from "../types";

describe("Task 1 — Types and Constants smoke tests", () => {
  it("SYNONYM_MAP has exactly 18 entries", () => {
    expect(Object.keys(SYNONYM_MAP)).toHaveLength(18);
  });

  it("FEEDBACK_MAP has exactly 6 entries", () => {
    expect(Object.keys(FEEDBACK_MAP)).toHaveLength(6);
  });

  it("SYNONYM_MAP covers all 6 action types", () => {
    const actionTypes = new Set(Object.values(SYNONYM_MAP));
    expect(actionTypes).toContain("LIGHT_ON");
    expect(actionTypes).toContain("LIGHT_OFF");
    expect(actionTypes).toContain("FAN_ON");
    expect(actionTypes).toContain("FAN_OFF");
    expect(actionTypes).toContain("DOOR_OPEN");
    expect(actionTypes).toContain("DOOR_CLOSE");
  });

  it("FEEDBACK_MAP covers all 6 action types", () => {
    expect(FEEDBACK_MAP.LIGHT_ON).toBe("Light turned on");
    expect(FEEDBACK_MAP.LIGHT_OFF).toBe("Light turned off");
    expect(FEEDBACK_MAP.FAN_ON).toBe("Fan turned on");
    expect(FEEDBACK_MAP.FAN_OFF).toBe("Fan turned off");
    expect(FEEDBACK_MAP.DOOR_OPEN).toBe("Door opened");
    expect(FEEDBACK_MAP.DOOR_CLOSE).toBe("Door closed");
  });

  it("DeviceState type shape is correct", () => {
    const state: DeviceState = { light: false, fan: false, door: false };
    expect(state.light).toBe(false);
    expect(state.fan).toBe(false);
    expect(state.door).toBe(false);
  });

  it("CommandEntry type shape is correct", () => {
    const entry: CommandEntry = {
      id: "1",
      text: "turn on light",
      timestamp: "12:00:00",
      status: "matched",
    };
    expect(entry.status).toBe("matched");
  });

  it("DeviceAction discriminated union works for UNKNOWN", () => {
    const action: DeviceAction = { type: "UNKNOWN", text: "hello" };
    expect(action.type).toBe("UNKNOWN");
    if (action.type === "UNKNOWN") {
      expect(action.text).toBe("hello");
    }
  });

  it("SYNONYM_MAP light-on synonyms are correct", () => {
    expect(SYNONYM_MAP["turn on light"]).toBe("LIGHT_ON");
    expect(SYNONYM_MAP["light on"]).toBe("LIGHT_ON");
    expect(SYNONYM_MAP["switch on light"]).toBe("LIGHT_ON");
  });

  it("SYNONYM_MAP door synonyms are correct", () => {
    expect(SYNONYM_MAP["open door"]).toBe("DOOR_OPEN");
    expect(SYNONYM_MAP["unlock door"]).toBe("DOOR_OPEN");
    expect(SYNONYM_MAP["door open"]).toBe("DOOR_OPEN");
    expect(SYNONYM_MAP["close door"]).toBe("DOOR_CLOSE");
    expect(SYNONYM_MAP["lock door"]).toBe("DOOR_CLOSE");
    expect(SYNONYM_MAP["door close"]).toBe("DOOR_CLOSE");
  });
});
