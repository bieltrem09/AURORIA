import { motion, useScroll, useSpring } from "framer-motion";

export default function ProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });

  return (
    <motion.div
      className="fixed top-0 right-0 left-0 z-[95] h-[2.5px] origin-left bg-bronze"
      style={{ scaleX }}
    />
  );
}
