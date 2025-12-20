import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { FaLock, FaCheckCircle, FaClock } from "react-icons/fa";

interface CourseProgressProps {
  userId: string;
  courses: Array<{
    id: string;
    title: string;
    order_index: number;
  }>;
}

interface CourseStatus {
  courseId: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  progress: number;
}

export default function CourseProgress({ userId, courses }: CourseProgressProps) {
  const [courseStatuses, setCourseStatuses] = useState<CourseStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourseStatuses();
  }, [userId, courses]);

  const loadCourseStatuses = async () => {
    try {
      const statuses = await Promise.all(
        courses.map(async (course, index) => {
          const { data: enrollment } = await supabase
            .from('enrollments')
            .select('progress_percentage, completed_at')
            .eq('user_id', userId)
            .eq('course_id', course.id)
            .maybeSingle();

          const isCompleted = !!enrollment?.completed_at;
          const progress = enrollment?.progress_percentage || 0;

          let isUnlocked = false;
          if (index === 0) {
            isUnlocked = true;
          } else {
            const previousCourse = courses[index - 1];
            const { data: prevEnrollment } = await supabase
              .from('enrollments')
              .select('completed_at')
              .eq('user_id', userId)
              .eq('course_id', previousCourse.id)
              .maybeSingle();

            isUnlocked = !!prevEnrollment?.completed_at;
          }

          return {
            courseId: course.id,
            isUnlocked,
            isCompleted,
            progress
          };
        })
      );

      setCourseStatuses(statuses);
    } catch (error) {
      console.error('Failed to load course statuses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-neutral-800 dark:text-white mb-4">
        Your Learning Path
      </h3>
      {courses.map((course, index) => {
        const status = courseStatuses.find(s => s.courseId === course.id);

        return (
          <div
            key={course.id}
            className={`p-4 rounded-lg border-2 ${
              status?.isUnlocked
                ? 'border-purple-200 dark:border-purple-800 bg-white dark:bg-neutral-800'
                : 'border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 opacity-75'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  status?.isCompleted
                    ? 'bg-green-100 dark:bg-green-900'
                    : status?.isUnlocked
                    ? 'bg-purple-100 dark:bg-purple-900'
                    : 'bg-neutral-200 dark:bg-neutral-700'
                }`}>
                  {status?.isCompleted ? (
                    <FaCheckCircle className="text-green-600 dark:text-green-400" />
                  ) : status?.isUnlocked ? (
                    <FaClock className="text-purple-600 dark:text-purple-400" />
                  ) : (
                    <FaLock className="text-neutral-500" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold ${
                    status?.isUnlocked
                      ? 'text-neutral-800 dark:text-white'
                      : 'text-neutral-500 dark:text-neutral-500'
                  }`}>
                    {index + 1}. {course.title}
                  </h4>
                  {status?.isUnlocked && !status?.isCompleted && (
                    <div className="mt-2">
                      <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full transition-all"
                          style={{ width: `${status.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        {status.progress}% complete
                      </p>
                    </div>
                  )}
                </div>
              </div>
              {!status?.isUnlocked && (
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  Complete previous course to unlock
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
