import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { FadeIn, MaskReveal, Overline } from "./shared";
import { scrollToY, scrollTo } from "../App";

type Service = {
  n: string;
  title: string;
  desc: string;
  tags: string[];
  img: string;
  imgAlt: string;
};

const SERVICES: Service[] = [
  {
    n: "01",
    title: "Direção de Arte",
    desc: "Conceitos criativos, curadoria visual e narrativa estética para campanhas e editoriais que permanecem na memória.",
    tags: ["Conceito criativo", "Curadoria visual", "Narrativa estética"],
    img: "/images/work-1.jpg",
    imgAlt: "Editorial de moda — direção de arte",
  },
  {
    n: "02",
    title: "Identidade Visual",
    desc: "Sistemas de marca com caráter, sensibilidade e longevidade — do símbolo à tipografia, cada detalhe com intenção.",
    tags: ["Logotipo & símbolo", "Sistema tipográfico", "Brand guidelines"],
    img: "/images/work-2.jpg",
    imgAlt: "Still de perfume — identidade visual",
  },
  {
    n: "03",
    title: "Design Digital",
    desc: "Sites e experiências que unem beleza, movimento e função — interfaces que respiram e interações que encantam.",
    tags: ["Websites imersivos", "Motion & interação", "E-commerce"],
    img: "/images/service-digital.jpg",
    imgAlt: "Interface digital em laptop — design digital",
  },
  {
    n: "04",
    title: "Fotografia & Filme",
    desc: "Imagens que traduzem a essência das marcas em luz, textura e movimento — do still editorial ao filme de marca.",
    tags: ["Stills editoriais", "Filmes de marca", "Direção de set"],
    img: "/images/service-filme.jpg",
    imgAlt: "Câmera analógica — fotografia e filme",
  },
];

const N = SERVICES.length;
const STEP = 0.09;
const INSET_0 = "inset(0% 0% 0% 0% round 0px)";
const INSET_100 = "inset(100% 0% 0% 0% round 0px)";

const seg = (i: number) => [i / N, (i + 1) / N] as const;

/* ---------------- rolling stepped counter: 01 → 04 ---------------- */

function RollingCounter({ progress }: { progress: MotionValue<number> }) {
  const points: number[] = [0];
  const shifts: string[] = ["0%"];
  for (let k = 1; k < N; k++) {
    points.push(k / N, k / N + 0.07);
    shifts.push(`-${((k - 1) * 100) / N}%`, `-${(k * 100) / N}%`);
  }
  points.push(1);
  shifts.push(`-${((N - 1) * 100) / N}%`);

  const y = useTransform(progress, points, shifts);

  return (
    <div className="flex items-baseline gap-3 font-body font-semibold tracking-[0.2em]">
      <div className="h-[1.1em] overflow-hidden text-[15px] leading-[1.1em] text-bronze sm:text-[17px]">
        <motion.div style={{ y }} className="flex flex-col will-change-transform">
          {SERVICES.map((s) => (
            <span key={s.n} className="block h-[1.1em] leading-[1.1em]">
              {s.n}
            </span>
          ))}
        </motion.div>
      </div>
      <span className="text-[13px] text-cream/35 sm:text-[15px]">/ 04</span>
    </div>
  );
}

/* ---------------- per-service masked tag ---------------- */

function MaskedTag({
  progress,
  range,
  children,
}: {
  progress: MotionValue<number>;
  range: readonly [number, number];
  children: string;
}) {
  const y = useTransform(progress, [range[0], range[1]], ["140%", "0%"]);
  return (
    <span className="block overflow-hidden">
      <motion.span
        style={{ y }}
        className="flex items-center gap-2.5 font-body text-[10px] font-semibold uppercase tracking-[0.3em] text-cream/55 will-change-transform"
      >
        <span className="text-bronze">+</span>
        {children}
      </motion.span>
    </span>
  );
}

/* ---------------- full text panel for one service ---------------- */

function ServicePanel({
  progress,
  i,
  s,
}: {
  progress: MotionValue<number>;
  i: number;
  s: Service;
}) {
  const [a, b] = seg(i);
  const isLast = i === N - 1;

  // title — slides in through a mask, holds, slides out upward
  const titlePts = isLast ? [a, a + STEP] : [a, a + STEP, b - STEP, b];
  const titleVals = isLast ? ["110%", "0%"] : ["110%", "0%", "0%", "-110%"];
  const titleY = useTransform(progress, titlePts, titleVals);

  // description / tags / cta — gentle fade & float
  const bodyPts = isLast
    ? [a + 0.02, a + STEP + 0.04]
    : [a + 0.02, a + STEP + 0.04, b - STEP - 0.015, b];
  const bodyOpacity = useTransform(progress, bodyPts, isLast ? [0, 1] : [0, 1, 1, 0]);
  const bodyY = useTransform(progress, bodyPts, isLast ? [36, 0] : [36, 0, 0, -36]);

  return (
    <div className="absolute inset-x-0 top-0">
      <h3 className="overflow-hidden font-display text-[clamp(2.1rem,6.2vw,5.6rem)] leading-[1.06] font-light tracking-tight text-cream">
        <motion.span style={{ y: titleY }} className="block italic will-change-transform">
          {s.title}
        </motion.span>
      </h3>

      <motion.div
        style={{ opacity: bodyOpacity, y: bodyY }}
        className="mt-5 flex max-w-md flex-col gap-5 will-change-transform sm:mt-7 sm:gap-6"
      >
        <p className="font-body text-sm leading-relaxed text-cream/60 sm:text-[15px]">{s.desc}</p>
        <div className="flex flex-col gap-2">
          {s.tags.map((tag, t) => (
            <MaskedTag
              key={tag}
              progress={progress}
              range={[a + 0.035 + t * 0.015, a + STEP + 0.05 + t * 0.015]}
            >
              {tag}
            </MaskedTag>
          ))}
        </div>
        <button
          data-hover
          onClick={() => scrollTo("#projetos")}
          className="group mt-1 flex w-fit items-center gap-2.5 font-body text-[10px] font-semibold uppercase tracking-[0.3em] text-cream/70 transition-colors hover:text-cream"
        >
          <span className="relative">
            Explorar projetos
            <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-bronze transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:origin-left group-hover:scale-x-100" />
          </span>
          <ArrowUpRight className="h-3.5 w-3.5 text-bronze transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </motion.div>
    </div>
  );
}

/* ---------------- stacked images revealed through clip-path ---------------- */

function Slide({
  progress,
  i,
  s,
}: {
  progress: MotionValue<number>;
  i: number;
  s: Service;
}) {
  const [a] = seg(i);
  const first = i === 0;

  const clipPath = useTransform(
    progress,
    first ? [0, 1] : [a, a + STEP],
    first ? [INSET_0, INSET_0] : [INSET_100, INSET_0]
  );
  const scale = useTransform(
    progress,
    first ? [0, a + STEP + 0.06] : [a, a + STEP],
    first ? [1.16, 1] : [1.18, 1]
  );

  return (
    <motion.div style={{ clipPath, zIndex: i }} className="absolute inset-0 will-change-[clip-path]">
      <motion.img
        src={s.img}
        alt={s.imgAlt}
        style={{ scale }}
        className="h-full w-full object-cover will-change-transform"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-coal/25 via-transparent to-transparent" />
    </motion.div>
  );
}

function ImageDeck({ progress }: { progress: MotionValue<number> }) {
  const drift = useTransform(progress, [0, 1], ["-4%", "4%"]);
  return (
    <div className="relative h-[28vh] w-full overflow-hidden rounded-[4px] sm:h-[32vh] lg:aspect-[3/4] lg:h-auto lg:max-h-[72vh]">
      <motion.div style={{ y: drift }} className="absolute inset-x-0 top-[-6%] h-[112%]">
        {SERVICES.map((s, i) => (
          <Slide key={s.n} progress={progress} i={i} s={s} />
        ))}
      </motion.div>
      {/* frame line */}
      <div className="pointer-events-none absolute inset-0 rounded-[4px] border border-cream/10" />
    </div>
  );
}

/* ---------------- chapter navigation with per-segment progress ---------------- */

function Chapter({
  progress,
  i,
  s,
  onClick,
}: {
  progress: MotionValue<number>;
  i: number;
  s: Service;
  onClick: () => void;
}) {
  const [a, b] = seg(i);
  const fill = useTransform(progress, [a, b], [0, 1]);
  const activeRaw = useTransform(progress, (v: number): number =>
    v >= a && (i === N - 1 ? v <= 1 : v < b) ? 1 : 0.32
  );
  const opacity = useSpring(activeRaw, { stiffness: 260, damping: 34 });

  return (
    <button
      data-hover
      onClick={onClick}
      className="flex flex-1 flex-col gap-2.5 text-left"
      aria-label={`Ir para ${s.title}`}
    >
      <motion.span
        style={{ opacity }}
        className="flex items-baseline gap-2 font-body text-[9px] font-semibold tracking-[0.25em] text-cream uppercase sm:text-[10px]"
      >
        <span className="text-bronze">{s.n}</span>
        <span className="hidden lg:inline">{s.title}</span>
      </motion.span>
      <span className="relative h-px w-full overflow-hidden bg-cream/15">
        <motion.span
          style={{ scaleX: fill }}
          className="absolute inset-0 origin-left bg-bronze"
        />
      </span>
    </button>
  );
}

/* ---------------- section ---------------- */

export default function Services() {
  const pinRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ["start start", "end end"],
  });

  const hintOpacity = useTransform(scrollYProgress, [0, 0.1, 0.2], [1, 1, 0]);

  const goToChapter = (i: number) => {
    const el = pinRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const total = el.offsetHeight - window.innerHeight;
    scrollToY(top + (i / N) * total + total * 0.02 + 2);
  };

  return (
    <section id="servicos" className="relative bg-coal text-cream">
      {/* header (rola normalmente) */}
      <div className="px-6 pt-32 sm:px-12 sm:pt-44">
        <div className="mb-6">
          <Overline index="03" label="Serviços" dark />
        </div>
        <div className="mb-20 flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display text-[clamp(2.6rem,7vw,6.5rem)] leading-[1.05] font-light tracking-tight">
            <MaskReveal>
              <span>O que fazemos</span>
            </MaskReveal>
            <MaskReveal delay={0.1}>
              <em className="text-bronze">com dedicação.</em>
            </MaskReveal>
          </h2>
          <FadeIn delay={0.2} className="pb-3">
            <span className="font-body text-[10px] font-semibold uppercase tracking-[0.3em] text-cream/40">
              ( continue rolando — 04 capítulos )
            </span>
          </FadeIn>
        </div>
      </div>

      {/* área fixada — o scroll coreografa tudo */}
      <div ref={pinRef} className="relative h-[680vh]">
        <div className="sticky top-0 h-svh overflow-hidden">
          {/* brilho ambiente */}
          <div className="pointer-events-none absolute top-1/2 right-[-10%] h-[65vh] w-[45vw] -translate-y-1/2 rounded-full bg-bronze/[0.09] blur-[130px]" />

          <div className="grid h-full grid-cols-1 items-center gap-5 px-6 pt-20 pb-24 sm:gap-8 sm:px-12 sm:pt-24 sm:pb-28 lg:grid-cols-12 lg:gap-14">
            {/* coluna esquerda — texto coreografado */}
            <div className="relative order-2 lg:order-1 lg:col-span-7">
              <div className="mb-5 sm:mb-7">
                <RollingCounter progress={scrollYProgress} />
              </div>

              <div className="relative min-h-[300px] sm:min-h-[340px] lg:min-h-[36vh]">
                {SERVICES.map((s, i) => (
                  <ServicePanel key={s.n} progress={scrollYProgress} i={i} s={s} />
                ))}
              </div>
            </div>

            {/* coluna direita — deck de imagens */}
            <div className="order-1 lg:order-2 lg:col-span-5">
              <div className="mx-auto w-full max-w-[520px] lg:mx-0 lg:ml-auto">
                <ImageDeck progress={scrollYProgress} />
              </div>
            </div>
          </div>

          {/* dica de scroll — some conforme avança */}
          <motion.div
            style={{ opacity: hintOpacity }}
            className="absolute bottom-24 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
          >
            <span className="font-body text-[9px] font-semibold tracking-[0.4em] text-cream/45 uppercase">
              Role para navegar
            </span>
            <div className="h-10 w-px overflow-hidden bg-cream/15">
              <div className="animate-scroll-line h-full w-full bg-cream/60" />
            </div>
          </motion.div>

          {/* navegação por capítulos */}
          <div className="absolute inset-x-0 bottom-0 flex gap-4 px-6 pb-7 sm:gap-8 sm:px-12">
            {SERVICES.map((s, i) => (
              <Chapter
                key={s.n}
                progress={scrollYProgress}
                i={i}
                s={s}
                onClick={() => goToChapter(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
