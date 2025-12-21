import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FaChevronDown, FaChevronUp, FaQuestionCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const FAQPage = () => {
  const { t } = useTranslation();
  const faqs = t('faq.questions', { returnObjects: true }) as Array<{ question: string; answer: string }>;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      <div className="relative bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-neutral-800 dark:to-neutral-900 py-20 mt-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-teal-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-5 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="flex justify-center mb-6">
              <div className="bg-teal-500 rounded-full p-6 shadow-xl">
                <FaQuestionCircle className="w-16 h-16 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-neutral-800 dark:text-white">
              {t("faq.title")}
            </h1>
            <p className="text-xl text-neutral-600 dark:text-neutral-300">
              Najděte odpovědi na nejčastější otázky o naší platformě, kurzech a službách
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-5 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-neutral-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-neutral-200 dark:border-neutral-700"
              >
                <button
                  className="w-full text-left p-6 flex items-center justify-between group transition-all duration-200 hover:bg-teal-50 dark:hover:bg-neutral-750"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={openIndex === index}
                >
                  <span className="font-semibold text-lg text-neutral-800 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors pr-4">
                    {faq.question}
                  </span>
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    openIndex === index
                      ? 'bg-teal-500 text-white'
                      : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400'
                  }`}>
                    {openIndex === index ? (
                      <FaChevronUp className="w-4 h-4" />
                    ) : (
                      <FaChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out ${
                    openIndex === index
                      ? 'max-h-96 opacity-100'
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-6">
                    <div className="bg-teal-50 dark:bg-neutral-900/50 rounded-lg p-5 border-l-4 border-teal-500">
                      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-neutral-100 dark:bg-neutral-800 py-16">
        <div className="container mx-auto px-5">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg p-8 md:p-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 dark:text-white mb-6 text-center">
                Rychlá nápověda
              </h2>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Link to="/courses" className="group text-center p-6 rounded-xl bg-teal-50 dark:bg-teal-900/20 hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-teal-500">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">📚</div>
                  <h3 className="font-semibold text-lg text-neutral-800 dark:text-white mb-2">
                    Začínáme
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Naučte se orientovat na platformě
                  </p>
                </Link>
                <Link to="/support" className="group text-center p-6 rounded-xl bg-cyan-50 dark:bg-cyan-900/20 hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-cyan-500">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">💳</div>
                  <h3 className="font-semibold text-lg text-neutral-800 dark:text-white mb-2">
                    Platby a účtování
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Informace o cenách a vratках
                  </p>
                </Link>
                <Link to="/dashboard/my-learning" className="group text-center p-6 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-emerald-500">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">🎓</div>
                  <h3 className="font-semibold text-lg text-neutral-800 dark:text-white mb-2">
                    Certifikáty
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Informace o dokončení kurzu
                  </p>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white py-16">
        <div className="container mx-auto px-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Stále máte otázky?</h2>
            <p className="text-lg text-white/90 mb-8">
              Nenašli jste odpověď, kterou hledáte? Kontaktujte náš tým podpory.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/support"
                className="bg-white text-teal-600 font-semibold px-8 py-3 rounded-lg hover:bg-neutral-100 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Kontaktovat podporu
              </Link>
              <Link
                to="/courses"
                className="bg-transparent border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white hover:text-teal-600 transition-all duration-200"
              >
                Prohlížet kurzy
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
