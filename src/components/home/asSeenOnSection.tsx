import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const AsSeenOnSection = () => {
  const [position, setPosition] = useState(0);

  const companies = [
    { name: "ČT Sport", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Logo_%C4%8CT_sport.svg/320px-Logo_%C4%8CT_sport.svg.png" },
    { name: "Česká televize", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Logo_%C4%8Cesk%C3%A9_televize.svg/320px-Logo_%C4%8Cesk%C3%A9_televize.svg.png" },
    { name: "iDNES.cz", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/IDNES_logo.svg/320px-IDNES_logo.svg.png" },
    { name: "Aktuálně.cz", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Aktualne.cz_logo.svg/320px-Aktualne.cz_logo.svg.png" },
    { name: "Novinky.cz", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Novinky.cz_logo.svg/320px-Novinky.cz_logo.svg.png" },
    { name: "Hospodářské noviny", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Hospod%C3%A1%C5%99sk%C3%A9_noviny_logo.svg/320px-Hospod%C3%A1%C5%99sk%C3%A9_noviny_logo.svg.png" },
  ];

  const duplicatedCompanies = [...companies, ...companies, ...companies];

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => {
        const newPosition = prev - 0.05;
        if (newPosition <= -(100 / 3)) {
          return 0;
        }
        return newPosition;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full py-20 overflow-hidden transition-all duration-700 ease-in-out bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-800 dark:text-white mb-4">
            Taky jste nás mohli vidět na
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-lg">
            Důvěřují nám přední média a instituce
          </p>
        </motion.div>

        <div className="relative w-full overflow-hidden bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-200 dark:border-neutral-700 shadow-sm py-12">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white dark:from-neutral-800 to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white dark:from-neutral-800 to-transparent z-10"></div>

          <div
            className="flex items-center gap-20 px-8"
            style={{
              transform: `translateX(${position}%)`,
              transition: "none",
              width: "max-content"
            }}
          >
            {duplicatedCompanies.map((company, index) => (
              <div
                key={`${company.name}-${index}`}
                className="flex items-center justify-center min-w-[220px] h-24 grayscale hover:grayscale-0 transition-all duration-500 opacity-50 hover:opacity-100"
              >
                <img
                  src={company.logo}
                  alt={company.name}
                  className="max-h-16 w-auto object-contain filter dark:invert dark:brightness-0 dark:contrast-200"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      const fallback = document.createElement('div');
                      fallback.className = 'text-neutral-700 dark:text-neutral-300 font-bold text-xl';
                      fallback.textContent = company.name;
                      parent.appendChild(fallback);
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AsSeenOnSection;
