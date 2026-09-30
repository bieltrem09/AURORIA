import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { scrollTo } from "../App";
import { FadeIn, MaskReveal, Overline } from "./shared";

/* ---------------- botão magnético ---------------- */

function MagneticButton() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 140, damping: 14, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 140, damping: 14, mass: 0.35 });

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.35);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.35);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      className="inline-flex"
    >
      <a
        href="mailto:ola@aurora.studio"
        data-hover
        className="group flex h-40 w-40 flex-col items-center justify-center gap-1 rounded-full border border-cream/30 text-center transition-colors duration-500 hover:border-bronze hover:bg-bronze sm:h-44 sm:w-44"
      >
        <ArrowUpRight
          className="h-5 w-5 text-bronze transition-all duration-500 group-hover:-translate-y-1 group-hover:text-coal"
          strokeWidth={1.5}
        />
        <span className="max-w-[90px] font-body text-[10px] font-semibold uppercase tracking-[0.25em] text-cream transition-colors duration-500 group-hover:text-coal">
          Iniciar um projeto
        </span>
      </a>
    </motion.div>
  );
}

/* ---------------- link com sublinhado animado ---------------- */

function LinkLine({
  children,
  onClick,
  href,
}: {
  children: string;
  onClick?: () => void;
  href?: string;
}) {
  const inner = (
    <>
      {children}
      <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-bronze transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
    </>
  );
  const cls =
    "group relative w-fit font-body text-sm text-cream/75 transition-colors duration-300 hover:text-cream";
  return onClick ? (
    <button data-hover onClick={onClick} className={cls}>
      {inner}
    </button>
  ) : (
    <a data-hover href={href} onClick={(e) => e.preventDefault()} className={cls}>
      {inner}
    </a>
  );
}

/* ---------------- relógio local de São Paulo ---------------- */

function LocalTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "America/Sao_Paulo",
        })
      );
    update();
    const id = setInterval(update, 15000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="font-body text-[10px] font-medium tracking-[0.25em] text-cream/35 uppercase">
      SP — {time} (BRT)
    </span>
  );
}

/* ---------------- dados ---------------- */

const NAV = [
  { label: "Início", target: "#topo" },
  { label: "Manifesto", target: "#manifesto" },
  { label: "Projetos", target: "#projetos" },
  { label: "Serviços", target: "#servicos" },
];

const SOCIAL = ["Instagram", "Behance", "LinkedIn", "Pinterest"];

const PROCESS = [
  {
    n: "01",
    title: "Conversa inicial",
    desc: "Um bate-papo sem compromisso para entender o seu momento, os seus desafios e aonde você quer chegar com a sua marca.",
  },
  {
    n: "02",
    title: "Proposta sob medida",
    desc: "Em até 48 horas enviamos escopo, cronograma e investimento — tudo com transparência, sem pressa e sem letras miúdas.",
  },
  {
    n: "03",
    title: "Criação com calma",
    desc: "Imersão total no universo da sua marca, com entregas em etapas e acompanhamento próximo do primeiro esboço ao lançamento.",
  },
];

/* ---------------- footer ---------------- */

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-14%", "0%"]);

  return (
    <footer
      ref={ref}
      id="contato"
      className="relative overflow-hidden border-t border-cream/10 bg-coal px-6 pt-32 pb-10 text-cream sm:px-12 sm:pt-40"
    >
      {/* palavra-fantasma ao fundo */}
      <motion.span
        aria-hidden
        style={{ y: bgY }}
        className="pointer-events-none absolute -bottom-[4vw] left-1/2 -translate-x-1/2 font-display text-[24vw] leading-none font-light whitespace-nowrap text-bronze/[0.09] italic"
      >
        contato
      </motion.span>

      {/* brilho ambiente dourado */}
      <div className="pointer-events-none absolute top-[10%] right-[-12%] h-[55vh] w-[42vw] rounded-full bg-bronze/[0.1] blur-[140px]" />
      <div className="pointer-events-none absolute bottom-[16%] left-[-10%] h-[40vh] w-[30vw] rounded-full bg-bronze/[0.07] blur-[120px]" />

      <div className="relative z-10">
        {/* topo: overline + status */}
        <div className="mb-16 flex flex-wrap items-center justify-between gap-6">
          <Overline index="04" label="Contato" dark />
          <FadeIn delay={0.1} className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-bronze opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-bronze" />
            </span>
            <span className="font-body text-[10px] font-semibold tracking-[0.3em] text-cream/60 uppercase">
              Agenda aberta para novos projetos — 2026
            </span>
          </FadeIn>
        </div>

        {/* título + texto de apoio + botão */}
        <div className="flex flex-col justify-between gap-14 lg:flex-row lg:items-end">
          <h2 className="font-display text-[clamp(3rem,9vw,9rem)] leading-[1.02] font-light tracking-tight">
            <MaskReveal>
              <span>Vamos criar</span>
            </MaskReveal>
            <MaskReveal delay={0.12}>
              <span>
                algo <em className="text-bronze">extraordinário.</em>
              </span>
            </MaskReveal>
          </h2>

          <div className="flex max-w-md shrink-0 flex-col gap-9">
            <FadeIn delay={0.2} className="flex flex-col gap-5">
              <p className="font-body text-sm leading-relaxed text-cream/55 sm:text-[15px]">
                Conte para nós sobre a sua marca, o seu momento e os seus
                sonhos. Estudamos cada projeto com calma e respondemos em até
                48 horas com uma proposta pensada sob medida — sem pressa, sem
                fórmulas, com muita escuta.
              </p>
              <p className="font-body text-sm leading-relaxed text-cream/55 sm:text-[15px]">
                Seja um rebranding completo, um site imersivo ou uma campanha
                inteira — o primeiro passo é sempre uma boa conversa. Escreva,
                ligue, ou venha tomar um café no nosso ateliê nos Jardins: a
                porta está aberta e a luz, acesa.
              </p>
              <p className="font-display text-base italic text-bronze sm:text-lg">
                "Grandes marcas nascem de boas conversas."
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <MagneticButton />
            </FadeIn>
          </div>
        </div>

        {/* faixa gigante de email */}
        <FadeIn delay={0.15} className="mt-24">
          <a
            href="mailto:ola@aurora.studio"
            data-hover
            className="group flex items-center justify-between gap-4 border-y border-cream/10 py-8 sm:gap-6 sm:py-12"
          >
            <div>
              <p className="mb-3 font-body text-[10px] font-semibold tracking-[0.3em] text-cream/40 uppercase">
                ( Escreva para a gente )
              </p>
              <span className="relative inline-block font-display text-[clamp(1.7rem,5.2vw,5rem)] leading-tight font-light tracking-tight text-cream italic transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-3">
                ola@aurora.studio
                <span className="absolute -bottom-2 left-0 h-px w-full origin-right scale-x-0 bg-bronze transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:origin-left group-hover:scale-x-100" />
              </span>
            </div>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-cream/25 transition-all duration-500 group-hover:border-bronze group-hover:bg-bronze sm:h-20 sm:w-20">
              <ArrowUpRight
                className="h-5 w-5 transition-all duration-500 group-hover:rotate-45 group-hover:text-coal sm:h-6 sm:w-6"
                strokeWidth={1.25}
              />
            </span>
          </a>
        </FadeIn>

        {/* como começamos — processo em 3 passos */}
        <div className="mt-20">
          <FadeIn className="mb-10 flex items-center gap-3">
            <span className="font-body text-[10px] font-semibold tracking-[0.3em] text-cream/40 uppercase">
              ( Como começamos )
            </span>
            <span className="h-px flex-1 bg-cream/10" />
          </FadeIn>

          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-3">
            {PROCESS.map((p, i) => (
              <FadeIn key={p.n} delay={i * 0.1} className="flex flex-col gap-3 border-t border-bronze/25 pt-6">
                <span className="font-display text-4xl font-light text-bronze italic sm:text-5xl">
                  {p.n}
                </span>
                <h4 className="mt-1 font-display text-2xl font-light tracking-tight text-cream">
                  {p.title}
                </h4>
                <p className="max-w-xs font-body text-[13px] leading-relaxed text-cream/55">
                  {p.desc}
                </p>
              </FadeIn>
            ))}
          </div>
        </div>

        {/* grade de informações */}
        <div className="mt-24 grid grid-cols-2 gap-x-8 gap-y-12 border-t border-cream/10 pt-14 md:grid-cols-4">
          <FadeIn className="flex flex-col gap-3.5">
            <span className="font-body text-[10px] font-semibold uppercase tracking-[0.3em] text-cream/40">
              Navegação
            </span>
            {NAV.map((n) => (
              <LinkLine key={n.target} onClick={() => scrollTo(n.target)}>
                {n.label}
              </LinkLine>
            ))}
          </FadeIn>

          <FadeIn delay={0.08} className="flex flex-col gap-3.5">
            <span className="font-body text-[10px] font-semibold uppercase tracking-[0.3em] text-cream/40">
              Social
            </span>
            {SOCIAL.map((s) => (
              <LinkLine key={s} href="#">
                {s}
              </LinkLine>
            ))}
          </FadeIn>

          <FadeIn delay={0.16} className="flex flex-col gap-3.5">
            <span className="font-body text-[10px] font-semibold uppercase tracking-[0.3em] text-cream/40">
              Escritório
            </span>
            <span className="font-body text-sm leading-relaxed text-cream/75">
              Rua da Consolação, 2400
              <br />
              Jardins — São Paulo, SP
              <br />
              Brasil
            </span>
            <span className="font-body text-[11px] tracking-[0.15em] text-cream/45">
              Seg a Sex — 9h às 18h
            </span>
          </FadeIn>

          <FadeIn delay={0.24} className="flex flex-col gap-3.5">
            <span className="font-body text-[10px] font-semibold uppercase tracking-[0.3em] text-cream/40">
              Contato direto
            </span>
            <div className="flex flex-col gap-1">
              <span className="font-body text-[10px] tracking-[0.2em] text-cream/45 uppercase">
                Novos projetos
              </span>
              <LinkLine href="mailto:ola@aurora.studio">ola@aurora.studio</LinkLine>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-body text-[10px] tracking-[0.2em] text-cream/45 uppercase">
                Imprensa & parcerias
              </span>
              <LinkLine href="mailto:press@aurora.studio">press@aurora.studio</LinkLine>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-body text-[10px] tracking-[0.2em] text-cream/45 uppercase">
                Telefone
              </span>
              <span className="font-body text-sm text-cream/75">+55 11 99876 2400</span>
            </div>
          </FadeIn>
        </div>

        {/* barra final */}
        <div className="mt-20 flex flex-col items-center justify-between gap-5 border-t border-cream/10 pt-8 sm:flex-row">
          <span className="font-body text-[10px] font-medium tracking-[0.25em] text-cream/35 uppercase">
            © 2026 AURORA — Estúdio Criativo
          </span>

          <span className="font-display text-sm italic text-cream/35">
            Feito com luz, em São Paulo.
          </span>

          <div className="flex items-center gap-6">
            <LocalTime />
            <button
              data-hover
              onClick={() => scrollTo("#topo")}
              className="group flex items-center gap-3 font-body text-[10px] font-semibold uppercase tracking-[0.3em] text-cream/60 transition-colors hover:text-cream"
            >
              Voltar ao topo
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/25 transition-all duration-500 group-hover:border-bronze group-hover:bg-bronze group-hover:text-coal">
                <ArrowUp
                  className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5"
                  strokeWidth={1.5}
                />
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
