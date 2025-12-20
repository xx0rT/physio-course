import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { FaStar, FaUsers, FaGraduationCap, FaLinkedin, FaTwitter, FaGlobe } from "react-icons/fa";
import { toast } from "react-toastify";

interface Instructor {
  id: string;
  first_name: string;
  last_name: string;
  bio: string;
  title: string;
  profile_picture: string;
  social_links: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  average_rating: number;
  total_students: number;
  level: string;
}

export default function InstructorDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    averageRating: 0
  });

  useEffect(() => {
    if (id) {
      loadInstructorData();
    }
  }, [id]);

  const loadInstructorData = async () => {
    try {
      const { data: instructorData, error: instructorError } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .eq('role', 'instructor')
        .maybeSingle();

      if (instructorError) throw instructorError;

      if (!instructorData) {
        toast.error("Instructor not found");
        navigate('/instructors');
        return;
      }

      setInstructor(instructorData);

      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .eq('instructor_id', id)
        .eq('is_published', true)
        .eq('approval_status', 'approved');

      if (coursesError) throw coursesError;

      setCourses(coursesData || []);

      const totalStudents = coursesData?.reduce((sum, course) => sum + (course.total_students || 0), 0) || 0;
      const avgRating = coursesData?.length
        ? coursesData.reduce((sum, course) => sum + (course.average_rating || 0), 0) / coursesData.length
        : 0;

      setStats({
        totalStudents,
        totalCourses: coursesData?.length || 0,
        averageRating: avgRating
      });
    } catch (error) {
      console.error('Failed to load instructor data:', error);
      toast.error("Failed to load instructor information");
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={i < Math.round(rating) ? "text-yellow-500" : "text-gray-300 dark:text-gray-600"}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">Loading instructor profile...</p>
        </div>
      </div>
    );
  }

  if (!instructor) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900">
      <div style={{ background: 'linear-gradient(135deg, #704FE6 0%, #1e2a47 100%)' }} className="text-white py-20 mt-16">
        <div className="container mx-auto px-5">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <img
              src={instructor.profile_picture || '/home/person1.png'}
              alt={`${instructor.first_name} ${instructor.last_name}`}
              className="w-40 h-40 rounded-full border-4 border-white shadow-xl object-cover"
            />
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold mb-2">
                {instructor.first_name} {instructor.last_name}
              </h1>
              {instructor.title && (
                <p className="text-xl opacity-90 mb-4">{instructor.title}</p>
              )}

              <div className="flex flex-wrap gap-6 justify-center md:justify-start text-sm">
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                  <FaGraduationCap className="text-xl" />
                  <div>
                    <div className="font-semibold">{stats.totalCourses}</div>
                    <div className="text-xs opacity-75">Courses</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                  <FaUsers className="text-xl" />
                  <div>
                    <div className="font-semibold">{stats.totalStudents}</div>
                    <div className="text-xs opacity-75">Students</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                  <FaStar className="text-xl text-yellow-400" />
                  <div>
                    <div className="font-semibold">{stats.averageRating.toFixed(1)}</div>
                    <div className="text-xs opacity-75">Rating</div>
                  </div>
                </div>
              </div>

              {instructor.social_links && (
                <div className="flex gap-4 mt-6 justify-center md:justify-start">
                  {instructor.social_links.linkedin && (
                    <a
                      href={instructor.social_links.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all"
                    >
                      <FaLinkedin className="text-xl" />
                    </a>
                  )}
                  {instructor.social_links.twitter && (
                    <a
                      href={instructor.social_links.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all"
                    >
                      <FaTwitter className="text-xl" />
                    </a>
                  )}
                  {instructor.social_links.website && (
                    <a
                      href={instructor.social_links.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all"
                    >
                      <FaGlobe className="text-xl" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-5 py-12">
        {instructor.bio && (
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-8 shadow mb-8">
            <h2 className="text-2xl font-bold text-neutral-800 dark:text-white mb-4">About</h2>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
              {instructor.bio}
            </p>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold text-neutral-800 dark:text-white mb-6">
            Courses by {instructor.first_name}
          </h2>

          {courses.length === 0 ? (
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-8 text-center">
              <p className="text-neutral-600 dark:text-neutral-400">
                No courses available yet.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  onClick={() => navigate(`/course-details/${course.id}`)}
                  className="bg-white dark:bg-neutral-800 rounded-lg overflow-hidden shadow hover:shadow-xl transition-all cursor-pointer group"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {course.level}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-lg text-neutral-800 dark:text-white mb-2 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {renderStars(course.average_rating)}
                        <span className="text-sm text-neutral-600 dark:text-neutral-400 ml-2">
                          ({course.total_students})
                        </span>
                      </div>
                      <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {course.price === 0 ? 'Free' : `$${course.price}`}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
