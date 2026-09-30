import { useMemo, useRef } from "react";
import { motion, useInView, useScroll, useTransform, type MotionValue } from "framer-motion";
import { FadeIn, Overline } from "./shared";

const TEXT =
  "Criamos marcas e experiências que respiram elegância — onde cada detalhe é intencional, cada movimento tem propósito e cada pixel carrega alma.";

const ACCENTS = new Set(["elegância", "intencional,", "propósito", "alma."]);

function Word({
  progress,
  range,
  accent,
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  accent: boolean;
  children: string;
}) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const y = useTransform(progress, range, [8, 0]);
  return (
    <motion.span
      style={{ opacity, y }}
      className={`inline-block will-change-transform ${
        accent ? "font-display italic text-bronze" : ""
      }`}
    >
      {children}&nbsp;
    </motion.span>
  );
}

function RevealText() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });
  const words = TEXT.split(" ");
  return (
    <p
      ref={ref}
      className="max-w-5xl font-display text-[clamp(1.7rem,4.2vw,3.6rem)] leading-[1.25] font-light tracking-tight text-ink"
    >
      {words.map((word, i) => (
        <Word
          key={i}
          progress={scrollYProgress}
          range={[i / words.length, (i + 1) / words.length]}
          accent={ACCENTS.has(word)}
        >
          {word}
        </Word>
      ))}
    </p>
  );
}

function FloatingImage() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [90, -70]);
  const rotate = useTransform(scrollYProgress, [0, 1], [4, -3]);

  return (
    <motion.div
      ref={ref}
      style={{ y, rotate }}
      className="relative mx-auto w-72 max-w-full shrink-0 overflow-hidden rounded-[4px] shadow-[0_40px_80px_-30px_rgba(23,19,16,0.45)] sm:w-80 lg:mx-0 lg:w-[26rem]"
    >
      <img
        src="/images/about.jpg"
        alt="Ateliê criativo banhado por luz natural"
        className="aspect-[4/5] w-full object-cover"
      />
      <div className="absolute bottom-3 left-3 bg-cream/90 px-3 py-1.5 backdrop-blur-sm">
        <span className="font-body text-[9px] font-semibold uppercase tracking-[0.25em] text-ink">
          Ateliê — 2026
        </span>
      </div>
    </motion.div>
  );
}

/* ---------------- odometer / slot-machine counter ---------------- */

const SPINS = 3; // voltas completas antes de acertar o dígito
const ROLL_EASE = [0.19, 1, 0.22, 1] as const;

function DigitColumn({
  digit,
  active,
  delay,
  duration,
}: {
  digit: number;
  active: boolean;
  delay: number;
  duration: number;
}) {
  // coluna: 0–9 repetido (voltas) + sequência final até o dígito certo
  const slots = useMemo(() => {
    const arr: number[] = [];
    for (let r = 0; r < SPINS; r++) for (let n = 0; n < 10; n++) arr.push(n);
    for (let n = 0; n <= digit; n++) arr.push(n);
    return arr;
  }, [digit]);

  const finalY = `-${((slots.length - 1) / slots.length) * 100}%`;

  return (
    <span className="inline-block h-[1em] overflow-hidden leading-[1em]">
      <motion.span
        className="flex flex-col leading-[1em] will-change-transform"
        initial={{ y: "0%" }}
        animate={active ? { y: finalY } : {}}
        transition={{ duration, ease: ROLL_EASE, delay }}
      >
        {slots.map((n, i) => (
          <span key={i} className="h-[1em] text-center leading-[1em] tabular-nums">
            {n}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

function StatItem({
  value,
  suffix,
  label,
  index,
}: {
  value: number;
  suffix: string;
  label: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px -15% 0px" });
  const digits = useMemo(() => String(value).split("").map(Number), [value]);

  const BASE = 2.0; // duração do primeiro dígito (contemplativa)
  const STEP = 0.38; // dígitos à direita giram por mais tempo
  const stagger = index * 0.18;
  const landTime = stagger + BASE + (digits.length - 1) * STEP;

  return (
    <div ref={ref} className="flex flex-col gap-2">
      <span className="flex items-start font-display text-5xl font-light text-ink sm:text-6xl">
        {digits.map((d, i) => (
          <DigitColumn
            key={i}
            digit={d}
            active={inView}
            delay={stagger}
            duration={BASE + i * STEP}
          />
        ))}
        <motion.span
          className="inline-block"
          initial={{ opacity: 0, y: "0.4em", scale: 0.5 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.55, ease: ROLL_EASE, delay: landTime + 0.08 }}
        >
          {suffix}
          <span className="text-bronze">.</span>
        </motion.span>
      </span>
      <FadeIn delay={index * 0.12}>
        <span className="font-body text-[10px] font-semibold uppercase tracking-[0.3em] text-ink/60">
          {label}
        </span>
      </FadeIn>
    </div>
  );
}

const STATS = [
  { value: 10, suffix: "", label: "Anos de estúdio" },
  { value: 120, suffix: "+", label: "Projetos entregues" },
  { value: 14, suffix: "", label: "Prêmios internacionais" },
];

export default function Manifesto() {
  return (
    <section id="manifesto" className="relative overflow-clip px-6 py-32 sm:px-12 sm:py-44">
      <div className="mb-14">
        <Overline index="01" label="Manifesto" />
      </div>

      <div className="flex flex-col gap-16 lg:flex-row lg:items-start lg:gap-24">
        <div className="flex-1">
          <RevealText />
        </div>
        <div className="hidden self-center lg:block">
          <FloatingImage />
        </div>
      </div>

      <div className="mt-20 lg:hidden">
        <FloatingImage />
      </div>

      <div className="mt-24 grid grid-cols-1 gap-10 border-t border-ink/10 pt-12 sm:grid-cols-3">
        {STATS.map((s, i) => (
          <StatItem key={s.label} value={s.value} suffix={s.suffix} label={s.label} index={i} />
        ))}
      </div>
    </section>
  );
}
