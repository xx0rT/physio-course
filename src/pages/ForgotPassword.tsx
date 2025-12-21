import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast, ToastContainer } from "react-toastify";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      setEmailSent(true);
      toast.success("E-mail pro obnovení hesla byl odeslán!");
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast.error("Nepodařilo se odeslat e-mail. Zkuste to znovu.");
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5 py-20" style={{ background: 'linear-gradient(135deg, rgba(112, 79, 230, 0.1) 0%, rgba(30, 42, 71, 0.1) 100%)' }}>
        <ToastContainer position="top-right" autoClose={3000} />

        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl p-8 border border-neutral-200 dark:border-neutral-700">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-700 rounded-full mb-4">
                <FaEnvelope className="text-3xl text-white" />
              </div>
              <h1 className="text-3xl font-bold text-neutral-800 dark:text-white mb-4">
                Zkontrolujte svůj e-mail
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                Odeslali jsme vám e-mail s odkazem pro obnovení hesla na adresu <strong>{email}</strong>
              </p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-8">
                Pokud e-mail nevidíte, zkontrolujte složku spam nebo nevyžádané pošty.
              </p>
              <Link
                to="/auth/login"
                className="inline-flex items-center gap-2 text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-semibold transition-colors"
              >
                <FaArrowLeft />
                Zpět na přihlášení
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-20" style={{ background: 'linear-gradient(135deg, rgba(112, 79, 230, 0.1) 0%, rgba(30, 42, 71, 0.1) 100%)' }}>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl p-8 border border-neutral-200 dark:border-neutral-700">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-700 rounded-full mb-4">
              <FaEnvelope className="text-3xl text-white" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-800 dark:text-white mb-2">
              Zapomenuté heslo
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Zadejte svůj e-mail a my vám pošleme odkaz pro obnovení hesla
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2"
              >
                E-mailová adresa
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaEnvelope className="text-neutral-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full button1 font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  Odesílání...
                </div>
              ) : (
                "Odeslat odkaz pro obnovení"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/auth/login"
              className="inline-flex items-center gap-2 text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-semibold transition-colors"
            >
              <FaArrowLeft />
              Zpět na přihlášení
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
