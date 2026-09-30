import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { scrollTo } from "../App";
import { EASE, EASE_EXPO } from "./shared";

const LINKS = [
  { label: "Manifesto", href: "#manifesto" },
  { label: "Projetos", href: "#projetos" },
  { label: "Serviços", href: "#servicos" },
  { label: "Contato", href: "#contato" },
];

function Clock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () =>
      setTime(new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
    update();
    const id = setInterval(update, 15000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="hidden font-body text-[11px] font-semibold tracking-[0.25em] lg:inline">
      SP — {time}
    </span>
  );
}

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.header
        initial={{ y: -48, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: EASE, delay: 3 }}
        className="fixed top-0 right-0 left-0 z-[80] mix-blend-difference"
      >
        <nav className="flex items-center justify-between px-6 py-5 text-[#f3f0ea] sm:px-12">
          <button
            onClick={() => scrollTo("#topo")}
            data-hover
            className="font-display text-xl italic tracking-wide"
          >
            AURORA<span className="not-italic">®</span>
          </button>

          <div className="hidden items-center gap-8 md:flex">
            {LINKS.map((l) => (
              <button
                key={l.href}
                data-hover
                onClick={() => scrollTo(l.href)}
                className="group relative font-body text-[11px] font-semibold uppercase tracking-[0.25em]"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:origin-left group-hover:scale-x-100" />
              </button>
            ))}
            <Clock />
          </div>

          <button
            data-hover
            onClick={() => setOpen(true)}
            className="font-body text-[11px] font-semibold uppercase tracking-[0.25em] md:hidden"
          >
            Menu
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.8, ease: EASE_EXPO }}
            className="fixed inset-0 z-[97] flex flex-col justify-between bg-coal px-6 py-8 text-cream sm:px-12"
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-xl italic">AURORA®</span>
              <button
                data-hover
                onClick={() => setOpen(false)}
                className="font-body text-[11px] font-semibold uppercase tracking-[0.25em] text-cream/70"
              >
                Fechar
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {LINKS.map((l, i) => (
                <div key={l.href} className="overflow-hidden">
                  <motion.button
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "110%" }}
                    transition={{ duration: 0.7, ease: EASE, delay: 0.15 + i * 0.07 }}
                    onClick={() => {
                      setOpen(false);
                      setTimeout(() => scrollTo(l.href), 650);
                    }}
                    className="flex items-baseline gap-4 font-display text-5xl font-light tracking-tight sm:text-6xl"
                  >
                    <span className="font-body text-xs tracking-[0.25em] text-bronze">
                      0{i + 1}
                    </span>
                    <span className="italic">{l.label}</span>
                  </motion.button>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between font-body text-[10px] font-medium uppercase tracking-[0.3em] text-cream/40">
              <span>São Paulo — Brasil</span>
              <span>Desde 2016</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
