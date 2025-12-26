import { motion } from "framer-motion";
import { FaAward, FaCertificate, FaMedal, FaGraduationCap } from "react-icons/fa";

const CertificatesSection = () => {
  const certificates = [
    {
      icon: FaCertificate,
      title: "Licence MZČR",
      description: "Všichni naši fyzioterapeuti mají platnou licenci Ministerstva zdravotnictví ČR",
      color: "teal"
    },
    {
      icon: FaAward,
      title: "Mezinárodní certifikace",
      description: "Držíme mezinárodní certifikace v manuální terapii a sportovní fyzioterapii",
      color: "purple"
    },
    {
      icon: FaMedal,
      title: "ISO 9001:2015",
      description: "Certifikovaný systém řízení kvality služeb fyzioterapie",
      color: "orange"
    },
    {
      icon: FaGraduationCap,
      title: "Kontinuální vzdělávání",
      description: "Pravidelné školení a akreditované kurzy pro naše odborníky",
      color: "blue"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      teal: "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800",
      purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800",
      orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800",
      blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <section className="max-w-7xl mx-auto px-5 md:px-10 py-24 transition-all duration-700 ease-in-out">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.2 }}
        className="text-center mb-16"
      >
        <span className="px-4 py-2 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-full text-sm font-semibold uppercase tracking-wide inline-block mb-4">
          Certifikace a kvalita
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-neutral-800 dark:text-white mb-4">
          Naše certifikace a akreditace
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 text-lg max-w-2xl mx-auto">
          Garantujeme nejvyšší standard péče díky oficiálním certifikacím a pravidelnému vzdělávání
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {certificates.map((cert, index) => (
          <motion.div
            key={cert.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className={`${getColorClasses(cert.color)} rounded-2xl p-6 border-2 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-default`}
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div className="p-4 rounded-full bg-white dark:bg-neutral-900 shadow-md">
                <cert.icon className="text-4xl" />
              </div>
              <h3 className="font-bold text-lg text-neutral-800 dark:text-white">
                {cert.title}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                {cert.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true, amount: 0.2 }}
        className="mt-12 text-center bg-gradient-to-r from-teal-50 to-purple-50 dark:from-neutral-800 dark:to-neutral-800 rounded-2xl p-8 border border-neutral-200 dark:border-neutral-700"
      >
        <p className="text-neutral-700 dark:text-neutral-300 text-lg font-medium">
          Důvěřujte ověřeným odborníkům s&nbsp;mnohaletou praxí a&nbsp;oficiálními certifikacemi
        </p>
      </motion.div>
    </section>
  );
};

export default CertificatesSection;
