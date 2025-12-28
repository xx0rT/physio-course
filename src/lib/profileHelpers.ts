import { supabase } from "./supabase";

export interface UserProfile {
  id: string;
  user_id: string;
  bio: string;
  profile_picture_url?: string;
  banner_image_url?: string;
  theme_preference: string;
  color_scheme: {
    primary: string;
    secondary: string;
  };
  layout_preference: string;
  social_links: Record<string, string>;
  interests: string[];
  location?: string;
  website?: string;
  updated_at: string;
  created_at: string;
}

export interface UserStats {
  level: number;
  xp: number;
  total_courses_completed: number;
  total_lessons_completed: number;
  current_streak: number;
  longest_streak: number;
}

/**
 * Fetches or creates extended profile for a user
 */
export async function getOrCreateProfile(userId: string): Promise<UserProfile | null> {
  try {
    // Try to fetch existing profile
    const { data: existingProfile, error: fetchError } = await supabase
      .from('user_profiles_extended')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    // If profile exists, return it
    if (existingProfile) {
      return existingProfile;
    }

    // Create new profile
    const { data: newProfile, error: createError } = await supabase
      .from('user_profiles_extended')
      .insert({
        user_id: userId,
        theme_preference: 'default',
        color_scheme: { primary: "#8b5cf6", secondary: "#06b6d4" },
        layout_preference: 'grid',
        social_links: {},
        interests: []
      })
      .select()
      .single();

    if (createError) {
      throw createError;
    }

    return newProfile;
  } catch (error) {
    console.error('Error in getOrCreateProfile:', error);
    return null;
  }
}

/**
 * Updates user profile fields
 */
export async function updateProfile(
  userId: string,
  updates: Partial<Omit<UserProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_profiles_extended')
      .update(updates)
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error updating profile:', error);
    return false;
  }
}

/**
 * Uploads an image to Supabase storage
 */
export async function uploadProfileImage(
  userId: string,
  file: File,
  type: 'profile' | 'banner'
): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${type}-${Date.now()}.${fileExt}`;
    const filePath = `${type}s/${fileName}`;

    // Upload file
    const { error: uploadError } = await supabase.storage
      .from('user-uploads')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('user-uploads')
      .getPublicUrl(filePath);

    // Update profile with new URL
    const updateField = type === 'profile' ? 'profile_picture_url' : 'banner_image_url';
    await updateProfile(userId, { [updateField]: publicUrl });

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

/**
 * Deletes a profile image from storage
 */
export async function deleteProfileImage(
  userId: string,
  imageUrl: string,
  type: 'profile' | 'banner'
): Promise<boolean> {
  try {
    // Extract file path from URL
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const filePath = `${type}s/${fileName}`;

    // Delete file
    const { error: deleteError } = await supabase.storage
      .from('user-uploads')
      .remove([filePath]);

    if (deleteError) {
      throw deleteError;
    }

    // Update profile to remove URL
    const updateField = type === 'profile' ? 'profile_picture_url' : 'banner_image_url';
    await updateProfile(userId, { [updateField]: null as any });

    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}

/**
 * Gets user stats
 */
export async function getUserStats(userId: string): Promise<UserStats> {
  try {
    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data || {
      level: 1,
      xp: 0,
      total_courses_completed: 0,
      total_lessons_completed: 0,
      current_streak: 0,
      longest_streak: 0
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return {
      level: 1,
      xp: 0,
      total_courses_completed: 0,
      total_lessons_completed: 0,
      current_streak: 0,
      longest_streak: 0
    };
  }
}

/**
 * Calculates progress to next level
 */
export function getLevelProgress(xp: number, level: number): {
  currentLevelXP: number;
  nextLevelXP: number;
  percentage: number;
} {
  const nextLevelXP = level * 100;
  const currentLevelXP = xp % nextLevelXP;
  const percentage = (currentLevelXP / nextLevelXP) * 100;

  return {
    currentLevelXP,
    nextLevelXP,
    percentage
  };
}

/**
 * Validates image file
 */
export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Please upload a valid image file (JPEG, PNG, or WebP)'
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Image size must be less than 5MB'
    };
  }

  return { valid: true };
}
