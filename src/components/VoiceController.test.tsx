import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import React from "react";

// Mock framer-motion to avoid animation-related issues in jsdom
vi.mock("framer-motion", () => ({
  motion: {
    span: ({
      children,
      animate,
      ...rest
    }: React.HTMLAttributes<HTMLSpanElement> & { animate?: Record<string, unknown> }) => (
      <span data-animate={JSON.stringify(animate)} {...rest}>
        {children}
      </span>
    ),
    div: ({
      children,
      animate,
      ...rest
    }: React.HTMLAttributes<HTMLDivElement> & { animate?: Record<string, unknown> }) => (
      <div data-animate={JSON.stringify(animate)} {...rest}>
        {children}
      </div>
    ),
    p: ({
      children,
      animate,
      ...rest
    }: React.HTMLAttributes<HTMLParagraphElement> & { animate?: Record<string, unknown> }) => (
      <p data-animate={JSON.stringify(animate)} {...rest}>
        {children}
      </p>
    ),
    button: ({
      children,
      animate,
      onClick,
      disabled,
      "aria-label": ariaLabel,
      "aria-pressed": ariaPressed,
      ...rest
    }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
      animate?: Record<string, unknown>;
      "aria-label"?: string;
      "aria-pressed"?: boolean | "true" | "false";
    }) => (
      <button
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-pressed={ariaPressed}
        data-animate={JSON.stringify(animate)}
        {...rest}
      >
        {children}
      </button>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import { VoiceController } from "./VoiceController";

type MockSpeechRecognitionInstance = {
  start: ReturnType<typeof vi.fn>;
  stop: ReturnType<typeof vi.fn>;
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: unknown) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
};

// Helper to get the most recently created mock SpeechRecognition instance
function getLastRecognitionInstance(): MockSpeechRecognitionInstance | undefined {
  const MockSR = (globalThis as unknown as { SpeechRecognition: ReturnType<typeof vi.fn> })
    .SpeechRecognition;
  const instances = MockSR?.mock?.instances;
  if (!instances || instances.length === 0) return undefined;
  return instances[instances.length - 1] as MockSpeechRecognitionInstance;
}

describe("VoiceController", () => {
  beforeEach(() => {
    const MockSR = (globalThis as unknown as { SpeechRecognition: ReturnType<typeof vi.fn> })
      .SpeechRecognition;
    MockSR?.mockClear();
  });

  it("renders Start Listening button initially", () => {
    render(<VoiceController onCommand={() => {}} />);
    expect(screen.getByText("Start Listening")).toBeInTheDocument();
  });

  it("toggles to Stop Listening when Start Listening is clicked", async () => {
    render(<VoiceController onCommand={() => {}} />);
    const button = screen.getByText("Start Listening").closest("button")!;
    await act(async () => {
      fireEvent.click(button);
    });
    expect(screen.getByText("Stop Listening")).toBeInTheDocument();
  });

  it("toggles back to Start Listening when Stop Listening is clicked", async () => {
    render(<VoiceController onCommand={() => {}} />);
    const startButton = screen.getByText("Start Listening").closest("button")!;
    await act(async () => {
      fireEvent.click(startButton);
    });
    const stopButton = screen.getByText("Stop Listening").closest("button")!;
    await act(async () => {
      fireEvent.click(stopButton);
    });
    expect(screen.getByText("Start Listening")).toBeInTheDocument();
  });

  it("calls recognition.start() when Start Listening is clicked", async () => {
    render(<VoiceController onCommand={() => {}} />);
    const button = screen.getByText("Start Listening").closest("button")!;
    await act(async () => {
      fireEvent.click(button);
    });
    const instance = getLastRecognitionInstance();
    expect(instance).toBeDefined();
    expect(instance!.start).toHaveBeenCalledTimes(1);
  });

  it("calls recognition.stop() when Stop Listening is clicked", async () => {
    render(<VoiceController onCommand={() => {}} />);
    const startButton = screen.getByText("Start Listening").closest("button")!;
    await act(async () => {
      fireEvent.click(startButton);
    });
    const stopButton = screen.getByText("Stop Listening").closest("button")!;
    await act(async () => {
      fireEvent.click(stopButton);
    });
    const instance = getLastRecognitionInstance();
    expect(instance).toBeDefined();
    expect(instance!.stop).toHaveBeenCalled();
  });

  it("shows unsupported browser error banner when SpeechRecognition is not available", () => {
    // Temporarily override SpeechRecognition to undefined using Object.defineProperty
    const g = globalThis as unknown as Record<string, unknown>;
    const originalSR = g.SpeechRecognition;
    const originalWSR = g.webkitSpeechRecognition;

    Object.defineProperty(globalThis, "SpeechRecognition", {
      writable: true,
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(globalThis, "webkitSpeechRecognition", {
      writable: true,
      configurable: true,
      value: undefined,
    });

    render(<VoiceController onCommand={() => {}} />);

    expect(
      screen.getByText(/Voice control is not supported in this browser/i)
    ).toBeInTheDocument();

    // Restore
    Object.defineProperty(globalThis, "SpeechRecognition", {
      writable: true,
      configurable: true,
      value: originalSR,
    });
    Object.defineProperty(globalThis, "webkitSpeechRecognition", {
      writable: true,
      configurable: true,
      value: originalWSR,
    });
  });

  it("disables the button when SpeechRecognition is not available", () => {
    const g = globalThis as unknown as Record<string, unknown>;
    const originalSR = g.SpeechRecognition;
    const originalWSR = g.webkitSpeechRecognition;

    Object.defineProperty(globalThis, "SpeechRecognition", {
      writable: true,
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(globalThis, "webkitSpeechRecognition", {
      writable: true,
      configurable: true,
      value: undefined,
    });

    render(<VoiceController onCommand={() => {}} />);

    const button = screen.getByText("Start Listening").closest("button")!;
    expect(button).toBeDisabled();

    // Restore
    Object.defineProperty(globalThis, "SpeechRecognition", {
      writable: true,
      configurable: true,
      value: originalSR,
    });
    Object.defineProperty(globalThis, "webkitSpeechRecognition", {
      writable: true,
      configurable: true,
      value: originalWSR,
    });
  });

  it("shows permission denied error message when onerror fires with not-allowed", async () => {
    render(<VoiceController onCommand={() => {}} />);

    // Start listening to create the recognition instance
    const startButton = screen.getByText("Start Listening").closest("button")!;
    await act(async () => {
      fireEvent.click(startButton);
    });

    const instance = getLastRecognitionInstance();
    expect(instance).toBeDefined();

    // Simulate permission denied error
    await act(async () => {
      if (instance!.onerror) {
        instance!.onerror({ error: "not-allowed" });
      }
    });

    expect(
      screen.getByText(/Microphone access was denied/i)
    ).toBeInTheDocument();
  });

  it("does not restart recognition after permission denied error", async () => {
    render(<VoiceController onCommand={() => {}} />);

    const startButton = screen.getByText("Start Listening").closest("button")!;
    await act(async () => {
      fireEvent.click(startButton);
    });

    const MockSR = (globalThis as unknown as { SpeechRecognition: ReturnType<typeof vi.fn> })
      .SpeechRecognition;
    const instanceCountBefore = MockSR.mock.instances.length;

    const instance = getLastRecognitionInstance();
    expect(instance).toBeDefined();

    // Simulate permission denied error
    await act(async () => {
      if (instance!.onerror) {
        instance!.onerror({ error: "not-allowed" });
      }
    });

    // No new recognition instance should have been created (no auto-restart)
    expect(MockSR.mock.instances.length).toBe(instanceCountBefore);
  });

  it("disables the button after permission denied error", async () => {
    render(<VoiceController onCommand={() => {}} />);

    const startButton = screen.getByText("Start Listening").closest("button")!;
    await act(async () => {
      fireEvent.click(startButton);
    });

    const instance = getLastRecognitionInstance();
    expect(instance).toBeDefined();

    await act(async () => {
      if (instance!.onerror) {
        instance!.onerror({ error: "not-allowed" });
      }
    });

    const button = screen.getByText("Start Listening").closest("button")!;
    expect(button).toBeDisabled();
  });
});
