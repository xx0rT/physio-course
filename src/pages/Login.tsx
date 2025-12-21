import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/authProvider";
import { toast, ToastContainer } from "react-toastify";
import { FaEnvelope, FaLock, FaUserCircle } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const navigate = useNavigate();
  const { user, login, resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success("Úspěšně přihlášeno!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage = error?.message || "Přihlášení selhalo.";

      if (errorMessage.includes("Invalid login credentials")) {
        toast.error("Neplatné přihlašovací údaje. Zkontrolujte e-mail a heslo.");
      } else if (errorMessage.includes("Email not confirmed")) {
        toast.error("E-mail nebyl potvrzen. Zkontrolujte si schránku.");
      } else {
        toast.error("Přihlášení selhalo. Zkontrolujte své přihlašovací údaje.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResetting(true);

    try {
      await resetPassword(resetEmail);
      toast.success("E-mail pro obnovení hesla byl odeslán! Zkontrolujte si schránku.");
      setShowForgotPassword(false);
      setResetEmail("");
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast.error("Nepodařilo se odeslat e-mail pro obnovení hesla. Zkuste to znovu.");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-20" style={{ background: 'linear-gradient(135deg, rgba(112, 79, 230, 0.1) 0%, rgba(30, 42, 71, 0.1) 100%)' }}>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl p-8 border border-neutral-200 dark:border-neutral-700">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-700 rounded-full mb-4">
              <FaUserCircle className="text-3xl text-white" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-800 dark:text-white mb-2">
              Vítejte zpět
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Přihlaste se do svého účtu Dires Fyzio
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

            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300"
                >
                  Heslo
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-semibold transition-colors"
                >
                  Zapomněli jste heslo?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaLock className="text-neutral-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
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
                  Přihlašování...
                </div>
              ) : (
                "Přihlásit se"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-neutral-600 dark:text-neutral-400">
              Nemáte účet?{" "}
              <Link
                to="/auth/register"
                className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-semibold transition-colors"
              >
                Zaregistrovat se
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center mt-6 text-sm text-neutral-500 dark:text-neutral-400">
          Přihlášením souhlasíte s našimi podmínkami služby a zásadami ochrany osobních údajů
        </p>
      </div>

      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-5">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-neutral-200 dark:border-neutral-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-neutral-800 dark:text-white">
                Obnovit heslo
              </h2>
              <button
                onClick={() => setShowForgotPassword(false)}
                className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors"
              >
                <IoClose size={24} />
              </button>
            </div>

            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Zadejte svou e-mailovou adresu a my vám pošleme odkaz pro obnovení hesla.
            </p>

            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label
                  htmlFor="reset-email"
                  className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2"
                >
                  E-mailová adresa
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaEnvelope className="text-neutral-400" />
                  </div>
                  <input
                    id="reset-email"
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isResetting}
                className="w-full button1 font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isResetting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    Odesílání...
                  </div>
                ) : (
                  "Odeslat odkaz pro obnovení"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
