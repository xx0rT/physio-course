import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <img
        src="/error.png"
        alt="Not Found"
        className="w-64 h-64 mb-8"
      />
      <h1 className="text-4xl font-bold text-neutral-800 dark:text-white mb-4">
        Page Not Found
      </h1>
      <p className="text-neutral-600 dark:text-neutral-400 mb-8">
        The page you're looking for doesn't exist.
      </p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
      >
        Go Back Home
      </button>
    </div>
  );
}
