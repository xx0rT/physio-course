import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast, ToastContainer } from "react-toastify";
import { FaShieldAlt, FaCheckCircle, FaTimesCircle, FaTrash } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

export default function Security() {
  const navigate = useNavigate();
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRemoving, setIsRemoving] = useState(false);
  const [factorId, setFactorId] = useState<string>("");

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Musíte být přihlášeni");
        navigate("/auth/login");
        return;
      }

      const factors = await supabase.auth.mfa.listFactors();

      if (factors.data?.totp && factors.data.totp.length > 0) {
        setIs2FAEnabled(true);
        setFactorId(factors.data.totp[0].id);
      }
    } catch (error) {
      console.error("Auth check error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove2FA = async () => {
    if (!window.confirm("Opravdu chcete deaktivovat dvoufaktorovou autentizaci? Váš účet bude méně zabezpečený.")) {
      return;
    }

    setIsRemoving(true);

    try {
      const { error } = await supabase.auth.mfa.unenroll({
        factorId,
      });

      if (error) throw error;

      toast.success("2FA byla úspěšně deaktivována");
      setIs2FAEnabled(false);
      setFactorId("");
    } catch (error: any) {
      console.error("Remove 2FA error:", error);
      toast.error("Nepodařilo se deaktivovat 2FA");
    } finally {
      setIsRemoving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-20 px-5">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-800 dark:text-white mb-2">
            Nastavení zabezpečení
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Spravujte zabezpečení svého účtu
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg p-8 border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-700 rounded-lg">
                  <FaShieldAlt className="text-2xl text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-neutral-800 dark:text-white mb-2">
                    Dvoufaktorová autentizace (2FA)
                  </h2>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                    Přidejte další vrstvu zabezpečení ke svému účtu pomocí autentizační aplikace.
                  </p>

                  <div className="flex items-center gap-2 mb-4">
                    {is2FAEnabled ? (
                      <>
                        <FaCheckCircle className="text-green-500 text-xl" />
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          Aktivní
                        </span>
                      </>
                    ) : (
                      <>
                        <FaTimesCircle className="text-neutral-400 text-xl" />
                        <span className="font-semibold text-neutral-500 dark:text-neutral-400">
                          Neaktivní
                        </span>
                      </>
                    )}
                  </div>

                  {!is2FAEnabled && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-4">
                      <p className="text-sm text-amber-800 dark:text-amber-200">
                        <strong>Doporučení:</strong> Aktivujte 2FA pro zvýšení zabezpečení vašeho účtu.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              {is2FAEnabled ? (
                <button
                  onClick={handleRemove2FA}
                  disabled={isRemoving}
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isRemoving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      Odstraňování...
                    </>
                  ) : (
                    <>
                      <FaTrash />
                      Deaktivovat 2FA
                    </>
                  )}
                </button>
              ) : (
                <Link
                  to="/auth/setup-2fa"
                  className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <FaShieldAlt />
                  Aktivovat 2FA
                </Link>
              )}

              <Link
                to="/dashboard"
                className="bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-white font-semibold py-3 px-6 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-all duration-200"
              >
                Zpět na dashboard
              </Link>
            </div>
          </div>

          <div className="bg-neutral-100 dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700">
            <h3 className="font-semibold text-neutral-800 dark:text-white mb-4">
              Jak funguje 2FA?
            </h3>
            <ol className="space-y-3 text-sm text-neutral-600 dark:text-neutral-400">
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-teal-500 text-white rounded-full text-xs font-bold flex-shrink-0">
                  1
                </span>
                <span>
                  Stáhněte si autentizační aplikaci (Google Authenticator, Authy, Microsoft Authenticator)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-teal-500 text-white rounded-full text-xs font-bold flex-shrink-0">
                  2
                </span>
                <span>
                  Naskenujte QR kód pomocí aplikace nebo zadejte tajný klíč ručně
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-teal-500 text-white rounded-full text-xs font-bold flex-shrink-0">
                  3
                </span>
                <span>
                  Při každém přihlášení zadejte 6místný kód z aplikace
                </span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
