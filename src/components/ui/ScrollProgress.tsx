import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useState } from "react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25, mass: 0.2 });
  const percentage = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const [percentDisplay, setPercentDisplay] = useState(0);

  useEffect(() => {
    return percentage.on("change", (latest) => {
      setPercentDisplay(Math.round(latest));
    });
  }, [percentage]);

  return (
    <>
      {/* Top Gradient Progress Bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed left-0 right-0 top-0 z-[100] h-[3px] origin-left bg-linear-to-r from-brand-green via-brand-cyan to-brand-blue shadow-[0_0_12px_var(--brand-cyan)]"
      />

      {/* Floating HUD Indicator (Bottom Left) */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="glass-strong fixed bottom-6 left-6 z-40 hidden items-center gap-2.5 rounded-full border border-white/10 px-3.5 py-1.5 font-mono text-xs text-muted-foreground shadow-lg backdrop-blur-md md:flex"
      >
        <span className="relative flex h-2 w-2 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-green opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-green" />
        </span>
        <span className="uppercase tracking-widest text-foreground/80 text-[10px]">Scroll</span>
        <span className="font-bold text-brand-green">{percentDisplay}%</span>
      </motion.div>
    </>
  );
}
