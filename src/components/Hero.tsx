import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { EASE } from "./shared";

const TITLE = "AURORA".split("");

const titleVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
};

const letterVariants = {
  hidden: { y: "115%", rotate: 5 },
  show: {
    y: "0%",
    rotate: 0,
    transition: { duration: 1.2, ease: EASE },
  },
};

function RotatingBadge() {
  return (
    <div className="relative flex h-24 w-24 items-center justify-center text-ink sm:h-28 sm:w-28">
      <svg viewBox="0 0 100 100" className="animate-rotate-slow absolute inset-0 h-full w-full">
        <defs>
          <path id="circlePath" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <text className="fill-current font-body text-[7.5px] font-semibold uppercase">
          <textPath href="#circlePath">aurora · estúdio criativo · desde 2016 ·</textPath>
        </text>
      </svg>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 0c.7 6.6 5.4 11.3 12 12-6.6.7-11.3 5.4-12 12-.7-6.6-5.4-11.3-12-12C6.6 11.3 11.3 6.6 12 0Z" />
      </svg>
    </div>
  );
}

export default function Hero({ started }: { started: boolean }) {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  /* ---------- SCROLL-DRIVEN CHOREOGRAPHY ---------- */

  // image frame grows from a floating card to full-bleed
  const clipPath = useTransform(
    scrollYProgress,
    [0.08, 0.72],
    [
      "inset(11% 15% 11% 15% round 24px)",
      "inset(0% 0% 0% 0% round 0px)",
    ]
  );
  const imgScale = useTransform(scrollYProgress, [0, 0.9], [1.22, 1]);
  const imgY = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);
  const frameRadius = useTransform(scrollYProgress, [0.08, 0.72], [24, 0]);

  // title lifts, breathes and dissolves
  const titleY = useTransform(scrollYProgress, [0, 0.55], ["0vh", "-68vh"]);
  const titleOpacity = useTransform(scrollYProgress, [0.05, 0.38], [1, 0]);
  const titleTracking = useTransform(scrollYProgress, [0, 0.5], ["-0.02em", "0.22em"]);
  const subOpacity = useTransform(scrollYProgress, [0.02, 0.16], [1, 0]);
  const subY = useTransform(scrollYProgress, [0, 0.2], ["0vh", "-12vh"]);

  // footer meta of the hero fades first
  const metaOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  // caption inside the expanded image
  const captionOpacity = useTransform(scrollYProgress, [0.5, 0.72], [0, 1]);
  const captionY = useTransform(scrollYProgress, [0.5, 0.72], [28, 0]);

  /* ---------- MOUSE PARALLAX ---------- */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const frameMX = useSpring(mx, { stiffness: 60, damping: 20 });
  const frameMY = useSpring(my, { stiffness: 60, damping: 20 });

  const handleMouse = (e: React.MouseEvent) => {
    const { innerWidth, innerHeight } = window;
    mx.set(((e.clientX / innerWidth) - 0.5) * 16);
    my.set(((e.clientY / innerHeight) - 0.5) * 12);
  };

  return (
    <section ref={ref} id="topo" className="relative h-[210vh]">
      <div
        className="sticky top-0 flex h-svh items-center justify-center overflow-hidden"
        onMouseMove={handleMouse}
      >
        {/* expanding image frame */}
        <motion.div
          className="absolute inset-0 z-10 will-change-[clip-path]"
          style={{ clipPath, borderRadius: frameRadius, x: frameMX, y: frameMY }}
        >
          <motion.div
            className="absolute inset-0 will-change-transform"
            style={{ y: imgY, scale: imgScale, top: "-8%", height: "116%" }}
          >
            <motion.img
              src="/images/hero.jpg"
              alt="Interior arquitetônico banhado por luz dourada"
              className="h-full w-full object-cover"
              initial={{ scale: 1.28, filter: "brightness(1.12)" }}
              animate={started ? { scale: 1, filter: "brightness(1)" } : {}}
              transition={{ duration: 2.2, ease: EASE, delay: 0.1 }}
            />
          </motion.div>
          {/* soft vignette for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent" />

          {/* caption that appears once the frame is full-bleed */}
          <motion.div
            style={{ opacity: captionOpacity, y: captionY }}
            className="absolute bottom-10 left-6 z-20 sm:left-12"
          >
            <p className="font-body text-[10px] font-semibold uppercase tracking-[0.3em] text-cream/70">
              ( Projeto em destaque )
            </p>
            <p className="mt-2 font-display text-2xl italic text-cream sm:text-3xl">
              Casa Vetro — Interiores, 2026
            </p>
          </motion.div>
        </motion.div>

        {/* title layer — difference blend keeps it legible over anything */}
        <motion.div
          className="pointer-events-none relative z-20 flex flex-col items-center mix-blend-difference"
          style={{ y: titleY, opacity: titleOpacity }}
        >
          <motion.h1
            variants={titleVariants}
            initial="hidden"
            animate={started ? "show" : "hidden"}
            style={{ letterSpacing: titleTracking }}
            className="flex font-display text-[clamp(4.2rem,17.5vw,17rem)] leading-[0.95] font-light text-cream"
          >
            {TITLE.map((letter, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.06em]">
                <motion.span
                  variants={letterVariants}
                  className="inline-block will-change-transform"
                >
                  {letter}
                </motion.span>
              </span>
            ))}
          </motion.h1>
        </motion.div>

        {/* subline */}
        <motion.div
          style={{ opacity: subOpacity, y: subY }}
          className="pointer-events-none absolute inset-x-0 bottom-[24%] z-20 flex flex-col items-center gap-3 mix-blend-difference"
        >
          <motion.p
            initial={{ opacity: 0, y: 26 }}
            animate={started ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.1, ease: EASE, delay: 1.05 }}
            className="px-6 text-center font-body text-[11px] font-semibold uppercase tracking-[0.26em] text-cream sm:tracking-[0.45em]"
          >
            Estúdio criativo & direção de arte
          </motion.p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={started ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, ease: EASE, delay: 1.25 }}
            className="h-px w-24 bg-cream/60"
          />
        </motion.div>

        {/* bottom meta + scroll cue */}
        <motion.div
          style={{ opacity: metaOpacity }}
          className="absolute inset-x-0 bottom-0 z-20 flex items-end justify-between px-6 pb-8 sm:px-12"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={started ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: EASE, delay: 1.45 }}
            className="flex flex-col gap-1 font-body text-[10px] font-medium uppercase tracking-[0.3em] text-cream/70 mix-blend-difference"
          >
            <span>São Paulo — 23°33′S 46°38′W</span>
            <span>Estúdio independente</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={started ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 1.6 }}
            className="absolute left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
          >
            <span className="font-body text-[9px] font-semibold uppercase tracking-[0.4em] text-cream/60 mix-blend-difference">
              Role para explorar
            </span>
            <div className="h-14 w-px overflow-hidden bg-cream/25 mix-blend-difference">
              <div className="animate-scroll-line h-full w-full bg-cream/80" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={started ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, ease: EASE, delay: 1.55 }}
          >
            <RotatingBadge />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
