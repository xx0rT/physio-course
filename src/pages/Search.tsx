import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authProvider";
import { toast } from "react-toastify";

export default function Search() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      toast.error("Musíte se přihlásit pro vyhledávání!");
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-5 py-20">
      <h1 className="text-3xl font-bold text-neutral-800 dark:text-white">
        Search Page
      </h1>
      <p className="mt-4 text-neutral-600 dark:text-neutral-400">
        This page is under construction.
      </p>
    </div>
  );
}
