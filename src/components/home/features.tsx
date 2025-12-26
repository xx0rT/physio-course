import { Link } from "react-router-dom";
import { FaVideo, FaClipboardList, FaUserMd, FaChartLine, FaCalendarAlt, FaCertificate } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { HeaderSection } from "@/components/shared/header-section";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

const features = [
  {
    icon: FaVideo,
    title: "Online konzultace",
    description: "Individuální videohovory s certifikovanými fyzioterapeuty z pohodlí vašeho domova. Profesionální péče kdykoliv potřebujete."
  },
  {
    icon: FaClipboardList,
    title: "Personalizované plány",
    description: "Cvičební programy přizpůsobené vašim potřebám, cílům a aktuálnímu zdravotnímu stavu s průběžnou úpravou."
  },
  {
    icon: FaUserMd,
    title: "Certifikovaní odborníci",
    description: "Všichni fyzioterapeuti jsou licencovaní profesionálové s mnohaletou praxí a specializovaným vzděláním."
  },
  {
    icon: FaChartLine,
    title: "Sledování pokroku",
    description: "Detailní monitoring vašich výsledků a pokroku s pravidelnými vyhodnoceními a úpravami terapie."
  },
  {
    icon: FaCalendarAlt,
    title: "Flexibilní plánování",
    description: "Rezervujte si termíny podle vašeho harmonogramu. Online přístup 24/7 k vašim cvičebním plánům."
  },
  {
    icon: FaCertificate,
    title: "Komplexní péče",
    description: "Od prevence přes akutní bolesti až po pooperační rehabilitaci. Individuální přístup ke každému pacientovi."
  }
];

export default function Features() {
  return (
    <section>
      <div className="pb-6 pt-28">
        <MaxWidthWrapper>
          <HeaderSection
            label="Naše služby"
            title="Objevte všechny možnosti péče"
            subtitle="Moderní fyzioterapie přizpůsobená vašim potřebám s důrazem na dlouhodobé výsledky"
          />

          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  className="group relative overflow-hidden rounded-2xl border bg-background p-5 md:p-8 transition-all duration-300 hover:shadow-lg"
                  key={feature.title}
                >
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 aspect-video -translate-y-1/2 rounded-full border bg-gradient-to-b from-teal-500/60 to-white opacity-20 blur-2xl duration-300 group-hover:-translate-y-1/4 dark:from-white dark:to-white dark:opacity-5 dark:group-hover:opacity-10"
                  />
                  <div className="relative">
                    <div className="relative flex size-12 rounded-2xl border border-border shadow-sm items-center justify-center bg-muted/50">
                      <Icon className="size-6 text-primary" />
                    </div>

                    <h3 className="mt-6 text-xl font-semibold text-foreground">
                      {feature.title}
                    </h3>

                    <p className="mt-2 pb-6 text-muted-foreground">
                      {feature.description}
                    </p>

                    <div className="-mb-5 flex gap-3 border-t border-muted py-4 md:-mb-7">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="px-4 rounded-xl"
                        asChild
                      >
                        <Link to="/courses" className="flex items-center gap-2">
                          <span>Zobrazit kurzy</span>
                          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </MaxWidthWrapper>
      </div>
    </section>
  );
}
