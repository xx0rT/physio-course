import { FaCamera, FaEdit } from "react-icons/fa";
import { useAuth } from "@/context/authProvider";
import { useNavigate } from "react-router-dom";

export default function ProfileOverview() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Dobré ráno";
    if (hour < 18) return "Dobré odpoledne";
    return "Dobrý večer";
  };

  const getMotivationalQuote = () => {
    const quotes = [
      "Vzdělání je nejsilnější zbraň, kterou můžete použít ke změně světa.",
      "Čím více se učíte, tím více roste vaše schopnost učit se.",
      "Každý den je příležitost naučit se něco nového.",
      "Úspěch je součet malých úsilí opakovaných den za dnem.",
      "Investice do znalostí přináší nejlepší úrok."
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  return (
    <div className="bg-gradient-to-br from-blue-600 to-cyan-500 dark:from-blue-700 dark:to-cyan-600 rounded-2xl p-8 text-white shadow-xl">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl font-bold border-4 border-white/40">
            {user?.profile ? (
              <img
                src={user.profile}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span>{user?.firstName?.[0]}{user?.lastName?.[0]}</span>
            )}
          </div>
          <button className="absolute bottom-0 right-0 bg-white text-blue-600 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
            <FaCamera />
          </button>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {getGreeting()}, {user?.firstName}!
          </h1>
          <p className="text-lg opacity-90 mb-1">
            {user?.title || 'Student'} • {user?.role === 'instructor' ? 'Instruktor' : 'Účastník'}
          </p>
          <p className="text-sm opacity-80 italic mt-3 max-w-2xl">
            "{getMotivationalQuote()}"
          </p>
        </div>

        <button
          onClick={() => navigate('/dashboard/settings')}
          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-xl flex items-center gap-2 transition-all"
        >
          <FaEdit />
          <span>Upravit profil</span>
        </button>
      </div>

      <div className="mt-6 pt-6 border-t border-white/20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold">Aktivní</div>
            <div className="text-sm opacity-80">Status</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold">{user?.email}</div>
            <div className="text-sm opacity-80">Email</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold">
              {new Date().toLocaleDateString('cs-CZ')}
            </div>
            <div className="text-sm opacity-80">Dnešní datum</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold">Pokročilý</div>
            <div className="text-sm opacity-80">Úroveň</div>
          </div>
        </div>
      </div>
    </div>
  );
}
