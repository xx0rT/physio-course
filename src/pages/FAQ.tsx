import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiMinus, FiHelpCircle, FiMessageCircle } from "react-icons/fi";

const FAQPage = () => {
  const { t } = useTranslation();
  const faqs = t('faq.questions', { returnObjects: true }) as Array<{ question: string; answer: string }>;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-neutral-900 dark:to-neutral-800">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 mt-16">
        <div className="container mx-auto px-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="flex justify-center mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-6">
                <FiHelpCircle className="w-16 h-16" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-6">
              {t("faq.title")}
            </h1>
            <p className="text-xl text-white/90">
              Find answers to common questions about our platform, courses, and services
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
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white dark:bg-neutral-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-neutral-700"
              >
                <button
                  className="w-full text-left p-6 flex items-center justify-between group transition-all duration-200 hover:bg-gray-50 dark:hover:bg-neutral-750"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={openIndex === index}
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`mt-1 transition-colors duration-200 ${
                      openIndex === index
                        ? 'text-purple-600 dark:text-purple-400'
                        : 'text-gray-400 dark:text-neutral-500'
                    }`}>
                      <FiMessageCircle className="w-6 h-6" />
                    </div>
                    <span className="font-semibold text-lg text-neutral-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors pr-4">
                      {faq.question}
                    </span>
                  </div>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                    openIndex === index
                      ? 'bg-purple-600 text-white rotate-180'
                      : 'bg-gray-200 dark:bg-neutral-700 text-gray-600 dark:text-neutral-400'
                  }`}>
                    {openIndex === index ? (
                      <FiMinus className="w-5 h-5" />
                    ) : (
                      <FiPlus className="w-5 h-5" />
                    )}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {openIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pl-16">
                        <div className="bg-purple-50 dark:bg-neutral-900/50 rounded-lg p-5 border-l-4 border-purple-600">
                          <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16 mt-8">
        <div className="container mx-auto px-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-lg text-white/90 mb-8">
              Can't find the answer you're looking for? Please reach out to our support team.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => window.location.href = '/support'}
                className="bg-white text-purple-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Contact Support
              </button>
              <button
                onClick={() => window.location.href = '/courses'}
                className="bg-transparent border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white hover:text-purple-600 transition-all duration-200"
              >
                Browse Courses
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-5 py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-neutral-800 dark:text-white mb-6 text-center">
              Quick Help Topics
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:shadow-md transition-all duration-200 cursor-pointer">
                <div className="text-3xl mb-3">📚</div>
                <h3 className="font-semibold text-neutral-800 dark:text-white mb-2">
                  Getting Started
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Learn how to navigate the platform
                </p>
              </div>
              <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 hover:shadow-md transition-all duration-200 cursor-pointer">
                <div className="text-3xl mb-3">💳</div>
                <h3 className="font-semibold text-neutral-800 dark:text-white mb-2">
                  Payment & Billing
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Understand pricing and refunds
                </p>
              </div>
              <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20 hover:shadow-md transition-all duration-200 cursor-pointer">
                <div className="text-3xl mb-3">🎓</div>
                <h3 className="font-semibold text-neutral-800 dark:text-white mb-2">
                  Certificates
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Learn about course completion
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
