import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast, ToastContainer } from "react-toastify";
import { FaShieldAlt, FaQrcode, FaKey } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

export default function Setup2FA() {
  const navigate = useNavigate();
  const [qrCode, setQrCode] = useState<string>("");
  const [secret, setSecret] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Musíte být přihlášeni");
        navigate("/auth/login");
        return;
      }

      const factors = await supabase.auth.mfa.listFactors();
      if (factors.data?.totp && factors.data.totp.length > 0) {
        toast.info("2FA je již aktivní");
        navigate("/dashboard");
      }
    };

    checkAuth();
  }, [navigate]);

  const enrollMFA = async () => {
    setIsEnrolling(true);
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'Authenticator App',
      });

      if (error) throw error;

      if (data) {
        setQrCode(data.totp.qr_code);
        setSecret(data.totp.secret);
        toast.success("Naskenujte QR kód ve své autentizační aplikaci");
      }
    } catch (error: any) {
      console.error("MFA enrollment error:", error);
      toast.error("Nepodařilo se nastavit 2FA");
    } finally {
      setIsEnrolling(false);
    }
  };

  const verifyMFA = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const factors = await supabase.auth.mfa.listFactors();
      if (!factors.data?.totp || factors.data.totp.length === 0) {
        throw new Error("Nejprve nastavte 2FA");
      }

      const factorId = factors.data.totp[0].id;

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

      toast.success("2FA byla úspěšně aktivována!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("MFA verification error:", error);
      if (error.message.includes("Invalid code")) {
        toast.error("Neplatný kód. Zkuste to znovu.");
      } else {
        toast.error("Nepodařilo se ověřit 2FA");
      }
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
              Nastavit dvoufaktorovou autentizaci
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Zvyšte zabezpečení svého účtu pomocí 2FA
            </p>
          </div>

          {!qrCode ? (
            <div className="space-y-6">
              <div className="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-6 space-y-4">
                <h3 className="font-semibold text-neutral-800 dark:text-white flex items-center gap-2">
                  <FaKey />
                  Co budete potřebovat:
                </h3>
                <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 mt-1">•</span>
                    Aplikaci pro autentizaci (Google Authenticator, Authy, Microsoft Authenticator)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 mt-1">•</span>
                    Naskenujte QR kód nebo zadejte tajný klíč
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 mt-1">•</span>
                    Zadejte 6místný kód pro ověření
                  </li>
                </ul>
              </div>

              <button
                onClick={enrollMFA}
                disabled={isEnrolling}
                className="w-full button1 font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isEnrolling ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    Nastavování...
                  </div>
                ) : (
                  "Začít nastavení 2FA"
                )}
              </button>

              <button
                onClick={() => navigate("/dashboard")}
                className="w-full bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-white font-semibold py-3 px-4 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-all duration-200"
              >
                Možná později
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white dark:bg-neutral-700 rounded-lg p-6 border-2 border-neutral-200 dark:border-neutral-600">
                <div className="flex items-center gap-2 mb-4">
                  <FaQrcode className="text-teal-500" />
                  <h3 className="font-semibold text-neutral-800 dark:text-white">
                    Krok 1: Naskenujte QR kód
                  </h3>
                </div>

                <div className="bg-white p-4 rounded-lg mb-4">
                  <img
                    src={qrCode}
                    alt="QR Code pro 2FA"
                    className="w-full max-w-xs mx-auto"
                  />
                </div>

                <div className="mt-4">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                    Nebo zadejte tento klíč ručně:
                  </p>
                  <div className="bg-neutral-100 dark:bg-neutral-800 p-3 rounded-lg break-all font-mono text-sm">
                    {secret}
                  </div>
                </div>
              </div>

              <form onSubmit={verifyMFA} className="space-y-4">
                <div>
                  <label
                    htmlFor="code"
                    className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2 flex items-center gap-2"
                  >
                    <FaKey />
                    Krok 2: Zadejte 6místný kód
                  </label>
                  <input
                    id="code"
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    maxLength={6}
                    pattern="\d{6}"
                    className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-800 dark:text-white text-center text-2xl tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    placeholder="000000"
                  />
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                    Zadejte kód zobrazený ve vaší autentizační aplikaci
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
                    "Ověřit a aktivovat 2FA"
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
