import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authProvider";
import { supabase } from "@/lib/supabase";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  BookOpen,
  Clock,
  CheckCircle,
  Play,
  TrendingUp,
  Award,
  Calendar,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  level: string;
}

interface Enrollment {
  id: string;
  course_id: string;
  enrolled_at: string;
  completed_at: string | null;
  progress_percentage: number;
  last_accessed: string;
  courses: Course;
}

interface Stats {
  total: number;
  inProgress: number;
  completed: number;
  totalHours: number;
}

export default function MyLearning() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    inProgress: 0,
    completed: 0,
    totalHours: 0
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth/login");
      return;
    }

    if (user) {
      loadEnrollments();
    }
  }, [user, authLoading, navigate]);

  const loadEnrollments = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          courses (
            id,
            title,
            description,
            thumbnail,
            category,
            level
          )
        `)
        .eq('user_id', user._id)
        .order('last_accessed', { ascending: false });

      if (error) {
        console.error('Error loading enrollments:', error);
        toast.error('Failed to load your courses');
        return;
      }

      setEnrollments(data || []);

      const totalCourses = data?.length || 0;
      const completedCourses = data?.filter(e => e.completed_at !== null).length || 0;
      const inProgressCourses = data?.filter(e => e.completed_at === null && e.progress_percentage > 0).length || 0;

      setStats({
        total: totalCourses,
        inProgress: inProgressCourses,
        completed: completedCourses,
        totalHours: totalCourses * 8
      });

    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleContinueCourse = (courseId: string) => {
    navigate(`/courses/player/${courseId}`);
  };

  const handleViewCourse = (courseId: string) => {
    navigate(`/courses/${courseId}`);
  };

  const filterEnrollments = (status: 'all' | 'in-progress' | 'completed') => {
    if (status === 'all') return enrollments;
    if (status === 'completed') return enrollments.filter(e => e.completed_at !== null);
    return enrollments.filter(e => e.completed_at === null && e.progress_percentage > 0);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('cs-CZ', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto" />
          <p className="text-neutral-600 dark:text-neutral-400">Načítání vašich kurzů...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">
              Moje učení
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Sledujte svůj pokrok a pokračujte ve svých kurzech
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Celkem kurzů</CardTitle>
                  <BookOpen className="h-4 w-4 text-teal-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-neutral-900 dark:text-white">{stats.total}</div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                    Zapsaných kurzů
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Probíhající</CardTitle>
                  <Clock className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-neutral-900 dark:text-white">{stats.inProgress}</div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                    Aktivních kurzů
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Dokončeno</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-neutral-900 dark:text-white">{stats.completed}</div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                    Úspěšně ukončených
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Celkem hodin</CardTitle>
                  <Award className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-neutral-900 dark:text-white">{stats.totalHours}</div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                    Odhadovaný čas učení
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {enrollments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <BookOpen className="h-16 w-16 text-neutral-400 dark:text-neutral-600 mb-4" />
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                    Nemáte žádné zapsané kurzy
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 text-center mb-6 max-w-md">
                    Začněte se učit tím, že si zapíšete svůj první kurz z naší široké nabídky.
                  </p>
                  <Button
                    onClick={() => navigate('/courses')}
                    className="bg-teal-500 hover:bg-teal-600 text-white"
                  >
                    Procházet kurzy
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 mb-6">
                  <TabsTrigger value="all" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white">
                    Všechny ({stats.total})
                  </TabsTrigger>
                  <TabsTrigger value="in-progress" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white">
                    Probíhající ({stats.inProgress})
                  </TabsTrigger>
                  <TabsTrigger value="completed" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white">
                    Dokončené ({stats.completed})
                  </TabsTrigger>
                </TabsList>

                {['all', 'in-progress', 'completed'].map((status) => (
                  <TabsContent key={status} value={status} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filterEnrollments(status as 'all' | 'in-progress' | 'completed').map((enrollment, index) => (
                        <motion.div
                          key={enrollment.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <Card className="group bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:shadow-xl transition-all duration-300 overflow-hidden">
                            <div className="relative h-48 overflow-hidden bg-neutral-200 dark:bg-neutral-800">
                              {enrollment.courses.thumbnail ? (
                                <img
                                  src={enrollment.courses.thumbnail}
                                  alt={enrollment.courses.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <BookOpen className="h-16 w-16 text-neutral-400 dark:text-neutral-600" />
                                </div>
                              )}
                              {enrollment.completed_at && (
                                <div className="absolute top-3 right-3">
                                  <Badge className="bg-green-500 text-white">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Dokončeno
                                  </Badge>
                                </div>
                              )}
                              {enrollment.progress_percentage > 0 && !enrollment.completed_at && (
                                <div className="absolute top-3 right-3">
                                  <Badge className="bg-blue-500 text-white">
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                    {Math.round(enrollment.progress_percentage)}%
                                  </Badge>
                                </div>
                              )}
                            </div>

                            <CardHeader>
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <CardTitle className="text-lg line-clamp-2 group-hover:text-teal-500 transition-colors">
                                  {enrollment.courses.title}
                                </CardTitle>
                              </div>
                              <CardDescription className="line-clamp-2">
                                {enrollment.courses.description}
                              </CardDescription>
                              <div className="flex items-center gap-2 pt-2">
                                {enrollment.courses.category && (
                                  <Badge variant="outline" className="text-xs">
                                    {enrollment.courses.category}
                                  </Badge>
                                )}
                                {enrollment.courses.level && (
                                  <Badge variant="outline" className="text-xs">
                                    {enrollment.courses.level}
                                  </Badge>
                                )}
                              </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                              {!enrollment.completed_at && (
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-neutral-600 dark:text-neutral-400">Pokrok</span>
                                    <span className="font-medium text-neutral-900 dark:text-white">
                                      {Math.round(enrollment.progress_percentage)}%
                                    </span>
                                  </div>
                                  <Progress value={enrollment.progress_percentage} className="h-2" />
                                </div>
                              )}

                              <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {enrollment.completed_at
                                    ? `Dokončeno ${formatDate(enrollment.completed_at)}`
                                    : `Zapsáno ${formatDate(enrollment.enrolled_at)}`
                                  }
                                </span>
                              </div>

                              <div className="flex gap-2 pt-2">
                                {enrollment.completed_at ? (
                                  <Button
                                    onClick={() => handleViewCourse(enrollment.courses.id)}
                                    variant="outline"
                                    className="flex-1 group-hover:border-teal-500 group-hover:text-teal-500"
                                  >
                                    Zobrazit kurz
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                  </Button>
                                ) : (
                                  <Button
                                    onClick={() => handleContinueCourse(enrollment.courses.id)}
                                    className="flex-1 bg-teal-500 hover:bg-teal-600 text-white"
                                  >
                                    <Play className="mr-2 h-4 w-4" />
                                    Pokračovat
                                  </Button>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>

                    {filterEnrollments(status as 'all' | 'in-progress' | 'completed').length === 0 && (
                      <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                          <Clock className="h-12 w-12 text-neutral-400 dark:text-neutral-600 mb-4" />
                          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                            {status === 'in-progress' && 'Žádné probíhající kurzy'}
                            {status === 'completed' && 'Žádné dokončené kurzy'}
                          </h3>
                          <p className="text-neutral-600 dark:text-neutral-400 text-center">
                            {status === 'in-progress' && 'Začněte s některým ze svých zapsaných kurzů'}
                            {status === 'completed' && 'Dokončete kurz a získejte certifikát'}
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
