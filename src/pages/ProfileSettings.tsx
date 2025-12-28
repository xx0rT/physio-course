import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authProvider";
import { useTheme } from "next-themes";
import {
  User,
  Settings,
  Shield,
  Bell,
  ChevronRight,
  Sun,
  Moon,
  Home,
  LogOut,
  Save,
  Camera,
  Mail,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase";
import { toast } from "react-toastify";

type SettingsSection = "profile" | "account" | "security" | "notifications";

export default function ProfileSettings() {
  const navigate = useNavigate();
  const { user, loading: authLoading, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [activeSection, setActiveSection] = useState<SettingsSection>("profile");
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    title: "",
    profilePic: "",
    socialLinks: {
      linkedin: "",
      twitter: "",
      github: "",
      facebook: "",
    },
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    courseUpdates: true,
    promotionalEmails: false,
    weeklyDigest: true,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth/login");
      return;
    }

    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        bio: user.bio || "",
        title: user.title || "",
        profilePic: user.profile || "",
        socialLinks: {
          linkedin: user.socialLinks?.linkedin || "",
          twitter: user.socialLinks?.twitter || "",
          github: user.socialLinks?.github || "",
          facebook: user.socialLinks?.facebook || "",
        },
      });
    }
  }, [user, authLoading, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("social.")) {
      const socialKey = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialKey]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("users")
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          full_name: `${formData.firstName} ${formData.lastName}`,
          bio: formData.bio,
          title: formData.title,
          social_links: formData.socialLinks,
        })
        .eq("id", user._id);

      if (error) throw error;

      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (error) throw error;

      toast.success("Password reset email sent! Check your inbox.");
    } catch (error: any) {
      toast.error(error.message || "Failed to send password reset email");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const sidebarItems = [
    { id: "profile" as SettingsSection, label: "Profile", icon: User },
    { id: "account" as SettingsSection, label: "Account", icon: Settings },
    { id: "security" as SettingsSection, label: "Security", icon: Shield },
    { id: "notifications" as SettingsSection, label: "Notifications", icon: Bell },
  ];

  return (
    <div className="flex min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <aside className="w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 p-4 fixed h-full overflow-y-auto top-0">
        <div className="flex items-center gap-2 px-3 mb-6">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user.profile} />
            <AvatarFallback className="bg-gradient-to-br from-teal-500 to-teal-600 text-white">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-neutral-800 dark:text-white text-sm">
              {user.fullName}
            </span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {user.role}
            </span>
          </div>
        </div>

        <nav className="space-y-1 mb-4">
          <p className="px-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
            Settings
          </p>
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                activeSection === item.id
                  ? "bg-teal-500 text-white"
                  : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          ))}

          <Separator className="my-4" />

          <button
            onClick={() => navigate("/dashboard")}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      <main className="flex-1 ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                Settings
              </h1>
              <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                <span>Dashboard</span>
                <ChevronRight className="w-4 h-4" />
                <span>{sidebarItems.find((item) => item.id === activeSection)?.label}</span>
              </div>
            </div>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {activeSection === "profile" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information and profile picture
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={formData.profilePic} />
                      <AvatarFallback className="bg-gradient-to-br from-teal-500 to-teal-600 text-white text-2xl">
                        {formData.firstName?.[0]}{formData.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Camera className="w-4 h-4" />
                        Change Photo
                      </Button>
                      <p className="text-xs text-neutral-500 mt-2">
                        JPG, PNG or GIF. Max size 2MB
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Professional Title</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="e.g., Physical Therapist, Instructor"
                      value={formData.title}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      placeholder="Tell us about yourself..."
                      rows={4}
                      value={formData.bio}
                      onChange={handleInputChange}
                    />
                  </div>

                  <Button onClick={handleSaveProfile} disabled={isSaving} className="gap-2">
                    <Save className="w-4 h-4" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Social Links</CardTitle>
                  <CardDescription>
                    Connect your social media profiles
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="social.linkedin">LinkedIn</Label>
                    <Input
                      id="social.linkedin"
                      name="social.linkedin"
                      placeholder="https://linkedin.com/in/username"
                      value={formData.socialLinks.linkedin}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="social.twitter">Twitter</Label>
                    <Input
                      id="social.twitter"
                      name="social.twitter"
                      placeholder="https://twitter.com/username"
                      value={formData.socialLinks.twitter}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="social.github">GitHub</Label>
                    <Input
                      id="social.github"
                      name="social.github"
                      placeholder="https://github.com/username"
                      value={formData.socialLinks.github}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="social.facebook">Facebook</Label>
                    <Input
                      id="social.facebook"
                      name="social.facebook"
                      placeholder="https://facebook.com/username"
                      value={formData.socialLinks.facebook}
                      onChange={handleInputChange}
                    />
                  </div>

                  <Button onClick={handleSaveProfile} disabled={isSaving} className="gap-2">
                    <Save className="w-4 h-4" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === "account" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    Manage your account details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex gap-2">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        disabled
                        className="flex-1"
                      />
                      <Button variant="outline" size="icon">
                        <Mail className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-neutral-500">
                      Email cannot be changed at this time
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Account Type</Label>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {user.role === "instructor" ? "Instructor Account" : "Student Account"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Member Since</Label>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === "security" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Password & Security</CardTitle>
                  <CardDescription>
                    Manage your password and security settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                      Last changed: Never
                    </p>
                    <Button onClick={handlePasswordReset} variant="outline" className="gap-2">
                      <Lock className="w-4 h-4" />
                      Reset Password
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                      Add an extra layer of security to your account
                    </p>
                    <Button variant="outline" disabled>
                      Enable 2FA (Coming Soon)
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-200 dark:border-red-900">
                <CardHeader>
                  <CardTitle className="text-red-600 dark:text-red-400">
                    Danger Zone
                  </CardTitle>
                  <CardDescription>
                    Irreversible actions for your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Delete Account</Label>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                      Once you delete your account, there is no going back
                    </p>
                    <Button variant="destructive">
                      Delete My Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Manage how you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-neutral-500">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({ ...prev, emailNotifications: checked }))
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Course Updates</Label>
                      <p className="text-sm text-neutral-500">
                        Get notified about course updates and announcements
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.courseUpdates}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({ ...prev, courseUpdates: checked }))
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Promotional Emails</Label>
                      <p className="text-sm text-neutral-500">
                        Receive emails about new features and promotions
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.promotionalEmails}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({ ...prev, promotionalEmails: checked }))
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Weekly Digest</Label>
                      <p className="text-sm text-neutral-500">
                        Receive a weekly summary of your activity
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.weeklyDigest}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({ ...prev, weeklyDigest: checked }))
                      }
                    />
                  </div>

                  <Button className="gap-2">
                    <Save className="w-4 h-4" />
                    Save Preferences
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
