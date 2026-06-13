import { useState } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

/**
 * A CSS 3D smart house model with hover-driven rotation and glowing windows.
 */
export function HouseModel() {
  const [hovered, setHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), {
    stiffness: 120,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-18, 18]), {
    stiffness: 120,
    damping: 20,
  });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(nx);
    mouseY.set(ny);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
    setHovered(false);
  }

  return (
    <div
      className="flex items-center justify-center w-full select-none"
      style={{ perspective: 1200 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setHovered(true)}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        animate={{ rotateY: hovered ? undefined : [0, 8, -8, 0] }}
        transition={
          hovered
            ? undefined
            : { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }
        className="relative"
      >
        {/* ── House card ── */}
        <div
          className="relative w-[340px] md:w-[480px] rounded-3xl overflow-hidden border border-white/10"
          style={{
            background:
              "linear-gradient(135deg, rgba(15,15,40,0.95) 0%, rgba(20,20,60,0.9) 100%)",
            boxShadow:
              "0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(96,165,250,0.08)",
          }}
        >
          {/* Top glow bar */}
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500" />

          <div className="p-6 md:p-10">
            {/* Roof SVG */}
            <svg viewBox="0 0 300 100" className="w-full mb-0">
              <defs>
                <linearGradient id="roofGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#334155" />
                  <stop offset="100%" stopColor="#1e293b" />
                </linearGradient>
              </defs>
              {/* Main roof */}
              <polygon
                points="150,8 290,95 10,95"
                fill="url(#roofGrad)"
                stroke="rgba(148,163,184,0.2)"
                strokeWidth="1"
              />
              {/* Chimney */}
              <rect x="210" y="30" width="20" height="40" fill="#1e293b" stroke="rgba(148,163,184,0.15)" strokeWidth="1" />
              {/* Chimney smoke particles */}
              <motion.circle cx="220" cy="22" r="3" fill="rgba(148,163,184,0.3)"
                animate={{ cy: [22, 10, 22], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
              <motion.circle cx="226" cy="18" r="2" fill="rgba(148,163,184,0.2)"
                animate={{ cy: [18, 6, 18], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} />
            </svg>

            {/* House walls */}
            <div
              className="relative w-full rounded-b-xl overflow-hidden"
              style={{
                background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
                border: "1px solid rgba(148,163,184,0.15)",
                borderTop: "none",
                minHeight: 160,
              }}
            >
              {/* Windows row */}
              <div className="flex justify-around px-6 pt-5 pb-2">
                <Window color="#fbbf24" label="💡" active />
                <Window color="#60a5fa" label="🌀" active={false} />
                <Window color="#34d399" label="🌿" active />
              </div>

              {/* Door */}
              <div className="flex justify-center pb-0">
                <motion.div
                  className="relative w-14 h-20 rounded-t-xl border border-white/20 flex items-end justify-center pb-2"
                  style={{
                    background:
                      "linear-gradient(180deg, #1d4ed8 0%, #1e3a8a 100%)",
                    boxShadow: "0 0 20px rgba(59,130,246,0.3)",
                    transformOrigin: "left center",
                    transformStyle: "preserve-3d",
                  }}
                  animate={{ rotateY: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                >
                  {/* Door knob */}
                  <div className="w-2 h-2 rounded-full bg-amber-400 absolute right-2 top-1/2" />
                  <span className="text-xs text-blue-200 opacity-60">🚪</span>
                </motion.div>
              </div>

              {/* Ground line */}
              <div className="h-3 bg-gradient-to-r from-transparent via-slate-700/40 to-transparent" />

              {/* Status bar */}
              <div className="flex items-center justify-center gap-4 py-2 border-t border-white/5">
                <StatusDot color="#fbbf24" label="Light ON" />
                <StatusDot color="#60a5fa" label="Fan OFF" active={false} />
                <StatusDot color="#34d399" label="Door closed" active={false} />
              </div>
            </div>
          </div>

          {/* Corner label */}
          <div className="absolute top-4 right-4 text-xs text-slate-500 font-mono">
            SMART HOME v1.0
          </div>
        </div>

        {/* ── 3D shadow layer ── */}
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            transform: "translateZ(-30px) translateY(20px) scale(0.95)",
            background: "rgba(96,165,250,0.05)",
            filter: "blur(20px)",
          }}
        />
      </motion.div>
    </div>
  );
}

function Window({
  color,
  label,
  active = true,
}: {
  color: string;
  label: string;
  active?: boolean;
}) {
  return (
    <motion.div
      className="w-14 h-14 rounded-xl border flex flex-col items-center justify-center gap-1 text-xl"
      style={{
        borderColor: active ? `${color}40` : "rgba(148,163,184,0.15)",
        background: active
          ? `${color}18`
          : "rgba(30,41,59,0.6)",
        boxShadow: active ? `0 0 16px ${color}30` : "none",
      }}
      animate={
        active
          ? { boxShadow: [`0 0 10px ${color}20`, `0 0 22px ${color}40`, `0 0 10px ${color}20`] }
          : {}
      }
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <span style={{ filter: active ? `drop-shadow(0 0 4px ${color})` : "none" }}>
        {label}
      </span>
    </motion.div>
  );
}

function StatusDot({
  color,
  label,
  active = true,
}: {
  color: string;
  label: string;
  active?: boolean;
}) {
  return (
    <div className="flex items-center gap-1">
      <div
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: active ? color : "#475569" }}
      />
      <span className="text-[10px] text-slate-500">{label}</span>
    </div>
  );
}
