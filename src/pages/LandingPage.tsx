import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ParticleField } from "../components/landing/ParticleField";
import { FloatingDeviceCard } from "../components/landing/FloatingDeviceCard";
import { FeatureSection } from "../components/landing/FeatureSection";
import { HouseModel } from "../components/landing/HouseModel";

export function LandingPage() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  // Parallax transforms tied to scroll
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const smoothHeroY = useSpring(heroY, { stiffness: 80, damping: 20 });

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-x-hidden bg-[#080812] text-slate-100"
    >
      {/* ── Particle background ── */}
      <ParticleField />

      {/* ── Ambient gradient blobs ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(96,165,250,0.08) 0%, transparent 70%)",
          }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(251,191,36,0.07) 0%, transparent 70%)",
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/3 w-[400px] h-[400px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(52,211,153,0.07) 0%, transparent 70%)",
          }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
        />
      </div>

      {/* ════════════════════════════════════════════
          HERO SECTION
      ════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-16 pb-24">
        <motion.div
          style={{ y: smoothHeroY, opacity: heroOpacity }}
          className="flex flex-col items-center text-center gap-6 max-w-4xl"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-400/30 bg-blue-400/10 text-blue-300 text-sm font-medium"
          >
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Voice-Powered Smart Home
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold leading-tight"
          >
            Control Your Home
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
              With Your Voice
            </span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-xl"
          >
            A futuristic, browser-native smart home dashboard — no servers, no
            apps, just your voice.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mt-2"
          >
            <motion.button
              onClick={() => navigate("/dashboard")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-base shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-shadow"
            >
              🏠 Enter Dashboard
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() =>
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-8 py-4 rounded-2xl border border-white/20 bg-white/[0.05] text-slate-300 font-semibold text-base hover:bg-white/[0.08] transition-colors"
            >
              Learn More ↓
            </motion.button>
          </motion.div>
        </motion.div>

        {/* 3D House model */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.4 }}
          className="mt-16 w-full max-w-2xl"
        >
          <HouseModel />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 text-xs"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-5 h-8 rounded-full border border-slate-600 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-1.5 rounded-full bg-slate-400" />
          </motion.div>
          Scroll to explore
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════
          FLOATING DEVICE CARDS
      ════════════════════════════════════════════ */}
      <section className="relative py-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Three Devices.{" "}
            <span className="text-blue-400">One Voice.</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Control your light, fan, and door without lifting a finger. Just
            speak naturally.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <FloatingDeviceCard
            icon="💡"
            title="Smart Light"
            description="Say &quot;turn on light&quot; or &quot;switch off light&quot; — 3 natural phrases supported."
            accentColor="#fbbf24"
            glowColor="rgba(251,191,36,0.15)"
            delay={0}
            commands={["turn on light", "light off", "switch on light"]}
          />
          <FloatingDeviceCard
            icon="🌀"
            title="Smart Fan"
            description="Say &quot;fan on&quot; or &quot;fan stop&quot; — the fan spins up and slows down with animation."
            accentColor="#60a5fa"
            glowColor="rgba(96,165,250,0.15)"
            delay={0.1}
            commands={["fan on", "turn on fan", "fan stop"]}
          />
          <FloatingDeviceCard
            icon="🚪"
            title="Smart Door"
            description="Say &quot;open door&quot; or &quot;lock door&quot; — watch it swing open in 3D."
            accentColor="#34d399"
            glowColor="rgba(52,211,153,0.15)"
            delay={0.2}
            commands={["open door", "unlock door", "door close"]}
          />
        </div>
      </section>

      {/* ════════════════════════════════════════════
          FEATURES
      ════════════════════════════════════════════ */}
      <FeatureSection />

      {/* ════════════════════════════════════════════
          FINAL CTA
      ════════════════════════════════════════════ */}
      <section className="relative py-32 px-4 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to take{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              control?
            </span>
          </h2>
          <p className="text-slate-400 text-lg mb-10">
            No installation. No account. Just open Chrome or Edge and start
            speaking.
          </p>
          <motion.button
            onClick={() => navigate("/dashboard")}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.97 }}
            className="px-10 py-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-bold text-lg shadow-2xl shadow-emerald-500/20 hover:shadow-emerald-500/35 transition-shadow"
          >
            🎤 Launch Dashboard
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
}
