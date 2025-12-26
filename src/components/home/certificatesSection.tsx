import { motion } from "framer-motion";
import { FaAward, FaCertificate, FaMedal, FaGraduationCap } from "react-icons/fa";

const CertificatesSection = () => {
  const certificates = [
    {
      icon: FaCertificate,
      title: "Licence MZČR",
      description: "Všichni naši fyzioterapeuti mají platnou licenci Ministerstva zdravotnictví ČR"
    },
    {
      icon: FaAward,
      title: "Mezinárodní certifikace",
      description: "Držíme mezinárodní certifikace v manuální terapii a sportovní fyzioterapii"
    },
    {
      icon: FaMedal,
      title: "ISO 9001:2015",
      description: "Certifikovaný systém řízení kvality služeb fyzioterapie"
    },
    {
      icon: FaGraduationCap,
      title: "Kontinuální vzdělávání",
      description: "Pravidelné školení a akreditované kurzy pro naše odborníky"
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-5 md:px-10 py-24 transition-all duration-700 ease-in-out">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.2 }}
        className="text-center mb-16"
      >
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
            whileHover={{ y: -4 }}
            className="bg-white dark:bg-neutral-800 rounded-2xl p-8 border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-all duration-300 cursor-default"
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                <cert.icon className="text-2xl text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-bold text-lg text-neutral-900 dark:text-white">
                {cert.title}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                {cert.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CertificatesSection;
