import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authProvider";
import { toast, ToastContainer } from "react-toastify";
import { FaLock, FaCheckCircle } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { updatePassword } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get("access_token");

    if (!accessToken) {
      toast.error("Neplatný nebo vypršelý odkaz pro obnovení hesla.");
      setTimeout(() => navigate("/auth/login"), 3000);
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Hesla se neshodují!");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Heslo musí mít alespoň 6 znaků!");
      return;
    }

    setIsLoading(true);

    try {
      await updatePassword(newPassword);
      toast.success("Heslo bylo úspěšně změněno!");
      setTimeout(() => navigate("/auth/login"), 2000);
    } catch (error: any) {
      console.error("Password update error:", error);
      toast.error("Změna hesla selhala. Zkuste to znovu.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-20" style={{ background: 'linear-gradient(135deg, rgba(112, 79, 230, 0.1) 0%, rgba(30, 42, 71, 0.1) 100%)' }}>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl p-8 border border-neutral-200 dark:border-neutral-700">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-700 rounded-full mb-4">
              <FaCheckCircle className="text-3xl text-white" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-800 dark:text-white mb-2">
              Obnovit heslo
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Zadejte své nové heslo
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="new-password"
                className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2"
              >
                Nové heslo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaLock className="text-neutral-400" />
                </div>
                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2"
              >
                Potvrzení hesla
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaLock className="text-neutral-400" />
                </div>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                  Ukládání...
                </div>
              ) : (
                "Změnit heslo"
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-sm text-neutral-500 dark:text-neutral-400">
          Po změně hesla budete přesměrováni na přihlašovací stránku
        </p>
      </div>
    </div>
  );
}
