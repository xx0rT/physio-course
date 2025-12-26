import { ReactNode } from "react";
import { motion } from "framer-motion";

interface StickySectionProps {
  id: string;
  children: ReactNode;
  stickyLabel?: string;
}

const StickySection = ({ id, children, stickyLabel }: StickySectionProps) => {
  return (
    <section id={id} className="relative scroll-mt-20">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1]
        }}
        viewport={{ once: false, amount: 0.2, margin: "0px 0px -100px 0px" }}
        className="relative"
      >
        {stickyLabel && (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: false, amount: 0.3 }}
            className="sticky top-24 left-0 z-30 mb-8 hidden lg:block"
          >
            <div className="inline-flex items-center gap-3 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md border border-neutral-200 dark:border-neutral-700 rounded-r-full px-6 py-3 shadow-xl">
              <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                {stickyLabel}
              </span>
            </div>
          </motion.div>
        )}

        <div className="relative z-10">
          {children}
        </div>

        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent opacity-50" />
      </motion.div>

      <div className="h-20" />
    </section>
  );
};

export default StickySection;
