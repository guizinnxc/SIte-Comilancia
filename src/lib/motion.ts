import type { Variants } from "framer-motion";

// Curva suave e editorial, usada em todas as transições do site.
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.14, delayChildren: 0.25 },
  },
};

export const riseItem: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, ease: EASE },
  },
};
