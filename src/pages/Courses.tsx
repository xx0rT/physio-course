import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import CourseCard from "@/components/ui/CourseCard";
import FilterCourses, { FilterState } from "@/components/courses/FilterCourses";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useAuth } from "@/context/authProvider";

interface Course {
  id: string;
  image: string;
  title: string;
  description:string;
  category: 'Development' | 'Business' | 'IT & Software' | 'Design' | 'Marketing' | 'Photography';
  price: number;
  rating: number;
  duration: number;
  level: 'All Levels' | 'Beginner' | 'Intermediate' | 'Expert';
  language: 'English' | 'Arabic' | 'French';
  createdAt: Date;
  instructor: { name: string; avatar: string; };
}

const COURSES_PER_PAGE = 20;

const CoursesPage = () => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const { user, courses: dbCourses } = useAuth();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState<FilterState | null>(null);

  const allCourses: Course[] = useMemo(() => {
    return dbCourses.map((course) => ({
      id: course._id,
      image: course.thumbnail,
      title: course.title,
      description: course.description,
      category: course.category as 'Development' | 'Business' | 'IT & Software' | 'Design' | 'Marketing' | 'Photography',
      price: course.price,
      rating: course.averageRating,
      duration: course.duration,
      level: course.level as 'All Levels' | 'Beginner' | 'Intermediate' | 'Expert',
      language: (course.language[0] || 'English') as 'English' | 'Arabic' | 'French',
      createdAt: course.createdAt,
      instructor: {
        name: course.instructor.fullName,
        avatar: course.instructor.profilePic || '/home/person1.png'
      }
    }));
  }, [dbCourses]);

  useEffect(() => {
    if (!user) {
      toast.error("Musíte se přihlásit pro zobrazení kurzů!");
      navigate("/login");
    }
  }, [user, navigate]);

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setActiveFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const filteredCourses = useMemo(() => {
    if (!activeFilters) return allCourses;

    let updatedCourses = [...allCourses];

    if (activeFilters.rating > 0) {
      updatedCourses = updatedCourses.filter(course => course.rating >= activeFilters.rating);
    }

    if (activeFilters.price.length > 0 && !activeFilters.price.includes('Paid') || !activeFilters.price.includes('Free')) {
        if(activeFilters.price.includes('Free')) updatedCourses = updatedCourses.filter(c => c.price === 0);
        if(activeFilters.price.includes('Paid')) updatedCourses = updatedCourses.filter(c => c.price > 0);
    }

    if (activeFilters.duration.length > 0) {
        updatedCourses = updatedCourses.filter(course => {
            return activeFilters.duration.some(range => {
                if (range === "0-1 Hour") return course.duration <= 1;
                if (range === "1-3 Hours") return course.duration > 1 && course.duration <= 3;
                if (range === "3-6 Hours") return course.duration > 3 && course.duration <= 6;
                if (range === "6-17 Hours") return course.duration > 6 && course.duration <= 17;
                return false;
            });
        });
    }

    const checkboxFilters: Array<keyof FilterState> = ['category', 'level', 'language'];
    checkboxFilters.forEach(key => {
        const filterValues = activeFilters[key] as string[];
        if (filterValues.length > 0) {
            updatedCourses = updatedCourses.filter(course => filterValues.includes(course[key as keyof Course] as string));
        }
    });

    if (activeFilters.sortBy === 'newest') {
        updatedCourses.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } else {
        updatedCourses.sort((a, b) => b.rating - a.rating);
    }

    return updatedCourses;
  }, [activeFilters]);

  const totalPages = Math.ceil(filteredCourses.length / COURSES_PER_PAGE);
  const currentCourses = filteredCourses.slice(
    (currentPage - 1) * COURSES_PER_PAGE,
    currentPage * COURSES_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <section className="container mx-auto px-5 py-10 mt-20">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      <div
        className={`mb-10 text-center ${locale === 'ar' ? 'lg:text-right' : 'lg:text-left'}`}
      >
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-white">
          {t('coursesPage.title_part1')}{' '}
          <span className="text-purple-500">{t('coursesPage.title_part2')}</span>
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
          {t('coursesPage.description')}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 mt-10">
        <div className="lg:w-1/4">
          <FilterCourses onFilter={handleFilterChange} />
        </div>

        <div className="flex-1">
        <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-300">
            {t('coursesPage.results_showing')}{' '}
            <span className="font-bold">{currentCourses.length}</span>{' '}
            {t('coursesPage.results_of')}{' '}
            <span className="font-bold">{filteredCourses.length}</span>{' '}
            {t('coursesPage.results_suffix')}
          </p>
          {currentCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {currentCourses.map((course , index) => (
                <CourseCard
                  key={index}
                  id={course.id}
                  image={course.image}
                  title={course.title}
                  category={course.category}
                  price={course.price}
                  rating={course.rating.toString()}
                  instructor={course.instructor}
                  description={course.description}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                <h3 className="text-xl font-semibold">{t('coursesPage.noCourses_title')}</h3>
                <p className="text-neutral-500 mt-2">{t('coursesPage.noCourses_description')}</p>
            </div>
          )}

          {totalPages > 1 && (
            <Pagination className="mt-12 select-none">
              <PaginationContent>
                <PaginationItem className="cursor-pointer">
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'hover:text-purple-600'}
                  />
                </PaginationItem>
                <PaginationItem>
                <span className="px-4 py-2 text-sm">
                    {t('coursesPage.pagination_page')} {currentPage} {t('coursesPage.pagination_of')} {totalPages}
                  </span>
                </PaginationItem>
                <PaginationItem className="cursor-pointer">
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'hover:text-purple-600'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </section>
  );
};

export default CoursesPage;