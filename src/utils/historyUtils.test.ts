import { describe, it, expect } from "vitest";
import { createHistoryEntry, prependToHistory } from "./historyUtils";
import type { CommandEntry } from "../types";

describe("createHistoryEntry", () => {
  // ── Timestamp format ──────────────────────────────────────────────────────

  it("formats timestamp as HH:MM:SS", () => {
    const date = new Date(2024, 0, 1, 9, 5, 3); // 09:05:03
    const entry = createHistoryEntry("turn on light", "matched", date);
    expect(entry.timestamp).toBe("09:05:03");
  });

  it("zero-pads single-digit hours, minutes, and seconds", () => {
    const date = new Date(2024, 0, 1, 1, 2, 3); // 01:02:03
    const entry = createHistoryEntry("fan on", "matched", date);
    expect(entry.timestamp).toBe("01:02:03");
  });

  it("handles midnight correctly (00:00:00)", () => {
    const date = new Date(2024, 0, 1, 0, 0, 0);
    const entry = createHistoryEntry("fan off", "matched", date);
    expect(entry.timestamp).toBe("00:00:00");
  });

  it("handles end-of-day time correctly (23:59:59)", () => {
    const date = new Date(2024, 0, 1, 23, 59, 59);
    const entry = createHistoryEntry("close door", "matched", date);
    expect(entry.timestamp).toBe("23:59:59");
  });

  // ── Field correctness ─────────────────────────────────────────────────────

  it("sets text field correctly", () => {
    const entry = createHistoryEntry("open door", "matched", new Date());
    expect(entry.text).toBe("open door");
  });

  it("sets status to matched", () => {
    const entry = createHistoryEntry("light on", "matched", new Date());
    expect(entry.status).toBe("matched");
  });

  it("sets status to not_recognized", () => {
    const entry = createHistoryEntry("play music", "not_recognized", new Date());
    expect(entry.status).toBe("not_recognized");
  });

  it("produces a non-empty id string", () => {
    const entry = createHistoryEntry("fan start", "matched", new Date());
    expect(typeof entry.id).toBe("string");
    expect(entry.id.length).toBeGreaterThan(0);
  });

  it("uses current date when no date is provided", () => {
    const before = Date.now();
    const entry = createHistoryEntry("fan stop", "matched");
    const after = Date.now();
    // id is Date.now() at creation time — should be within the window
    const id = Number(entry.id);
    expect(id).toBeGreaterThanOrEqual(before);
    expect(id).toBeLessThanOrEqual(after);
  });
});

describe("prependToHistory", () => {
  const makeEntry = (text: string): CommandEntry => ({
    id: text,
    text,
    timestamp: "00:00:00",
    status: "matched",
  });

  // ── Ordering ──────────────────────────────────────────────────────────────

  it("places the new entry at index 0", () => {
    const existing = [makeEntry("old command")];
    const newEntry = makeEntry("new command");
    const result = prependToHistory(existing, newEntry);
    expect(result[0]).toBe(newEntry);
  });

  it("preserves existing entries after the new one", () => {
    const a = makeEntry("a");
    const b = makeEntry("b");
    const newEntry = makeEntry("new");
    const result = prependToHistory([a, b], newEntry);
    expect(result[1]).toBe(a);
    expect(result[2]).toBe(b);
  });

  it("returns array of length existing + 1", () => {
    const existing = [makeEntry("x"), makeEntry("y")];
    const result = prependToHistory(existing, makeEntry("z"));
    expect(result).toHaveLength(3);
  });

  it("works with an empty history array", () => {
    const newEntry = makeEntry("first");
    const result = prependToHistory([], newEntry);
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(newEntry);
  });

  // ── Immutability ──────────────────────────────────────────────────────────

  it("does not mutate the original history array", () => {
    const existing = [makeEntry("original")];
    const originalLength = existing.length;
    prependToHistory(existing, makeEntry("new"));
    expect(existing).toHaveLength(originalLength);
  });

  it("returns a new array reference", () => {
    const existing = [makeEntry("a")];
    const result = prependToHistory(existing, makeEntry("b"));
    expect(result).not.toBe(existing);
  });
});
