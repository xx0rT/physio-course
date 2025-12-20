import { useState } from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaPaperPlane } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Support() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success("Vaše zpráva byla úspěšně odeslána! Odpovíme vám co nejdříve.");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      toast.error("Odeslání zprávy se nezdařilo. Zkuste to prosím znovu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 pt-16">
      <ToastContainer position="top-right" autoClose={3000} />

      <div style={{ background: 'linear-gradient(135deg, #704FE6 0%, #1e2a47 100%)' }} className="text-white py-20">
        <div className="container mx-auto px-5 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Kontaktujte nás</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Máte otázky? Jsme tu, abychom vám pomohli. Kontaktujte náš tým podpory.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-5 py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-all">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaEnvelope className="text-3xl text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-neutral-800 dark:text-white mb-2">Email</h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-3">
              Napište nám kdykoli
            </p>
            <a href="mailto:support@eduquest.cz" className="text-purple-600 dark:text-purple-400 hover:underline">
              support@eduquest.cz
            </a>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-all">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaPhone className="text-3xl text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-neutral-800 dark:text-white mb-2">Telefon</h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-3">
              Po-Pá 9:00 - 18:00
            </p>
            <a href="tel:+420123456789" className="text-purple-600 dark:text-purple-400 hover:underline">
              +420 123 456 789
            </a>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-all">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaMapMarkerAlt className="text-3xl text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-neutral-800 dark:text-white mb-2">Adresa</h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-3">
              Navštivte naše kanceláře
            </p>
            <p className="text-purple-600 dark:text-purple-400">
              Praha 1, 110 00<br />Česká republika
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-neutral-800 dark:text-white mb-6">
              Pošlete nám zprávu
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  Jméno a příjmení *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  placeholder="Vaše jméno"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  placeholder="vas.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  Předmět *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                >
                  <option value="">Vyberte předmět</option>
                  <option value="technical">Technický problém</option>
                  <option value="course">Dotaz ke kurzu</option>
                  <option value="payment">Problém s platbou</option>
                  <option value="account">Problém s účtem</option>
                  <option value="instructor">Stát se instruktorem</option>
                  <option value="other">Jiné</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  Zpráva *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
                  placeholder="Napište svou zprávu..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full button1 font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    Odesílání...
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    Odeslat zprávu
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-neutral-800 dark:text-white mb-6">
                Pracovní doba
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <FaClock className="text-2xl text-purple-600 dark:text-purple-400 mt-1" />
                  <div>
                    <h4 className="font-semibold text-neutral-800 dark:text-white mb-2">
                      Podpora zákazníků
                    </h4>
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                      Pondělí - Pátek: 9:00 - 18:00<br />
                      Sobota: 10:00 - 14:00<br />
                      Neděle: Zavřeno
                    </p>
                  </div>
                </div>

                <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
                  <h4 className="font-semibold text-neutral-800 dark:text-white mb-2">
                    Online chat
                  </h4>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                    Dostupný 24/7 pro rychlé dotazy
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl p-8 shadow-lg text-white">
              <h3 className="text-2xl font-bold mb-4">Rychlé odpovědi</h3>
              <p className="mb-6 opacity-90">
                Většina dotazů je zodpovězena do 24 hodin. Pro naléhavé záležitosti nás prosím kontaktujte telefonicky.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-sm">Průměrná doba odpovědi: 4 hodiny</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-sm">Spokojenost zákazníků: 98%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-sm">Dostupnost: 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
