import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authProvider";
import { supabase } from "@/lib/supabase";
import { FaPlay, FaCheckCircle, FaLock, FaBook, FaRoad, FaFileAlt, FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { MdOndemandVideo } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface CourseContent {
  id: string;
  section_id: string;
  content_type: 'video' | 'text' | 'roadmap' | 'tutorial';
  title: string;
  content: string;
  order_index: number;
  duration: number;
}

interface CourseSection {
  id: string;
  title: string;
  description: string;
  order_index: number;
  contents: CourseContent[];
}

interface UserProgress {
  section_id: string;
  content_id?: string;
  completed: boolean;
}

export default function CoursePlayer() {
  const { id } = useParams<{ id: string }>();
  const { user, selectedCourse, fetchCourseById } = useAuth();
  const navigate = useNavigate();
  const [sections, setSections] = useState<CourseSection[]>([]);
  const [currentSection, setCurrentSection] = useState<CourseSection | null>(null);
  const [currentContent, setCurrentContent] = useState<CourseContent | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (!user) {
      toast.error("Please login to access this course");
      navigate("/login");
      return;
    }

    if (id) {
      fetchCourseById(id);
      checkSubscription();
      loadCourseContent();
      loadUserProgress();
    }
  }, [id, user]);

  const checkSubscription = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user._id)
        .eq('status', 'active')
        .maybeSingle();

      if (error) throw error;

      if (data) {
        if (data.plan_type === 'lifetime') {
          setHasSubscription(true);
        } else if (data.end_date && new Date(data.end_date) > new Date()) {
          setHasSubscription(true);
        }
      } else {
        toast.error("You need an active subscription to access courses");
        navigate(`/course-details/${id}`);
      }
    } catch (error) {
      console.error('Failed to check subscription:', error);
    }
  };

  const loadCourseContent = async () => {
    if (!id) return;

    try {
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('course_sections')
        .select('*')
        .eq('course_id', id)
        .order('order_index', { ascending: true });

      if (sectionsError) throw sectionsError;

      const sectionsWithContent = await Promise.all(
        (sectionsData || []).map(async (section) => {
          const { data: contentData } = await supabase
            .from('course_content')
            .select('*')
            .eq('section_id', section.id)
            .order('order_index', { ascending: true });

          return {
            ...section,
            contents: contentData || []
          };
        })
      );

      setSections(sectionsWithContent);
      if (sectionsWithContent.length > 0 && sectionsWithContent[0].contents.length > 0) {
        setCurrentSection(sectionsWithContent[0]);
        setCurrentContent(sectionsWithContent[0].contents[0]);
      }
    } catch (error) {
      console.error('Failed to load course content:', error);
      toast.error("Failed to load course content");
    } finally {
      setLoading(false);
    }
  };

  const loadUserProgress = async () => {
    if (!user || !id) return;

    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user._id)
        .eq('course_id', id);

      if (error) throw error;
      setUserProgress(data || []);
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
  };

  const markAsComplete = async () => {
    if (!user || !id || !currentSection) return;

    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user._id,
          course_id: id,
          section_id: currentSection.id,
          completed: true,
          completed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,course_id,section_id'
        });

      if (error) throw error;

      setUserProgress(prev => {
        const existing = prev.find(p => p.section_id === currentSection.id);
        if (existing) {
          return prev.map(p =>
            p.section_id === currentSection.id
              ? { ...p, completed: true }
              : p
          );
        }
        return [...prev, { section_id: currentSection.id, completed: true }];
      });

      toast.success("Lesson marked as complete!");
      goToNext();
    } catch (error) {
      console.error('Failed to mark as complete:', error);
      toast.error("Failed to save progress");
    }
  };

  const isContentCompleted = (sectionId: string) => {
    return userProgress.some(p => p.section_id === sectionId && p.completed);
  };

  const goToNext = () => {
    if (!currentSection || !currentContent) return;

    const currentSectionIndex = sections.findIndex(s => s.id === currentSection.id);
    const currentContentIndex = currentSection.contents.findIndex(c => c.id === currentContent.id);

    if (currentContentIndex < currentSection.contents.length - 1) {
      setCurrentContent(currentSection.contents[currentContentIndex + 1]);
    } else if (currentSectionIndex < sections.length - 1) {
      const nextSection = sections[currentSectionIndex + 1];
      setCurrentSection(nextSection);
      if (nextSection.contents.length > 0) {
        setCurrentContent(nextSection.contents[0]);
      }
    }
  };

  const goToPrevious = () => {
    if (!currentSection || !currentContent) return;

    const currentSectionIndex = sections.findIndex(s => s.id === currentSection.id);
    const currentContentIndex = currentSection.contents.findIndex(c => c.id === currentContent.id);

    if (currentContentIndex > 0) {
      setCurrentContent(currentSection.contents[currentContentIndex - 1]);
    } else if (currentSectionIndex > 0) {
      const prevSection = sections[currentSectionIndex - 1];
      setCurrentSection(prevSection);
      if (prevSection.contents.length > 0) {
        setCurrentContent(prevSection.contents[prevSection.contents.length - 1]);
      }
    }
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video': return <MdOndemandVideo className="text-lg" />;
      case 'text': return <FaFileAlt className="text-lg" />;
      case 'roadmap': return <FaRoad className="text-lg" />;
      case 'tutorial': return <FaBook className="text-lg" />;
      default: return <FaFileAlt className="text-lg" />;
    }
  };

  const renderContent = () => {
    if (!currentContent) return null;

    switch (currentContent.content_type) {
      case 'video':
        return (
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <video
              src={currentContent.content}
              controls
              className="w-full h-full"
              poster={selectedCourse?.thumbnail}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        );

      case 'roadmap':
        return (
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-8">
            <div className="prose dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: currentContent.content }} />
            </div>
          </div>
        );

      case 'text':
      case 'tutorial':
        return (
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-8">
            <div className="prose dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: currentContent.content }} />
            </div>
          </div>
        );

      default:
        return <p>Content type not supported</p>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!hasSubscription) {
    return null;
  }

  if (sections.length === 0) {
    return (
      <div className="container mx-auto px-5 py-20 mt-20">
        <div className="text-center">
          <p className="text-neutral-600 dark:text-neutral-400">No content available for this course yet.</p>
        </div>
      </div>
    );
  }

  const completedCount = userProgress.filter(p => p.completed).length;
  const totalLessons = sections.reduce((acc, s) => acc + s.contents.length, 0);
  const progressPercentage = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 pt-16">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex h-[calc(100vh-4rem)]">
        <div
          className={`${
            isSidebarOpen ? 'w-80' : 'w-0'
          } bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 overflow-y-auto transition-all duration-300`}
        >
          <div className="p-6">
            <h2 className="text-xl font-bold text-neutral-800 dark:text-white mb-2">
              {selectedCourse?.title}
            </h2>

            <div className="mb-6">
              <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                <span>Your Progress</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                {completedCount} of {totalLessons} lessons completed
              </p>
            </div>

            <div className="space-y-4">
              {sections.map((section, sectionIndex) => (
                <div key={section.id} className="border-b border-neutral-200 dark:border-neutral-700 pb-4">
                  <h3 className="font-semibold text-neutral-800 dark:text-white mb-2">
                    {sectionIndex + 1}. {section.title}
                  </h3>
                  <div className="space-y-2">
                    {section.contents.map((content, contentIndex) => (
                      <button
                        key={content.id}
                        onClick={() => {
                          setCurrentSection(section);
                          setCurrentContent(content);
                        }}
                        className={`w-full text-left p-3 rounded-lg transition-all ${
                          currentContent?.id === content.id
                            ? 'bg-purple-100 dark:bg-purple-900/30 border-l-4 border-purple-500'
                            : 'hover:bg-neutral-100 dark:hover:bg-neutral-700'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-1 ${
                            isContentCompleted(section.id)
                              ? 'text-green-500'
                              : 'text-neutral-400 dark:text-neutral-500'
                          }`}>
                            {isContentCompleted(section.id) ? (
                              <FaCheckCircle className="text-lg" />
                            ) : (
                              getContentIcon(content.content_type)
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${
                              currentContent?.id === content.id
                                ? 'text-purple-600 dark:text-purple-400'
                                : 'text-neutral-700 dark:text-neutral-300'
                            }`}>
                              {content.title}
                            </p>
                            {content.duration > 0 && (
                              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                                {content.duration} min
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="fixed left-4 top-20 z-10 bg-white dark:bg-neutral-800 p-3 rounded-full shadow-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          >
            {isSidebarOpen ? (
              <FaChevronLeft className="text-neutral-600 dark:text-neutral-300" />
            ) : (
              <FaChevronRight className="text-neutral-600 dark:text-neutral-300" />
            )}
          </button>

          <div className="max-w-5xl mx-auto p-6 md:p-8">
            {currentContent && (
              <>
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                    {getContentIcon(currentContent.content_type)}
                    <span className="capitalize">{currentContent.content_type}</span>
                  </div>
                  <h1 className="text-3xl font-bold text-neutral-800 dark:text-white mb-2">
                    {currentContent.title}
                  </h1>
                  {currentSection && (
                    <p className="text-neutral-600 dark:text-neutral-400">
                      Section: {currentSection.title}
                    </p>
                  )}
                </div>

                <div className="mb-8">
                  {renderContent()}
                </div>

                <div className="flex items-center justify-between border-t border-neutral-200 dark:border-neutral-700 pt-6">
                  <button
                    onClick={goToPrevious}
                    disabled={sections[0]?.contents[0]?.id === currentContent.id}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-white hover:bg-neutral-300 dark:hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FaChevronLeft />
                    Previous
                  </button>

                  {!isContentCompleted(currentSection?.id || '') && (
                    <button
                      onClick={markAsComplete}
                      className="flex items-center gap-2 px-6 py-3 rounded-lg button1 hover:opacity-90 transition-opacity"
                    >
                      <FaCheckCircle />
                      Mark as Complete
                    </button>
                  )}

                  <button
                    onClick={goToNext}
                    disabled={
                      sections[sections.length - 1]?.contents[
                        sections[sections.length - 1]?.contents.length - 1
                      ]?.id === currentContent.id
                    }
                    className="flex items-center gap-2 px-6 py-3 rounded-lg button1 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                  >
                    Next
                    <FaChevronRight />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
