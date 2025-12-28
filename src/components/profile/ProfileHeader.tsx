import { useState, useRef, memo } from "react";
import { motion } from "framer-motion";
import { Camera, MapPin, Globe, Edit3 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "react-toastify";

interface ProfileHeaderProps {
  user: any;
  profile: {
    bio?: string;
    profile_picture_url?: string;
    banner_image_url?: string;
    location?: string;
    website?: string;
  };
  onProfileUpdate: () => void;
}

const ProfileHeader = memo(({ user, profile, onProfileUpdate }: ProfileHeaderProps) => {
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bio, setBio] = useState(profile.bio || "");
  const [uploading, setUploading] = useState(false);
  const profilePicRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File, type: 'profile' | 'banner') => {
    if (!user) return;

    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${user._id}-${type}-${Date.now()}.${fileExt}`;
      const filePath = `${type}s/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('user-uploads')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('user-uploads')
        .getPublicUrl(filePath);

      const updateField = type === 'profile' ? 'profile_picture_url' : 'banner_image_url';

      const { error: updateError } = await supabase
        .from('user_profiles_extended')
        .update({ [updateField]: publicUrl })
        .eq('user_id', user._id);

      if (updateError) throw updateError;

      toast.success(`${type === 'profile' ? 'Profile picture' : 'Banner'} updated successfully!`);
      onProfileUpdate();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleBioSave = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_profiles_extended')
        .update({ bio })
        .eq('user_id', user._id);

      if (error) throw error;

      toast.success('Bio updated successfully!');
      setIsEditingBio(false);
      onProfileUpdate();
    } catch (error) {
      console.error('Error updating bio:', error);
      toast.error('Failed to update bio');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-lg"
    >
      {/* Banner */}
      <div className="relative h-48 md:h-64 bg-gradient-to-r from-purple-500 to-blue-500 overflow-hidden group">
        {profile.banner_image_url && (
          <img
            src={profile.banner_image_url}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        )}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => bannerRef.current?.click()}
          disabled={uploading}
          className="absolute top-4 right-4 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
        >
          <Camera className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
        </motion.button>
        <input
          ref={bannerRef}
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'banner')}
          className="hidden"
        />
      </div>

      {/* Profile Picture */}
      <div className="px-6 md:px-8 pb-6">
        <div className="relative -mt-16 md:-mt-20 mb-4">
          <div className="relative inline-block group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-neutral-900 overflow-hidden bg-gradient-to-br from-purple-500 to-blue-500 shadow-xl"
            >
              {profile.profile_picture_url ? (
                <img
                  src={profile.profile_picture_url}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-4xl md:text-5xl font-bold">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </div>
              )}
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => profilePicRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-2 right-2 bg-white dark:bg-neutral-800 p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
            >
              <Camera className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
            </motion.button>
            <input
              ref={profilePicRef}
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'profile')}
              className="hidden"
            />
          </div>
        </div>

        {/* User Info */}
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 text-lg">
              {user.email}
            </p>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            {isEditingBio ? (
              <div className="space-y-2">
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  className="w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={3}
                  maxLength={200}
                />
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleBioSave}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                  >
                    Save
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setIsEditingBio(false);
                      setBio(profile.bio || "");
                    }}
                    className="px-4 py-2 bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg font-medium hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2 group">
                <p className="text-neutral-700 dark:text-neutral-300 flex-1">
                  {profile.bio || "No bio yet. Click to add one!"}
                </p>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsEditingBio(true)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
                >
                  <Edit3 className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                </motion.button>
              </div>
            )}
          </div>

          {/* Location & Website */}
          <div className="flex flex-wrap gap-4 text-sm text-neutral-600 dark:text-neutral-400">
            {profile.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                <span>{profile.location}</span>
              </div>
            )}
            {profile.website && (
              <div className="flex items-center gap-1.5">
                <Globe className="w-4 h-4" />
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  {profile.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

ProfileHeader.displayName = 'ProfileHeader';

export default ProfileHeader;
