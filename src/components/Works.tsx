import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { FadeIn, MaskReveal, Overline } from "./shared";

type Project = {
  img: string;
  name: string;
  category: string;
  year: string;
};

const PROJECTS: Project[] = [
  { img: "/images/work-3.jpg", name: "Casa Vetro", category: "Identidade Visual", year: "2026" },
  { img: "/images/work-1.jpg", name: "Onze Studio", category: "Direção de Arte", year: "2025" },
  { img: "/images/work-2.jpg", name: "Botan 1928", category: "Branding — Perfumaria", year: "2025" },
  { img: "/images/work-4.jpg", name: "Atelier Gaia", category: "Editorial — Cerâmica", year: "2024" },
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <FadeIn delay={(index % 2) * 0.12} className={index % 2 === 1 ? "md:mt-40" : ""}>
      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        data-hover
        className="group block"
        aria-label={`Ver projeto ${project.name}`}
      >
        <div ref={ref} className="relative aspect-[4/5] overflow-hidden rounded-[3px] bg-paper">
          <motion.div style={{ y }} className="absolute inset-x-0 top-[-9%] h-[118%] will-change-transform">
            <img
              src={project.img}
              alt={project.name}
              className="h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
            />
          </motion.div>
          <div className="absolute inset-0 bg-ink/0 transition-colors duration-700 group-hover:bg-ink/10" />
          <span className="absolute top-4 left-4 bg-cream/90 px-2.5 py-1 font-body text-[9px] font-semibold tracking-[0.25em] text-ink backdrop-blur-sm">
            0{index + 1}
          </span>
        </div>

        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="flex items-center gap-2 font-display text-2xl font-light tracking-tight text-ink sm:text-3xl">
              <span className="italic">{project.name}</span>
              <ArrowUpRight
                className="h-5 w-5 -translate-x-1 translate-y-1 text-bronze opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
                strokeWidth={1.5}
              />
            </h3>
            <p className="mt-1.5 font-body text-[10px] font-semibold uppercase tracking-[0.25em] text-ink/55">
              {project.category}
            </p>
          </div>
          <span className="pt-1.5 font-body text-[11px] font-medium tracking-[0.2em] text-ink/45">
            {project.year}
          </span>
        </div>
      </a>
    </FadeIn>
  );
}

export default function Works() {
  return (
    <section id="projetos" className="relative px-6 py-32 sm:px-12 sm:py-40">
      <div className="mb-6">
        <Overline index="02" label="Projetos Selecionados" />
      </div>

      <div className="mb-20 flex flex-wrap items-end justify-between gap-6">
        <h2 className="font-display text-[clamp(2.8rem,8vw,7.5rem)] leading-[1.02] font-light tracking-tight">
          <MaskReveal>
            <span>
              Trabalhos que <em className="text-bronze">ficam</em>
            </span>
          </MaskReveal>
          <MaskReveal delay={0.1}>
            <span>
              na <em className="text-bronze">memória.</em>
            </span>
          </MaskReveal>
        </h2>
        <FadeIn delay={0.2} className="pb-3">
          <span className="font-body text-[11px] font-semibold tracking-[0.3em] text-ink/50">
            ( 2024 — 2026 )
          </span>
        </FadeIn>
      </div>

      <div className="grid grid-cols-1 gap-x-10 gap-y-24 md:grid-cols-2">
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.name} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}
