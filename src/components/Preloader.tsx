import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { EASE_EXPO, EASE } from "./shared";

export default function Preloader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    const t0 = performance.now();
    const dur = 2100;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 4);
      setCount(Math.round(eased * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setLeaving(true);
          document.documentElement.style.overflow = "";
          setTimeout(onDone, 450);
        }, 250);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      className={`fixed inset-0 z-[100] flex flex-col justify-between bg-coal px-6 py-8 text-cream sm:px-12 ${
        leaving ? "pointer-events-none" : ""
      }`}
      initial={{ y: 0 }}
      animate={{ y: leaving ? "-100%" : 0 }}
      transition={{ duration: 1, ease: EASE_EXPO }}
    >
      <motion.div
        animate={{ opacity: leaving ? 0 : 1 }}
        transition={{ duration: 0.35 }}
        className="flex h-full flex-col justify-between"
      >
        <div className="flex items-start justify-between">
          <div className="overflow-hidden">
            <motion.p
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
              className="font-display text-lg italic tracking-wide text-cream"
            >
              AURORA<span className="text-bronze">®</span>
            </motion.p>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="font-body text-[10px] font-semibold uppercase tracking-[0.3em] text-cream/50"
          >
            Estúdio Criativo
          </motion.p>
        </div>

        {/* center progress line */}
        <div className="flex flex-col items-center gap-6">
          <div className="h-px w-full max-w-md overflow-hidden bg-cream/15">
            <motion.div
              className="h-full bg-bronze"
              style={{ width: `${count}%` }}
              transition={{ ease: "linear" }}
            />
          </div>
          <p className="font-body text-[10px] font-medium uppercase tracking-[0.4em] text-cream/40">
            Preparando a experiência
          </p>
        </div>

        <div className="flex items-end justify-between">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="max-w-[180px] font-body text-[10px] leading-relaxed tracking-[0.15em] text-cream/40 uppercase"
          >
            Direção de arte — Identidade — Digital
          </motion.p>
          <div className="overflow-hidden">
            <motion.p
              initial={{ y: "60%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
              className="font-display text-[22vw] leading-[0.85] font-light tracking-tight text-cream tabular-nums sm:text-[13vw]"
            >
              {count}
              <span className="text-bronze italic">%</span>
            </motion.p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
