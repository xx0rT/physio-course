import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Layout, Check, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "react-toastify";

interface ProfileCustomizationProps {
  userId: string;
  currentTheme: string;
  currentColorScheme: any;
  currentLayout: string;
  onUpdate: () => void;
}

const colorSchemes = [
  {
    name: "Purple Dream",
    colors: { primary: "#8b5cf6", secondary: "#06b6d4" }
  },
  {
    name: "Ocean Blue",
    colors: { primary: "#0ea5e9", secondary: "#06b6d4" }
  },
  {
    name: "Forest Green",
    colors: { primary: "#10b981", secondary: "#059669" }
  },
  {
    name: "Sunset Orange",
    colors: { primary: "#f59e0b", secondary: "#ef4444" }
  },
  {
    name: "Rose Pink",
    colors: { primary: "#ec4899", secondary: "#f43f5e" }
  },
  {
    name: "Midnight",
    colors: { primary: "#6366f1", secondary: "#8b5cf6" }
  }
];

const layouts = [
  { id: "grid", name: "Grid", description: "Card-based grid layout" },
  { id: "list", name: "List", description: "Vertical list layout" },
  { id: "compact", name: "Compact", description: "Dense information view" }
];

const ProfileCustomization = memo(({
  userId,
  currentTheme,
  currentColorScheme,
  currentLayout,
  onUpdate
}: ProfileCustomizationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedColors, setSelectedColors] = useState(currentColorScheme);
  const [selectedLayout, setSelectedLayout] = useState(currentLayout);

  const handleSave = async () => {
    try {
      setSaving(true);

      const { error } = await supabase
        .from('user_profiles_extended')
        .update({
          color_scheme: selectedColors,
          layout_preference: selectedLayout
        })
        .eq('user_id', userId);

      if (error) throw error;

      toast.success('Preferences saved successfully!');
      onUpdate();
      setIsOpen(false);
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300"
      >
        <Palette className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl z-50 max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  Customize Profile
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="p-6 space-y-8">
                {/* Color Schemes */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Palette className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                      Color Scheme
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {colorSchemes.map((scheme, index) => (
                      <motion.button
                        key={scheme.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedColors(scheme.colors)}
                        className={`relative p-4 rounded-xl border-2 transition-all ${
                          selectedColors.primary === scheme.colors.primary
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                            : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className="w-6 h-6 rounded-full shadow-md"
                            style={{ backgroundColor: scheme.colors.primary }}
                          />
                          <div
                            className="w-6 h-6 rounded-full shadow-md"
                            style={{ backgroundColor: scheme.colors.secondary }}
                          />
                        </div>
                        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          {scheme.name}
                        </p>
                        {selectedColors.primary === scheme.colors.primary && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2 bg-purple-600 text-white p-1 rounded-full"
                          >
                            <Check className="w-3 h-3" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Layout Preference */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Layout className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                      Layout Style
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {layouts.map((layout, index) => (
                      <motion.button
                        key={layout.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedLayout(layout.id)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                          selectedLayout === layout.id
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                            : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                        }`}
                      >
                        <div className="text-left">
                          <p className="font-semibold text-neutral-900 dark:text-white">
                            {layout.name}
                          </p>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            {layout.description}
                          </p>
                        </div>
                        {selectedLayout === layout.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="bg-purple-600 text-white p-1 rounded-full"
                          >
                            <Check className="w-4 h-4" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsOpen(false)}
                    className="px-6 bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 py-3 rounded-xl font-semibold hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
});

ProfileCustomization.displayName = 'ProfileCustomization';

export default ProfileCustomization;
