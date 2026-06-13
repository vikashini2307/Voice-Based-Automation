import { useState, Suspense } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { DeviceState, CommandEntry, DeviceAction } from "./types";
import { deviceReducer } from "./utils/deviceReducer";
import { createHistoryEntry, prependToHistory } from "./utils/historyUtils";
import { VoiceController } from "./components/VoiceController";
import { CommandHistory } from "./components/CommandHistory";
import { RoomScene } from "./components/room/RoomScene";
import { usePersonMovement } from "./hooks/usePersonMovement";
import { useDeviceSync } from "./hooks/useDeviceSync";

function App() {
  const [devices, setDevices] = useState<DeviceState>({
    light: false,
    fan: false,
    door: false,
    tv: false,
  });
  const [history, setHistory] = useState<CommandEntry[]>([]);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { personState } = usePersonMovement();

  // Sync device state to Firestore on every change
  useDeviceSync(devices);

  function addToHistory(text: string, status: "matched" | "not_recognized"): void {
    const entry = createHistoryEntry(text, status);
    setHistory((prev) => prependToHistory(prev, entry));
  }

  function handleCommand(action: DeviceAction): void {
    if (action.type === "UNKNOWN") {
      addToHistory(action.text, "not_recognized");
      setLastAction(null);
      return;
    }

    const newDevices = deviceReducer(devices, action);
    if (newDevices !== devices) {
      setDevices(newDevices);
    }

    const actionLabels: Record<Exclude<DeviceAction["type"], "UNKNOWN">, string> = {
      LIGHT_ON: "turn on light",
      LIGHT_OFF: "turn off light",
      FAN_ON: "fan on",
      FAN_OFF: "fan off",
      DOOR_OPEN: "open door",
      DOOR_CLOSE: "close door",
      TV_ON: "turn on tv",
      TV_OFF: "turn off tv",
    };
    const label = actionLabels[action.type];
    addToHistory(label, "matched");
    setLastAction(label);
    setTimeout(() => setLastAction(null), 3000);
  }

  return (
    <div className="min-h-screen bg-[#0a0a18] text-slate-100 flex flex-col">

      {/* ── Top bar ── */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-white/[0.08] bg-black/30 backdrop-blur-md z-20 relative">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors"
        >
          ← Home
        </Link>
        <h1 className="text-base font-bold text-slate-100 tracking-wide">
          🏠 Smart Home Dashboard
        </h1>
        {/* Device status pills */}
        <div className="flex items-center gap-2">
          <StatusPill label="Light" active={devices.light} color="#fbbf24" />
          <StatusPill label="Fan" active={devices.fan} color="#60a5fa" />
          <StatusPill label="Door" active={devices.door} color="#34d399" activeLabel="Open" inactiveLabel="Closed" />
          <StatusPill label="TV" active={devices.tv} color="#a78bfa" />
        </div>
      </header>

      {/* ── Main layout: 3D room + side panel ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ══ 3D ROOM ══ */}
        <div className="flex-1 relative">
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center text-slate-500">
              Loading room...
            </div>
          }>
            <RoomScene
              fanOn={devices.fan}
              lightOn={devices.light}
              doorOpen={devices.door}
              tvOn={devices.tv}
              isSpeaking={isSpeaking}
              personState={personState}
            />
          </Suspense>

          {/* Command toast overlay */}
          <AnimatePresence>
            {lastAction && (
              <motion.div
                key={lastAction}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-full bg-black/70 backdrop-blur border border-white/10 text-sm font-medium text-slate-200 flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                &ldquo;{lastAction}&rdquo; executed
              </motion.div>
            )}
          </AnimatePresence>

          {/* Orbit hint */}
          <div className="absolute top-3 left-3 text-xs text-slate-500 pointer-events-none select-none leading-5">
            🖱 Drag to orbit · Scroll to zoom
            <br />
            <span className="text-slate-600">⌨ WASD / ↑↓←→ to move · <kbd className="bg-white/10 px-1 rounded">Space</kbd> / <kbd className="bg-white/10 px-1 rounded">E</kbd> to sit (near sofa)</span>
          </div>

          {/* Sofa proximity hint */}
          {(() => {
            const dx = personState.x - 0.5;
            const dz = personState.z - (-2.85);
            const nearSofa = Math.sqrt(dx*dx + dz*dz) < 0.9 && !personState.sitting;
            return nearSofa ? (
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-amber-500/80 text-white text-xs font-semibold animate-pulse">
                Press Space or E to sit on sofa
              </div>
            ) : null;
          })()}
        </div>

        {/* ══ SIDE PANEL ══ */}
        <div className="w-80 flex flex-col border-l border-white/[0.08] bg-black/40 backdrop-blur-sm overflow-y-auto">

          {/* Voice controller */}
          <div className="p-4 border-b border-white/[0.06]">
            <VoiceController onCommand={handleCommand} onSpeakingChange={setIsSpeaking} />
          </div>

          {/* Device toggles */}
          <div className="p-4 border-b border-white/[0.06] flex flex-col gap-3">
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">
              Manual Controls
            </p>
            <DeviceToggle
              icon="💡"
              label="Light"
              active={devices.light}
              color="#fbbf24"
              onToggle={() =>
                handleCommand({ type: devices.light ? "LIGHT_OFF" : "LIGHT_ON" })
              }
            />
            <DeviceToggle
              icon="🌀"
              label="Fan"
              active={devices.fan}
              color="#60a5fa"
              onToggle={() =>
                handleCommand({ type: devices.fan ? "FAN_OFF" : "FAN_ON" })
              }
            />
            <DeviceToggle
              icon="🚪"
              label="Door"
              active={devices.door}
              color="#34d399"
              onToggle={() =>
                handleCommand({ type: devices.door ? "DOOR_CLOSE" : "DOOR_OPEN" })
              }
            />
            <DeviceToggle
              icon="📺"
              label="TV"
              active={devices.tv}
              color="#a78bfa"
              onToggle={() =>
                handleCommand({ type: devices.tv ? "TV_OFF" : "TV_ON" })
              }
            />
          </div>

          {/* Command history */}
          <div className="p-4 flex-1">
            <CommandHistory entries={history} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Small reusable components ── */

function StatusPill({
  label,
  active,
  color,
  activeLabel = "ON",
  inactiveLabel = "OFF",
}: {
  label: string;
  active: boolean;
  color: string;
  activeLabel?: string;
  inactiveLabel?: string;
}) {
  return (
    <div
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border transition-all duration-300"
      style={{
        borderColor: active ? `${color}40` : "rgba(255,255,255,0.08)",
        background: active ? `${color}15` : "rgba(255,255,255,0.03)",
        color: active ? color : "#64748b",
      }}
    >
      <div
        className="w-1.5 h-1.5 rounded-full transition-all duration-300"
        style={{ backgroundColor: active ? color : "#475569" }}
      />
      {label}: {active ? activeLabel : inactiveLabel}
    </div>
  );
}

function DeviceToggle({
  icon,
  label,
  active,
  color,
  onToggle,
}: {
  icon: string;
  label: string;
  active: boolean;
  color: string;
  onToggle: () => void;
}) {
  return (
    <motion.button
      onClick={onToggle}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className="flex items-center justify-between w-full px-4 py-3 rounded-xl border transition-all duration-300 text-sm font-medium"
      style={{
        borderColor: active ? `${color}40` : "rgba(255,255,255,0.08)",
        background: active ? `${color}12` : "rgba(255,255,255,0.03)",
        color: active ? color : "#94a3b8",
        boxShadow: active ? `0 0 16px ${color}18` : "none",
      }}
    >
      <span className="flex items-center gap-2.5">
        <span className="text-lg">{icon}</span>
        {label}
      </span>
      {/* Toggle switch */}
      <div
        className="relative w-10 h-5 rounded-full transition-all duration-300"
        style={{ background: active ? color : "rgba(255,255,255,0.12)" }}
      >
        <motion.div
          className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow"
          animate={{ left: active ? "22px" : "2px" }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </div>
    </motion.button>
  );
}

export default App;
