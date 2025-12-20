import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/authProvider";
import { FaDownload, FaShare, FaCertificate, FaTrophy } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

interface Certificate {
  id: string;
  certificate_number: string;
  issue_date: string;
  completion_date: string;
  certificate_url: string;
  courses: {
    title: string;
    thumbnail: string;
  };
}

export default function CertificatesSection() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadCertificates();
    }
  }, [user]);

  const loadCertificates = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('certificates')
      .select(`
        *,
        courses (
          title,
          thumbnail
        )
      `)
      .eq('user_id', user._id)
      .order('issue_date', { ascending: false });

    if (error) {
      console.error('Error loading certificates:', error);
    } else {
      setCertificates(data || []);
    }
    setLoading(false);
  };

  const handleShare = (cert: Certificate) => {
    if (navigator.share) {
      navigator.share({
        title: `Certifikát - ${cert.courses.title}`,
        text: `Získal(a) jsem certifikát z kurzu ${cert.courses.title}!`,
        url: cert.certificate_url || window.location.href
      });
    } else {
      navigator.clipboard.writeText(cert.certificate_url || window.location.href);
      toast.success("Odkaz zkopírován do schránky!");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (certificates.length === 0) {
    return (
      <div className="text-center py-12">
        <FaCertificate className="text-6xl text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
          Zatím žádné certifikáty
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400">
          Dokončete kurz a získejte svůj první certifikát!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FaTrophy className="text-3xl text-yellow-500" />
          <div>
            <h2 className="text-2xl font-bold text-neutral-800 dark:text-white">
              Vaše certifikáty
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Celkem: {certificates.length} certifikátů
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert, index) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-6 border-2 border-yellow-200 dark:border-yellow-800 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <FaCertificate className="text-3xl text-yellow-600 dark:text-yellow-400" />
              <span className="text-xs font-mono bg-white dark:bg-neutral-800 px-2 py-1 rounded">
                #{cert.certificate_number}
              </span>
            </div>

            <h3 className="text-lg font-bold text-neutral-800 dark:text-white mb-2">
              {cert.courses.title}
            </h3>

            <div className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1 mb-4">
              <p>Vydáno: {new Date(cert.issue_date).toLocaleDateString('cs-CZ')}</p>
              <p>Dokončeno: {new Date(cert.completion_date).toLocaleDateString('cs-CZ')}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.open(cert.certificate_url, '_blank')}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <FaDownload />
                Stáhnout
              </button>
              <button
                onClick={() => handleShare(cert)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <FaShare />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
