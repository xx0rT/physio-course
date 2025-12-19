"use client";
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import axios from "axios";
import { Courses as defaultCourses } from "@/defaultData";
import { supabase } from "@/lib/supabase";

interface User {
  profile: string;
  firstName: string;
  lastName: string;
  _id: string;
  email: string;
  createdAt: string;
  isActive: boolean;
  fullName: string;
  myCourses: Array<1>;
  enrolledCourses: Array<0>;
  bio: string;
  title: string;
  role: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    facebook?: string;
  };
}

interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: {
    _id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    profilePic: string;
  };
  sections: Record<string, unknown>[];
  price: number;
  category: string;
  level: string;
  language: string[];
  requirements: string[];
  whatYouWillLearn: string[];
  tags: string[];
  thumbnail: string;
  averageRating: number;
  totalReviews: number;
  totalStudents: number;
  isPublished: boolean;
  approvalStatus: string;
  rejectionReason?: string;
  createdAt: Date;
  duration: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  apiAvailable: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) => Promise<void>;
  deactivateAccount:() => Promise<void>;
  becomeInstructor: (data: {
    title: string;
    bio: string;
    socialLinks: {
      linkedin?: string;
      twitter?: string;
      github?: string;
      facebook?: string;
    };
  }) => Promise<void>;
  updateInstructor: (data: {
    title?: string;
    bio?: string;
    socialLinks?: {
      linkedin?: string;
      twitter?: string;
      github?: string;
      facebook?: string;
    };
  }) => Promise<void>;
  courses: Course[];
  selectedCourse: Course | null;
  fetchCourseById: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiAvailable, setApiAvailable] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const api = process.env.NEXT_PUBLIC_API_BASE_URL;

  const apiClient = axios.create({
    baseURL: api,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const checkUser = useCallback(async () => {
    try {
      const { data: { user: supabaseUser }, error } = await supabase.auth.getUser();

      if (error) throw error;

      if (supabaseUser) {
        const userData: User = {
          profile: "",
          firstName: supabaseUser.user_metadata?.firstName || "",
          lastName: supabaseUser.user_metadata?.lastName || "",
          _id: supabaseUser.id,
          email: supabaseUser.email || "",
          createdAt: supabaseUser.created_at,
          isActive: true,
          fullName: `${supabaseUser.user_metadata?.firstName || ""} ${supabaseUser.user_metadata?.lastName || ""}`.trim(),
          myCourses: [],
          enrolledCourses: [],
          bio: supabaseUser.user_metadata?.bio || "",
          title: supabaseUser.user_metadata?.title || "",
          role: supabaseUser.user_metadata?.role || "student",
          socialLinks: supabaseUser.user_metadata?.socialLinks || {},
        };
        setUser(userData);
      }
      setApiAvailable(true);
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    }
  }, []);

  const deactivateAccount = async () => {
    try {
      await apiClient.post('/users/deactivate');
      setUser((prevUser) => {
        if (!prevUser) return null;
        return {
          ...prevUser,
          isActive: false,
        };
      });
    } catch (error) {
      console.error("Account deactivation failed:", error);
      throw new Error("Failed to deactivate account");
    }
  };

  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            firstName,
            lastName,
            role: "student",
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        const userData: User = {
          profile: "",
          firstName,
          lastName,
          _id: data.user.id,
          email: data.user.email || "",
          createdAt: data.user.created_at,
          isActive: true,
          fullName: `${firstName} ${lastName}`.trim(),
          myCourses: [],
          enrolledCourses: [],
          bio: "",
          title: "",
          role: "student",
          socialLinks: {},
        };
        setUser(userData);
      }
    } catch (error) {
      console.error("Register failed:", error);
      throw new Error("Registration failed");
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const userData: User = {
          profile: "",
          firstName: data.user.user_metadata?.firstName || "",
          lastName: data.user.user_metadata?.lastName || "",
          _id: data.user.id,
          email: data.user.email || "",
          createdAt: data.user.created_at,
          isActive: true,
          fullName: `${data.user.user_metadata?.firstName || ""} ${data.user.user_metadata?.lastName || ""}`.trim(),
          myCourses: [],
          enrolledCourses: [],
          bio: data.user.user_metadata?.bio || "",
          title: data.user.user_metadata?.title || "",
          role: data.user.user_metadata?.role || "student",
          socialLinks: data.user.user_metadata?.socialLinks || {},
        };
        setUser(userData);
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error("Login failed");
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const becomeInstructor = async (data: {
    title: string;
    bio: string;
    socialLinks: {
      linkedin?: string;
      twitter?: string;
      github?: string;
      facebook?: string;
    };
  }) => {
    try {
      const res = await apiClient.post(`/instructors/become-instructor`, data);
      setUser((prevUser) => {
        if (!prevUser) return null;
        return {
          ...prevUser,
          ...res.data.user,
          role: "instructor",
          socialLinks: {
            ...prevUser.socialLinks,
            ...res.data.user?.socialLinks,
          },
        };
      });
      checkUser();
      return res.data;
    } catch (error) {
      console.error("Become instructor error:", error);
      throw new Error("Failed to submit instructor application");
    }
  };

  const updateInstructor = async (data: {
    title?: string;
    bio?: string;
    socialLinks?: {
      linkedin?: string;
      twitter?: string;
      github?: string;
      facebook?: string;
    };
  }) => {
    try {
      const res = await apiClient.patch(`/instructors/update-profile`, data);
      setUser((prev) => ({
        ...prev,
        ...res.data.user,
        socialLinks: {
          ...prev?.socialLinks,
          ...res.data.user?.socialLinks,
        },
      }));
      checkUser();
      return res.data;
    } catch (error) {
      console.error("Update instructor error:", error);
      throw new Error("Failed to update instructor profile");
    }
  };
  const checkCourses = useCallback(async () => {
    try {
      const res = await axios.get(`${api}/courses`, {
        withCredentials: true,
      });
      if (res.data?.courses?.length > 0) {
        setCourses(res.data.courses);
      } else {
        setCourses(defaultCourses);
      }
    } catch (error) {
      console.error("Course API unavailable. Using fallback data.", error);
      setCourses(defaultCourses);
    }
  }, [api]);

  useEffect(() => {
    const init = async () => {
      await checkUser();
      await checkCourses();
      setLoading(false);
    };
    init();
  }, [checkUser, checkCourses]);

  const fetchCourseById = useCallback(
    async (id: string) => {
      try {
        const res = await axios.get(`${api}/courses/${id}`, {
          withCredentials: true,
        });
        setSelectedCourse(res.data.course);
      } catch (error) {
        console.warn( 
          "API unavailable, trying fallback for course detail",
          error
        );

        const fallback = defaultCourses.find((c) => c._id === id);
        if (fallback) {
          setSelectedCourse(fallback);
        } else {
          setSelectedCourse(null);
        }
      }
    },
    [api]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        apiAvailable,
        login,
        logout,
        register,
        becomeInstructor,
        updateInstructor,
        courses,
        selectedCourse,
        deactivateAccount,
        fetchCourseById,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
