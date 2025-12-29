import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/shared/icons";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

interface InfoItem {
  icon?: keyof typeof Icons;
  title: string;
  description: string;
}

interface InfoLandingData {
  title: string;
  description: string;
  image: string;
  list: InfoItem[];
}

interface InfoLandingProps {
  data: InfoLandingData;
  reverse?: boolean;
}

export default function InfoLanding({
  data,
  reverse = false,
}: InfoLandingProps) {
  return (
    <div className="py-10 sm:py-20 bg-white dark:bg-neutral-900">
      <MaxWidthWrapper className="grid gap-10 px-2.5 lg:grid-cols-2 lg:items-center lg:px-7">
        <motion.div
          initial={{ opacity: 0, x: reverse ? 50 : -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={cn(reverse ? "lg:order-2" : "lg:order-1")}
        >
          <h2 className="text-2xl font-bold text-foreground md:text-4xl lg:text-[40px]">
            {data.title}
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            {data.description}
          </p>
          <dl className="mt-6 space-y-4 leading-7">
            {data.list.map((item, index) => {
              const Icon = Icons[item.icon || "check"];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="relative pl-8"
                >
                  <dt className="font-semibold text-foreground">
                    <Icon className="absolute left-0 top-1 size-5 text-teal-600 dark:text-teal-400" />
                    <span>{item.title}</span>
                  </dt>
                  <dd className="text-sm text-muted-foreground">
                    {item.description}
                  </dd>
                </motion.div>
              );
            })}
          </dl>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: reverse ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={cn(
            "overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-xl lg:-m-4",
            reverse ? "lg:order-1" : "lg:order-2",
          )}
        >
          <div className="aspect-video">
            <img
              className="size-full object-cover object-center"
              src={data.image}
              alt={data.title}
              loading="lazy"
            />
          </div>
        </motion.div>
      </MaxWidthWrapper>
    </div>
  );
}
