import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast, ToastContainer } from "react-toastify";
import { FaShieldAlt, FaArrowLeft } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

export default function Verify2FA() {
  const navigate = useNavigate();
  const location = useLocation();
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [factorId, setFactorId] = useState<string>("");

  useEffect(() => {
    const checkFactors = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          toast.error("Musíte se nejprve přihlásit");
          navigate("/auth/login");
          return;
        }

        const factors = await supabase.auth.mfa.listFactors();

        if (!factors.data?.totp || factors.data.totp.length === 0) {
          navigate("/dashboard");
          return;
        }

        setFactorId(factors.data.totp[0].id);
      } catch (error) {
        console.error("Factor check error:", error);
        navigate("/auth/login");
      }
    };

    checkFactors();
  }, [navigate]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!factorId) {
      toast.error("2FA není nastavena");
      return;
    }

    setIsLoading(true);

    try {
      const challenge = await supabase.auth.mfa.challenge({
        factorId,
      });

      if (challenge.error) throw challenge.error;

      const verify = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.data.id,
        code: verificationCode,
      });

      if (verify.error) throw verify.error;

      toast.success("Ověření proběhlo úspěšně!");

      const redirectTo = (location.state as any)?.from || "/dashboard";
      navigate(redirectTo);
    } catch (error: any) {
      console.error("2FA verification error:", error);

      if (error.message.includes("Invalid code") || error.message.includes("invalid")) {
        toast.error("Neplatný kód. Zkuste to znovu.");
      } else if (error.message.includes("expired")) {
        toast.error("Kód vypršel. Zadejte nový kód.");
      } else {
        toast.error("Ověření selhalo. Zkuste to znovu.");
      }

      setVerificationCode("");
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
              <FaShieldAlt className="text-3xl text-white" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-800 dark:text-white mb-2">
              Dvoufaktorové ověření
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Zadejte 6místný kód z vaší autentizační aplikace
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label
                htmlFor="code"
                className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2"
              >
                Ověřovací kód
              </label>
              <input
                id="code"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                maxLength={6}
                pattern="\d{6}"
                autoComplete="one-time-code"
                autoFocus
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-800 dark:text-white text-center text-2xl tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="000000"
              />
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 text-center">
                Kód se obnoví každých 30 sekund
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || verificationCode.length !== 6}
              className="w-full button1 font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  Ověřování...
                </div>
              ) : (
                "Ověřit"
              )}
            </button>
          </form>

          <div className="mt-6">
            <Link
              to="/auth/login"
              className="inline-flex items-center gap-2 text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-semibold transition-colors"
            >
              <FaArrowLeft />
              Zpět na přihlášení
            </Link>
          </div>

          <div className="mt-6 p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              <strong>Problém s přístupem?</strong>
              <br />
              Pokud nemáte přístup ke své autentizační aplikaci, kontaktujte podporu.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
