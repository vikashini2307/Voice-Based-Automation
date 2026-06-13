import { motion } from "framer-motion";

const features = [
  {
    icon: "🎤",
    title: "100% Voice Driven",
    description:
      "No buttons required. Speak naturally — 18 built-in command synonyms across 3 devices.",
    color: "#f87171",
  },
  {
    icon: "⚡",
    title: "Zero Backend",
    description:
      "Everything runs in your browser. No servers, no accounts, no cloud. Just pure client-side magic.",
    color: "#fbbf24",
  },
  {
    icon: "🎨",
    title: "Glassmorphism UI",
    description:
      "Frosted-glass cards, dark mode, and smooth Framer Motion animations at every interaction.",
    color: "#a78bfa",
  },
  {
    icon: "📱",
    title: "Fully Responsive",
    description:
      "Works seamlessly from 320px mobile to wide desktop. Every touch target is at least 44×44px.",
    color: "#34d399",
  },
  {
    icon: "🔊",
    title: "Voice Feedback",
    description:
      "The browser speaks back to you — confirming every command with natural speech synthesis.",
    color: "#60a5fa",
  },
  {
    icon: "📜",
    title: "Command History",
    description:
      "Every utterance is logged with timestamps. Matched commands and unrecognized ones alike.",
    color: "#fb923c",
  },
];

export function FeatureSection() {
  return (
    <section id="features" className="relative py-24 px-4">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <span className="inline-block px-4 py-1.5 rounded-full border border-purple-400/30 bg-purple-400/10 text-purple-300 text-sm font-medium mb-4">
          Why Voice Home?
        </span>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Built for the{" "}
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            future
          </span>
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto">
          Everything you need to control your smart home, running entirely in your
          browser.
        </p>
      </motion.div>

      {/* Feature grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.07 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="rounded-2xl p-6 border border-white/[0.08] flex flex-col gap-3 cursor-default group"
            style={{
              background:
                "linear-gradient(135deg, rgba(15,15,35,0.8) 0%, rgba(20,20,50,0.7) 100%)",
            }}
          >
            {/* Icon */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{
                background: `${f.color}15`,
                border: `1px solid ${f.color}30`,
              }}
            >
              {f.icon}
            </div>

            {/* Title */}
            <h3 className="font-bold text-slate-100 text-lg group-hover:text-white transition-colors">
              {f.title}
            </h3>

            {/* Description */}
            <p className="text-slate-400 text-sm leading-relaxed">
              {f.description}
            </p>

            {/* Bottom accent */}
            <div
              className="h-px w-0 group-hover:w-full rounded-full transition-all duration-500"
              style={{ backgroundColor: f.color, opacity: 0.5 }}
            />
          </motion.div>
        ))}
      </div>

      {/* Browser compatibility note */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="mt-12 flex items-center justify-center gap-3 text-sm text-slate-500"
      >
        <span className="flex items-center gap-1.5">
          <span className="text-base">🌐</span> Best in Chrome or Edge
        </span>
        <span className="w-1 h-1 rounded-full bg-slate-600" />
        <span className="flex items-center gap-1.5">
          <span className="text-base">🔒</span> No data leaves your device
        </span>
        <span className="w-1 h-1 rounded-full bg-slate-600" />
        <span className="flex items-center gap-1.5">
          <span className="text-base">⚡</span> Instant, no install
        </span>
      </motion.div>
    </section>
  );
}
