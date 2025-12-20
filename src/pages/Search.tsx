import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { supabase } from "@/lib/supabase";
import CourseCard from "@/components/ui/CourseCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import FilterCourses, { FilterState } from "@/components/courses/FilterCourses";

type Course = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  category: string;
  level: string;
  language: string[];
  average_rating: number;
  total_reviews: number;
  instructor_info: {
    name: string;
    avatar: string;
  };
};

export default function Search() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const [sidebarFilters, setSidebarFilters] = useState<FilterState>({
    rating: 0,
    price: [],
    duration: [],
    language: [],
    level: [],
    category: [],
    sortBy: 'highest-rated',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [currentCourses, setCurrentCourses] = useState<Course[]>([]);
  const coursesPerPage = 9;

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_published', true)
      .eq('approval_status', 'approved');

    if (error) {
      console.error('Error loading courses:', error);
    } else {
      setAllCourses(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    let results = allCourses;

    if (searchQuery) {
      results = results.filter(
        (course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.instructor_info?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sidebarFilters.category && sidebarFilters.category.length > 0) {
      results = results.filter((course) =>
        sidebarFilters.category!.includes(course.category)
      );
    }

    if (sidebarFilters.price && sidebarFilters.price.length > 0) {
      results = results.filter((course) => {
        if (sidebarFilters.price!.includes('Free')) {
          return course.price === 0;
        }
        if (sidebarFilters.price!.includes('Paid')) {
          return course.price > 0;
        }
        return true;
      });
    }

    if (typeof sidebarFilters.rating === "number" && sidebarFilters.rating > 0) {
      results = results.filter(
        (course) => course.average_rating >= sidebarFilters.rating!
      );
    }

    if (sidebarFilters.level && sidebarFilters.level.length > 0) {
      results = results.filter((course) =>
        sidebarFilters.level!.includes(course.level)
      );
    }

    if (sidebarFilters.language && sidebarFilters.language.length > 0) {
      results = results.filter((course) =>
        course.language?.some(lang => sidebarFilters.language!.includes(lang))
      );
    }

    if (sidebarFilters.sortBy === 'highest-rated') {
      results.sort((a, b) => b.average_rating - a.average_rating);
    } else if (sidebarFilters.sortBy === 'newest') {
      results.sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime());
    }

    setFilteredCourses(results);
    setCurrentPage(1);
  }, [searchQuery, sidebarFilters, allCourses]);

  useEffect(() => {
    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    setCurrentCourses(
      filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse)
    );
  }, [currentPage, filteredCourses]);

  const handleFilterChange = (filters: FilterState) => {
    setSidebarFilters(filters);
  };

  const handlePageChange = (pageNumber: number) => {
    const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">Načítání kurzů...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-5 py-10 mt-20">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
      />

      <div className="text-center lg:text-left mb-10">
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-white">
          {searchQuery ? `Výsledky pro "${searchQuery}"` : "Procházet všechny kurzy"}
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
          Nalezeno {filteredCourses.length} odpovídajících kurzů.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 mt-10">
        <div className="lg:w-1/4">
          <FilterCourses onFilter={handleFilterChange} />
        </div>

        <div className="flex-1">
          <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-300">
            Zobrazeno <span className="font-bold">{currentCourses.length}</span>{" "}
            z <span className="font-bold">{filteredCourses.length}</span>{" "}
            výsledků
          </p>
          {currentCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {currentCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  id={course.id}
                  image={course.thumbnail}
                  title={course.title}
                  category={course.category}
                  price={course.price}
                  description={course.description}
                  rating={course.average_rating?.toString() || "0"}
                  instructor={{
                    name: course.instructor_info?.name || "Neznámý",
                    avatar: course.instructor_info?.avatar || "/placeholder-avatar.png",
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 dark:bg-neutral-800 rounded-lg">
              <h3 className="text-xl font-semibold text-neutral-800 dark:text-white">
                Žádné kurzy nenalezeny
              </h3>
              <p className="text-neutral-500 dark:text-neutral-400 mt-2">
                Zkuste upravit hledání nebo filtry, abyste našli to, co hledáte.
              </p>
            </div>
          )}

          {totalPages > 1 && (
            <Pagination className="mt-12">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
                    }
                  />
                </PaginationItem>
                <PaginationItem>
                  <span className="px-4 py-2 text-sm text-neutral-800 dark:text-white">
                    Stránka {currentPage} z {totalPages}
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </section>
  );
}
