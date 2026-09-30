import { Asterisk } from "lucide-react";

const ITEMS = [
  "Direção de Arte",
  "Identidade Visual",
  "Design Digital",
  "Fotografia & Filme",
  "Branding",
  "Editorial",
];

function Row() {
  return (
    <div className="flex shrink-0 items-center">
      {ITEMS.map((item) => (
        <div key={item} className="flex items-center">
          <span className="px-8 font-display text-2xl font-light italic tracking-tight text-ink/85 sm:px-12 sm:text-4xl">
            {item}
          </span>
          <Asterisk className="h-5 w-5 text-bronze sm:h-6 sm:w-6" strokeWidth={1.5} />
        </div>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <section className="relative z-10 overflow-hidden border-y border-ink/10 bg-cream py-6 sm:py-8">
      <div className="animate-marquee flex w-max will-change-transform">
        <Row />
        <Row />
      </div>
    </section>
  );
}
