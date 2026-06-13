import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { DeviceAction } from "../types";
import { parseCommand } from "../utils/parseCommand";
import { getFeedbackPhrase, speak } from "../utils/speechUtils";

/**
 * VoiceController — manages the Web Speech API lifecycle, command parsing,
 * and speech synthesis feedback.
 *
 * Requirements: 2.1–2.8, 7.8–7.10, 9.1–9.6, 10.4, 12.2, 12.3
 */
interface VoiceControllerProps {
  /** Called with the parsed DeviceAction whenever a speech result is received */
  onCommand: (action: DeviceAction) => void;
  /** Optional callback notified when speech synthesis starts or stops */
  onSpeakingChange?: (isSpeaking: boolean) => void;
}

// Minimal type definitions for the Web Speech API (not fully typed in all TS DOM libs)
interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

// Extend the Window interface to include webkit-prefixed SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export function VoiceController({ onCommand, onSpeakingChange }: VoiceControllerProps) {
  const [isListening, setIsListening] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [transientError, setTransientError] = useState<string | null>(null);

  // Hold the recognition instance across renders without triggering re-renders
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const transientErrorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Detect Web Speech API support on mount (Requirement 2.5, 12.3)
  useEffect(() => {
    const SpeechRecognitionAPI: SpeechRecognitionConstructor | undefined =
      typeof window !== "undefined"
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : undefined;

    if (!SpeechRecognitionAPI) {
      setIsSupported(false);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (transientErrorTimerRef.current) {
        clearTimeout(transientErrorTimerRef.current);
      }
    };
  }, []);

  const showTransientError = useCallback((message: string) => {
    setTransientError(message);
    if (transientErrorTimerRef.current) {
      clearTimeout(transientErrorTimerRef.current);
    }
    transientErrorTimerRef.current = setTimeout(() => {
      setTransientError(null);
    }, 4000);
  }, []);

  /**
   * startListening — creates and configures a SpeechRecognition instance,
   * attaches event handlers, and starts capturing audio.
   * Requirements: 2.2, 9.5
   */
  const startListening = useCallback(() => {
    const SpeechRecognitionAPI: SpeechRecognitionConstructor | undefined =
      typeof window !== "undefined"
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : undefined;

    if (!SpeechRecognitionAPI) return;

    const recognition: SpeechRecognitionInstance = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    // onresult: extract transcript, parse command, invoke callback, speak feedback
    // Requirements: 2.4, 7.1–7.7, 7.10
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[event.resultIndex][0].transcript;
      const action = parseCommand(transcript);

      onCommand(action);

      if (action.type !== "UNKNOWN") {
        // Speak the matched command's feedback phrase (Requirement 7.1–7.6, 7.10)
        const phrase = getFeedbackPhrase(
          action.type as Exclude<DeviceAction["type"], "UNKNOWN">
        );
        speak(phrase);
      } else {
        // Speak "Command not recognized" for unmatched utterances (Requirement 7.7)
        speak("Command not recognized");
      }
    };

    // onerror: handle permission denial and other errors (Requirement 2.8)
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "not-allowed") {
        // Permanent permission error — disable button, never auto-restart
        setPermissionError(
          "Microphone access was denied. Please allow microphone access in your browser settings."
        );
        setIsListening(false);
      } else {
        // Transient error — allow user to retry manually, never auto-restart
        setIsListening(false);
        showTransientError(
          `Speech recognition error: ${event.error}. Click "Start Listening" to try again.`
        );
      }
    };

    recognition.onend = () => {
      // Only update state if we didn't already set it to false via stopListening/onerror
      setIsListening((prev) => {
        if (prev) return false;
        return prev;
      });
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [onCommand, showTransientError]);

  /**
   * stopListening — stops the active recognition session.
   * Requirements: 2.3, 9.6
   */
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  const handleButtonClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Notify parent of speaking state changes when onSpeakingChange is provided
  // (Requirement 11.2)
  useEffect(() => {
    if (onSpeakingChange) {
      onSpeakingChange(isListening);
    }
  }, [isListening, onSpeakingChange]);

  const isDisabled = !isSupported || permissionError !== null;

  return (
    <div
      className="
        bg-white/[0.08]
        backdrop-blur-xl
        border border-white/[0.15]
        rounded-2xl
        p-6
        flex flex-col items-center gap-4
        w-full
      "
    >
      {/* Card title */}
      <h2 className="text-xl font-semibold text-slate-100 self-start">
        Voice Control
      </h2>

      {/* Unsupported browser banner (Requirement 2.5, 12.3) */}
      {!isSupported && (
        <div
          role="alert"
          className="
            w-full
            rounded-xl
            px-4 py-3
            bg-red-500/20
            border border-red-400/30
            text-red-300
            text-sm
          "
        >
          Voice control is not supported in this browser. Please use Chrome or Edge.
        </div>
      )}

      {/* Microphone button with Framer Motion pulse animation (Requirements 9.1–9.3, 10.4) */}
      <motion.button
        onClick={handleButtonClick}
        disabled={isDisabled}
        aria-label={isListening ? "Stop listening" : "Start listening"}
        aria-pressed={isListening}
        animate={
          isListening
            ? { scale: [1, 1.05, 1] }
            : { scale: 1 }
        }
        transition={
          isListening
            ? { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.2 }
        }
        className="
          flex items-center gap-3
          min-h-[44px]
          min-w-[44px]
          px-6 py-3
          rounded-xl
          text-base font-semibold
          transition-colors duration-200
          disabled:opacity-40 disabled:cursor-not-allowed
          enabled:cursor-pointer
          border
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400/50
        "
        style={{
          backgroundColor: isListening
            ? "rgba(248, 113, 113, 0.2)"
            : "rgba(255, 255, 255, 0.08)",
          borderColor: isListening
            ? "rgba(248, 113, 113, 0.4)"
            : "rgba(255, 255, 255, 0.15)",
          color: isListening ? "#f87171" : "#f1f5f9",
        }}
      >
        {/* Microphone emoji icon */}
        <span aria-hidden="true" className="text-xl">
          🎤
        </span>
        <span>{isListening ? "Stop Listening" : "Start Listening"}</span>
      </motion.button>

      {/* Active / inactive visual indicator badge (Requirement 2.6) */}
      <div className="flex items-center gap-2">
        <AnimatePresence mode="wait">
          {isListening ? (
            <motion.span
              key="active-badge"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [1, 0.5, 1], scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block w-2.5 h-2.5 rounded-full bg-red-400"
              aria-hidden="true"
            />
          ) : (
            <motion.span
              key="inactive-badge"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="inline-block w-2.5 h-2.5 rounded-full bg-slate-500"
              aria-hidden="true"
            />
          )}
        </AnimatePresence>
        <span className="text-sm text-slate-400">
          {isListening ? "Listening…" : "Inactive"}
        </span>
      </div>

      {/* Permission error message (Requirement 2.8, 9.4) */}
      <AnimatePresence>
        {permissionError && (
          <motion.p
            key="permission-error"
            role="alert"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="
              w-full
              text-sm
              text-red-300
              bg-red-500/10
              border border-red-400/20
              rounded-xl
              px-4 py-3
            "
          >
            {permissionError}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Transient error message for non-permission errors */}
      <AnimatePresence>
        {transientError && (
          <motion.p
            key="transient-error"
            role="status"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="
              w-full
              text-sm
              text-amber-300
              bg-amber-500/10
              border border-amber-400/20
              rounded-xl
              px-4 py-3
            "
          >
            {transientError}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default VoiceController;
