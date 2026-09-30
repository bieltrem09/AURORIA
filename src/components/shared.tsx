import { motion } from "framer-motion";
import type { ReactNode } from "react";

export const EASE = [0.22, 1, 0.36, 1] as const;
export const EASE_EXPO = [0.76, 0, 0.24, 1] as const;

/** Text rises out of an overflow mask when it enters the viewport */
export function MaskReveal({
  children,
  delay = 0,
  className = "",
  as = "span",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "span" | "div";
}) {
  const Tag = as === "div" ? motion.div : motion.span;
  const Wrapper = as === "div" ? "div" : "span";
  return (
    <Wrapper className={as === "span" ? "inline-block overflow-hidden align-top" : "block overflow-hidden"}>
      <Tag
        className={`block will-change-transform ${className}`}
        initial={{ y: "115%" }}
        whileInView={{ y: "0%" }}
        viewport={{ once: true, margin: "-8% 0px" }}
        transition={{ duration: 1.1, ease: EASE, delay }}
      >
        {children}
      </Tag>
    </Wrapper>
  );
}

/** Gentle fade + rise on scroll into view */
export function FadeIn({
  children,
  delay = 0,
  y = 36,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1.1, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Small overline label — e.g. ( 01 ) PROJETOS */
export function Overline({
  index,
  label,
  dark = false,
}: {
  index?: string;
  label: string;
  dark?: boolean;
}) {
  return (
    <FadeIn className="flex items-center gap-3">
      {index && (
        <span className="font-body text-[11px] font-medium tracking-[0.25em] text-bronze">
          ( {index} )
        </span>
      )}
      <span
        className={`font-body text-[11px] font-semibold uppercase tracking-[0.25em] ${
          dark ? "text-cream/70" : "text-ink/70"
        }`}
      >
        {label}
      </span>
      <span className={`h-px w-10 ${dark ? "bg-cream/30" : "bg-ink/30"}`} />
    </FadeIn>
  );
}
