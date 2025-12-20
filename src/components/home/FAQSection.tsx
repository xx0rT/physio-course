import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Jak mohu začít s online kurzy?",
      answer: "Začít je snadné! Stačí si vytvořit bezplatný účet, procházet naši širokou nabídku kurzů a zapsat se do těch, které vás zajímají. Můžete začít učit se okamžitě po zápisu."
    },
    {
      question: "Jsou kurzy certifikované?",
      answer: "Ano, po úspěšném dokončení kurzu obdržíte certifikát o absolvování, který můžete sdílet na svém LinkedIn profilu nebo přidat do svého životopisu."
    },
    {
      question: "Mohu se učit ve vlastním tempu?",
      answer: "Absolutně! Všechny naše kurzy jsou navrženy pro flexibilní učení. Můžete studovat kdykoli a kdekoli, v tempu, které vám vyhovuje."
    },
    {
      question: "Jaká je cenová politika?",
      answer: "Nabízíme jak bezplatné kurzy, tak prémiové kurzy. Můžete si zakoupit jednotlivé kurzy nebo si pořídit prémiové členství pro neomezený přístup ke všem kurzům."
    },
    {
      question: "Mohou instruktoři vytvářet vlastní kurzy?",
      answer: "Ano! Pokud máte odborné znalosti, můžete se stát instruktorem a vytvářet vlastní kurzy. Stačí se přihlásit jako instruktor a začít sdílet své znalosti se studenty po celém světě."
    },
    {
      question: "Je k dispozici technická podpora?",
      answer: "Samozřejmě! Náš tým podpory je k dispozici 24/7, aby vám pomohl s jakýmikoli technickými problémy nebo dotazy ohledně kurzů."
    },
    {
      question: "Mohu získat zpět peníze, pokud nejsem spokojený?",
      answer: "Ano, nabízíme 30denní záruku vrácení peněz. Pokud nejste spokojeni s kurzem, můžete požádat o vrácení peněz během 30 dnů od nákupu."
    },
    {
      question: "Jak funguje systém úrovní a achievementů?",
      answer: "Získáváte XP body dokončováním lekcí a kurzů. S každou úrovní odemykáte nové achievementy a funkce. Vaše progrese je sledována v dashboardu, kde můžete vidět své statistiky a pokrok."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-neutral-100 dark:bg-neutral-800">
      <div className="container mx-auto px-5">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-800 dark:text-white mb-4">
            Často kladené otázky
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Máte otázky? Máme odpovědi! Prohlédněte si nejčastější dotazy našich studentů.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white dark:bg-neutral-900 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
              >
                <h3 className="text-lg font-semibold text-neutral-800 dark:text-white pr-4">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0 text-purple-600 dark:text-purple-400">
                  {openIndex === index ? (
                    <FaChevronUp className="text-xl" />
                  ) : (
                    <FaChevronDown className="text-xl" />
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
                <div className="px-6 pb-5 text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            Nenašli jste odpověď na svou otázku?
          </p>
          <a
            href="/support"
            className="button1 inline-block px-8 py-3 rounded-lg font-semibold transition-all"
          >
            Kontaktujte podporu
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
