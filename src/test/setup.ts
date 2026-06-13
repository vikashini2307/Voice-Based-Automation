import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock Web Speech API — SpeechRecognition
// Must use a class (constructor function) so `new SpeechRecognitionAPI()` works
class MockSpeechRecognitionClass {
  start = vi.fn();
  stop = vi.fn();
  abort = vi.fn();
  addEventListener = vi.fn();
  removeEventListener = vi.fn();
  continuous = false;
  interimResults = false;
  lang = "";
  onresult: ((event: unknown) => void) | null = null;
  onerror: ((event: unknown) => void) | null = null;
  onend: (() => void) | null = null;
  onstart: (() => void) | null = null;
}

const mockSpeechRecognition = vi.fn().mockImplementation(function (this: MockSpeechRecognitionClass) {
  return Object.assign(this, new MockSpeechRecognitionClass());
});

// Assign to both standard and webkit-prefixed names
Object.defineProperty(globalThis, "SpeechRecognition", {
  writable: true,
  configurable: true,
  value: mockSpeechRecognition,
});
Object.defineProperty(globalThis, "webkitSpeechRecognition", {
  writable: true,
  configurable: true,
  value: mockSpeechRecognition,
});

// Mock Web Speech API — SpeechSynthesis
Object.defineProperty(globalThis, "speechSynthesis", {
  writable: true,
  value: {
    speak: vi.fn(),
    cancel: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    getVoices: vi.fn().mockReturnValue([]),
    speaking: false,
    pending: false,
    paused: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  },
});

// Mock SpeechSynthesisUtterance
Object.defineProperty(globalThis, "SpeechSynthesisUtterance", {
  writable: true,
  value: vi.fn().mockImplementation((text: string) => ({
    text,
    lang: "",
    pitch: 1,
    rate: 1,
    volume: 1,
    voice: null,
    onend: null,
    onerror: null,
    onstart: null,
  })),
});
