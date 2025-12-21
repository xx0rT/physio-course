import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/authProvider";
import { toast } from "react-toastify";
import { FaGoogle } from "react-icons/fa";

export default function Register() {
  const navigate = useNavigate();
  const { user, register, signInWithGoogle } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Hesla se neshodují!");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Heslo musí mít alespoň 6 znaků!");
      return;
    }

    setIsLoading(true);

    try {
      await register(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.password
      );
      setEmailSent(true);
      toast.success("Účet byl úspěšně vytvořen! Zkontrolujte svůj e-mail.");
    } catch (error: any) {
      console.error("Registration error:", error);
      const errorMessage = error?.message || "Registrace selhala. Zkuste to znovu.";

      if (errorMessage.includes("User already registered")) {
        toast.error("Tento e-mail je již registrován.");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5 py-20 bg-gradient-to-br from-teal-50 to-coral-50 dark:from-neutral-900 dark:to-neutral-800">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-700 rounded-full mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-neutral-800 dark:text-white mb-4">
                Ověřte svůj e-mail
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                Odeslali jsme ověřovací e-mail na adresu <strong>{formData.email}</strong>
              </p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-8">
                Klikněte na odkaz v e-mailu pro dokončení registrace. Pokud e-mail nevidíte, zkontrolujte složku spam.
              </p>
              <Link
                to="/auth/login"
                className="inline-block w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Pokračovat na přihlášení
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-20 bg-gradient-to-br from-teal-50 to-coral-50 dark:from-neutral-900 dark:to-neutral-800">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-neutral-800 dark:text-white mb-2">
              Registrace
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Vytvořte si účet v Dires Fyzio
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                >
                  Jméno
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="Jan"
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                >
                  Příjmení
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="Novák"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
              >
                E-mailová adresa
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="vas-email@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
              >
                Heslo
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
              >
                Potvrzení hesla
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isLoading ? "Vytváření účtu..." : "Zaregistrovat se"}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-300 dark:border-neutral-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
                  Nebo pokračovat s
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={async () => {
                setIsGoogleLoading(true);
                try {
                  await signInWithGoogle();
                } catch (error: any) {
                  toast.error("Registrace pomocí Google selhala");
                  setIsGoogleLoading(false);
                }
              }}
              disabled={isLoading || isGoogleLoading}
              className="mt-4 w-full flex items-center justify-center gap-3 bg-white dark:bg-neutral-700 border-2 border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-white font-semibold py-3 px-4 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {isGoogleLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-neutral-600"></div>
                  Registrace...
                </div>
              ) : (
                <>
                  <FaGoogle className="text-xl" />
                  Zaregistrovat se pomocí Google
                </>
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-neutral-600 dark:text-neutral-400">
              Už máte účet?{" "}
              <Link
                to="/auth/login"
                className="text-teal-500 hover:text-teal-600 font-semibold"
              >
                Přihlásit se
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
