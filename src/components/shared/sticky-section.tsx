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
      {stickyLabel && (
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: false, amount: 0.3 }}
          className="sticky top-24 left-0 z-30 mb-4 hidden lg:block"
        >
          <div className="inline-flex items-center gap-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-r-full px-6 py-2 shadow-lg">
            <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
              {stickyLabel}
            </span>
          </div>
        </motion.div>
      )}
      {children}
    </section>
  );
};

export default StickySection;
