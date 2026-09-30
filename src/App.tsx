import { useEffect, useState } from "react";
import Lenis from "lenis";
import Preloader from "./components/Preloader";
import Cursor from "./components/Cursor";
import ProgressBar from "./components/ProgressBar";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Manifesto from "./components/Manifesto";
import Works from "./components/Works";
import Services from "./components/Services";
import Footer from "./components/Footer";

let lenisInstance: Lenis | null = null;

export function scrollTo(target: string) {
  const el = document.querySelector(target);
  if (!el) return;
  if (lenisInstance) {
    lenisInstance.scrollTo(el as HTMLElement, { offset: 0, duration: 1.6 });
  } else {
    (el as HTMLElement).scrollIntoView({ behavior: "smooth" });
  }
}

export function scrollToY(y: number) {
  if (lenisInstance) {
    lenisInstance.scrollTo(y, { duration: 1.4 });
  } else {
    window.scrollTo({ top: y, behavior: "smooth" });
  }
}

export default function App() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, wheelMultiplier: 1 });
    lenisInstance = lenis;
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return (
    <main className="relative min-h-screen overflow-x-clip bg-cream text-ink">
      <Preloader onDone={() => setLoaded(true)} />
      <Cursor />
      <ProgressBar />
      <Nav />
      <Hero started={loaded} />
      <Marquee />
      <Manifesto />
      <Works />
      <Services />
      <Footer />

      {/* film grain */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[90] opacity-[0.055] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
        }}
      />
    </main>
  );
}
