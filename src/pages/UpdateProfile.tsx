import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authProvider";
import { supabase } from "@/lib/supabase";
import { toast } from "react-toastify";
import { User, Mail, Phone, Calendar, FileText, Save, Camera, Loader2 } from "lucide-react";

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  bio: string | null;
  title: string | null;
  phone: string | null;
  date_of_birth: string | null;
  profile_picture: string | null;
  social_links: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  } | null;
}

export default function UpdateProfile() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [profile, setProfile] = useState<UserProfile>({
    id: "",
    first_name: "",
    last_name: "",
    bio: "",
    title: "",
    phone: "",
    date_of_birth: "",
    profile_picture: "",
    social_links: {
      facebook: "",
      instagram: "",
      linkedin: "",
      twitter: "",
    },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth/login");
      return;
    }

    if (user) {
      loadProfile();
    }
  }, [user, authLoading, navigate]);

  const loadProfile = async () => {
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      if (authError || !authUser) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", authUser.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile({
          id: data.id,
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          bio: data.bio || "",
          title: data.title || "",
          phone: data.phone || "",
          date_of_birth: data.date_of_birth || "",
          profile_picture: data.profile_picture || "",
          social_links: data.social_links || {
            facebook: "",
            instagram: "",
            linkedin: "",
            twitter: "",
          },
        });
      }
    } catch (error: any) {
      if (error?.message !== "Auth session missing!") {
        console.error("Error loading profile:", error);
        toast.error("Failed to load profile");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setProfile((prev) => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [platform]: value,
      },
    }));
  };

  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }

    setUploading(true);

    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      if (authError || !authUser) {
        toast.error("Authentication required");
        setUploading(false);
        return;
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${authUser.id}-${Date.now()}.${fileExt}`;
      const filePath = `profile-pictures/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      setProfile((prev) => ({
        ...prev,
        profile_picture: publicUrl,
      }));

      toast.success("Profile picture uploaded successfully");
    } catch (error: any) {
      if (error?.message !== "Auth session missing!") {
        console.error("Error uploading profile picture:", error);
        toast.error("Failed to upload profile picture");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        toast.error("Authentication required");
        return;
      }

      const { error } = await supabase
        .from("users")
        .update({
          first_name: profile.first_name || null,
          last_name: profile.last_name || null,
          bio: profile.bio || null,
          title: profile.title || null,
          phone: profile.phone || null,
          date_of_birth: profile.date_of_birth || null,
          profile_picture: profile.profile_picture || null,
          social_links: profile.social_links,
          updated_at: new Date().toISOString(),
        })
        .eq("id", authUser.id);

      if (error) throw error;

      toast.success("Profile updated successfully");
      navigate("/dashboard");
    } catch (error: any) {
      if (error?.message !== "Auth session missing!") {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile");
      }
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-5 py-20 mt-20">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-800 dark:text-white mb-2">
            Update Your <span className="text-teal-500">Profile</span>
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Keep your information up to date
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-neutral-700">
            <h2 className="text-2xl font-semibold text-neutral-800 dark:text-white mb-6">
              Profile Picture
            </h2>

            <div className="flex items-center gap-6">
              <div className="relative">
                {profile.profile_picture ? (
                  <img
                    src={profile.profile_picture}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-teal-500"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                    <User className="w-16 h-16 text-white" />
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="profile-picture"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg cursor-pointer transition-colors"
                >
                  <Camera className="w-5 h-5" />
                  Upload Photo
                </label>
                <input
                  id="profile-picture"
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureUpload}
                  className="hidden"
                  disabled={uploading}
                />
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                  JPG, PNG or GIF (max. 5MB)
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-neutral-700">
            <h2 className="text-2xl font-semibold text-neutral-800 dark:text-white mb-6">
              Personal Information
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    value={profile.first_name || ""}
                    onChange={(e) => handleInputChange("first_name", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-800 dark:text-white"
                    placeholder="Enter your first name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    value={profile.last_name || ""}
                    onChange={(e) => handleInputChange("last_name", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-800 dark:text-white"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Email cannot be changed
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="tel"
                    value={profile.phone || ""}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-800 dark:text-white"
                    placeholder="+420 123 456 789"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Title / Position
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    value={profile.title || ""}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-800 dark:text-white"
                    placeholder="e.g., Physiotherapist"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="date"
                    value={profile.date_of_birth || ""}
                    onChange={(e) => handleInputChange("date_of_birth", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-800 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Bio
              </label>
              <textarea
                value={profile.bio || ""}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-800 dark:text-white resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-neutral-700">
            <h2 className="text-2xl font-semibold text-neutral-800 dark:text-white mb-6">
              Social Links
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Facebook
                </label>
                <input
                  type="url"
                  value={profile.social_links?.facebook || ""}
                  onChange={(e) => handleSocialLinkChange("facebook", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-800 dark:text-white"
                  placeholder="https://facebook.com/yourprofile"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Instagram
                </label>
                <input
                  type="url"
                  value={profile.social_links?.instagram || ""}
                  onChange={(e) => handleSocialLinkChange("instagram", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-800 dark:text-white"
                  placeholder="https://instagram.com/yourprofile"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={profile.social_links?.linkedin || ""}
                  onChange={(e) => handleSocialLinkChange("linkedin", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-800 dark:text-white"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Twitter
                </label>
                <input
                  type="url"
                  value={profile.social_links?.twitter || ""}
                  onChange={(e) => handleSocialLinkChange("twitter", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-800 dark:text-white"
                  placeholder="https://twitter.com/yourprofile"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-4 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="px-8 py-4 border-2 border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 font-semibold rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
