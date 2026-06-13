import { useState } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

interface FloatingDeviceCardProps {
  icon: string;
  title: string;
  description: string;
  accentColor: string;
  glowColor: string;
  delay: number;
  commands: string[];
}

export function FloatingDeviceCard({
  icon,
  title,
  description,
  accentColor,
  glowColor,
  delay,
  commands,
}: FloatingDeviceCardProps) {
  const [hovered, setHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), {
    stiffness: 150,
    damping: 25,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-14, 14]), {
    stiffness: 150,
    damping: 25,
  });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
    setHovered(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      style={{ perspective: 800 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setHovered(true)}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          background: `linear-gradient(135deg, rgba(15,15,35,0.9) 0%, rgba(20,20,50,0.85) 100%)`,
          boxShadow: hovered
            ? `0 30px 60px rgba(0,0,0,0.5), 0 0 40px ${glowColor}`
            : `0 8px 32px rgba(0,0,0,0.4)`,
          transition: "box-shadow 0.3s ease",
        }}
        animate={
          !hovered
            ? { y: [0, -8, 0] }
            : { y: 0 }
        }
        transition={
          !hovered
            ? { duration: 3 + delay * 2, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.2 }
        }
        className="rounded-2xl p-6 border border-white/10 flex flex-col gap-4 cursor-default"
      >
        {/* Top accent line */}
        <div
          className="h-0.5 w-full rounded-full"
          style={{ backgroundColor: accentColor, opacity: 0.6 }}
        />

        {/* Icon */}
        <motion.div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
          style={{
            background: glowColor,
            border: `1px solid ${accentColor}30`,
          }}
          animate={
            hovered
              ? {
                  filter: [
                    `drop-shadow(0 0 6px ${accentColor})`,
                    `drop-shadow(0 0 14px ${accentColor})`,
                    `drop-shadow(0 0 6px ${accentColor})`,
                  ],
                }
              : { filter: "none" }
          }
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          {icon}
        </motion.div>

        {/* Title */}
        <h3
          className="text-xl font-bold"
          style={{ color: accentColor }}
        >
          {title}
        </h3>

        {/* Description */}
        <p className="text-slate-400 text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: description }}
        />

        {/* Command pills */}
        <div className="flex flex-wrap gap-2 mt-1">
          {commands.map((cmd) => (
            <span
              key={cmd}
              className="text-xs px-2.5 py-1 rounded-full border font-mono"
              style={{
                borderColor: `${accentColor}30`,
                color: accentColor,
                background: `${accentColor}10`,
              }}
            >
              &ldquo;{cmd}&rdquo;
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
