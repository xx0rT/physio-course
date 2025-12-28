import { memo, useEffect, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { useRef } from "react";
import { LucideIcon } from "lucide-react";

interface AnimatedStatsCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  suffix?: string;
  color: string;
  delay?: number;
}

const AnimatedStatsCard = memo(({
  icon: Icon,
  label,
  value,
  suffix = "",
  color,
  delay = 0
}: AnimatedStatsCardProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start({
        scale: [0.8, 1.05, 1],
        opacity: [0, 1],
        transition: {
          duration: 0.6,
          delay,
          ease: "easeOut"
        }
      });

      // Animated counter
      let startValue = 0;
      const duration = 1500;
      const increment = value / (duration / 16);

      const timer = setInterval(() => {
        startValue += increment;
        if (startValue >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(startValue));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isInView, value, controls, delay]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      whileHover={{
        y: -8,
        scale: 1.02,
        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
        transition: { duration: 0.3 }
      }}
      className="relative bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-lg overflow-hidden group cursor-pointer"
    >
      {/* Background gradient */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
        style={{
          background: `linear-gradient(135deg, ${color} 0%, transparent 100%)`
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="p-3 rounded-xl shadow-md"
            style={{ backgroundColor: `${color}15` }}
          >
            <Icon className="w-6 h-6" style={{ color }} />
          </motion.div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: isInView ? 1 : 0 }}
            transition={{ delay: delay + 0.3, type: "spring", stiffness: 200 }}
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: color }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{
            opacity: isInView ? 1 : 0,
            x: isInView ? 0 : -20
          }}
          transition={{ delay: delay + 0.2 }}
        >
          <div className="space-y-1">
            <motion.h3
              className="text-4xl font-bold"
              style={{ color }}
            >
              {count.toLocaleString()}{suffix}
            </motion.h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm font-medium">
              {label}
            </p>
          </div>
        </motion.div>

        {/* Progress bar animation */}
        <motion.div
          className="mt-4 h-1 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: isInView ? "100%" : 0 }}
            transition={{ delay: delay + 0.4, duration: 1, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
          />
        </motion.div>
      </div>

      {/* Hover effect particles */}
      <motion.div
        className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500"
        style={{ backgroundColor: color }}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
});

AnimatedStatsCard.displayName = 'AnimatedStatsCard';

export default AnimatedStatsCard;
