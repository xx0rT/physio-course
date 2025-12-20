import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  price_info: string;
  display_order: number;
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-5 py-20 mt-20">
        <div className="text-center">
          <p className="text-neutral-600 dark:text-neutral-400">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-neutral-900 dark:to-neutral-800">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20 mt-16">
        <div className="container mx-auto px-5 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl font-bold mb-6"
          >
            Our Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl max-w-3xl mx-auto"
          >
            Discover the comprehensive learning experience we offer to help you achieve your educational goals
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-5 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
            >
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-400 to-blue-500">
                <img
                  src={service.icon}
                  alt={service.title}
                  className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold text-neutral-800 dark:text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4 leading-relaxed">
                  {service.description}
                </p>

                <div className="space-y-2 mb-4">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
                  <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                    {service.price_info}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-5 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of students already learning with our platform
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => window.location.href = '/courses'}
              className="bg-white text-purple-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Browse Courses
            </button>
            <button
              onClick={() => window.location.href = '/auth/register'}
              className="bg-transparent border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white hover:text-purple-600 transition-all duration-200"
            >
              Sign Up Free
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-5 py-16">
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-neutral-800 dark:text-white mb-6 text-center">
            Why Choose Our Platform?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🎯</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-1">
                    Quality Content
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    All courses are carefully curated and regularly updated to ensure you learn the latest skills
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">⚡</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-1">
                    Fast Learning
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Learn efficiently with our structured curriculum and practical exercises
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🌟</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-1">
                    Expert Support
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Get help when you need it from our experienced instructors and community
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">💼</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-1">
                    Career Growth
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Gain skills that employers are looking for and advance your career
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🤝</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-1">
                    Community
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Join a vibrant community of learners and build valuable connections
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📱</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-1">
                    Mobile Learning
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Learn on the go with our mobile-friendly platform
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
