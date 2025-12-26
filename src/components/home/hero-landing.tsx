import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/context/authProvider";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";

export default function HeroLanding() {
  const { courses } = useAuth();

  return (
    <section className="relative space-y-6 py-12 sm:py-20 lg:py-24 overflow-hidden bg-gradient-to-br from-teal-50/30 via-white to-purple-50/20 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800">
      <motion.div
        className="absolute top-20 right-10 w-72 h-72 bg-teal-100/30 dark:bg-teal-900/10 rounded-full blur-3xl"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      <motion.div
        className="absolute bottom-20 left-10 w-96 h-96 bg-purple-100/30 dark:bg-purple-900/10 rounded-full blur-3xl"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
      />

      <div className="container flex max-w-5xl flex-col items-center gap-5 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center rounded-full border border-teal-200 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-950/50 px-4 py-2"
        >
          <Icons.award className="mr-2 size-4 text-teal-600 dark:text-teal-400" />
          <span className="text-sm font-medium text-teal-900 dark:text-teal-100">
            Certifikované kurzy fyzioterapie
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-balance text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-[66px] text-neutral-900 dark:text-white"
        >
          Profesionální vzdělávání v{" "}
          <span className="bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent">
            fyzioterapii
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-2xl text-balance leading-normal text-muted-foreground sm:text-xl sm:leading-8"
        >
          Rozšiřte své dovednosti s našimi online kurzy vedenými certifikovanými fyzioterapeuty. Praktické znalosti pro moderní praxi.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 w-full sm:w-auto"
        >
          <Link
            to="/courses"
            className={cn(
              "button1 inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
            )}
          >
            <span>Prohlédnout kurzy</span>
            <Icons.arrowRight className="size-4" />
          </Link>
          <Link
            to="/auth/register"
            className={cn(
              "inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-semibold border-2 border-teal-500 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all"
            )}
          >
            <Icons.users className="size-4" />
            <span>Začít zdarma</span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl"
        >
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-white/50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
            <Icons.bookOpen className="size-8 text-teal-600 dark:text-teal-400" />
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">{courses.length}+</p>
            <p className="text-sm text-muted-foreground">Aktivních kurzů</p>
          </div>

          <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-white/50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
            <Icons.users className="size-8 text-teal-600 dark:text-teal-400" />
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">3,500+</p>
            <p className="text-sm text-muted-foreground">Spokojených studentů</p>
          </div>

          <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-white/50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
            <Icons.star className="size-8 text-teal-600 dark:text-teal-400" />
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">4.9/5</p>
            <p className="text-sm text-muted-foreground">Průměrné hodnocení</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
