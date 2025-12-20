import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authProvider";
import { supabase } from "@/lib/supabase";
import { FaStar, FaRegStar, FaUsers, FaClock, FaLanguage, FaCheckCircle, FaShoppingCart, FaHeart, FaRegHeart, FaPlay } from "react-icons/fa";
import { MdSignalCellularAlt } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface CourseSection {
  id: string;
  title: string;
  description: string;
  duration: number;
  order_index: number;
}

export default function CourseDetails() {
  const { id } = useParams<{ id: string }>();
  const { selectedCourse, fetchCourseById, user } = useAuth();
  const navigate = useNavigate();
  const [sections, setSections] = useState<CourseSection[]>([]);
  const [isInCart, setIsInCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchCourseById(id);
      loadCourseSections();
      if (user) {
        checkUserRelations();
      }
    }
  }, [id, user]);

  const loadCourseSections = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from('course_sections')
        .select('*')
        .eq('course_id', id)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setSections(data || []);
    } catch (error) {
      console.error('Failed to load course sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkUserRelations = async () => {
    if (!user || !id) return;

    try {
      const [cartResult, wishlistResult, enrollmentResult] = await Promise.all([
        supabase.from('cart_items').select('id').eq('user_id', user._id).eq('course_id', id).maybeSingle(),
        supabase.from('wishlist').select('id').eq('user_id', user._id).eq('course_id', id).maybeSingle(),
        supabase.from('enrollments').select('id').eq('user_id', user._id).eq('course_id', id).maybeSingle(),
      ]);

      setIsInCart(!!cartResult.data);
      setIsInWishlist(!!wishlistResult.data);
      setIsEnrolled(!!enrollmentResult.data);
    } catch (error) {
      console.error('Failed to check user relations:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login to add to cart");
      navigate('/auth/login');
      return;
    }

    try {
      if (isInCart) {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user._id)
          .eq('course_id', id);

        if (error) throw error;
        setIsInCart(false);
        toast.success("Removed from cart");
      } else {
        const { error } = await supabase
          .from('cart_items')
          .insert({ user_id: user._id, course_id: id });

        if (error) throw error;
        setIsInCart(true);
        toast.success("Added to cart");
      }
    } catch (error) {
      console.error('Cart operation failed:', error);
      toast.error("Operation failed");
    }
  };

  const handleToggleWishlist = async () => {
    if (!user) {
      toast.error("Please login to add to wishlist");
      navigate('/auth/login');
      return;
    }

    try {
      if (isInWishlist) {
        const { error } = await supabase
          .from('wishlist')
          .delete()
          .eq('user_id', user._id)
          .eq('course_id', id);

        if (error) throw error;
        setIsInWishlist(false);
        toast.success("Removed from wishlist");
      } else {
        const { error } = await supabase
          .from('wishlist')
          .insert({ user_id: user._id, course_id: id });

        if (error) throw error;
        setIsInWishlist(true);
        toast.success("Added to wishlist");
      }
    } catch (error) {
      console.error('Wishlist operation failed:', error);
      toast.error("Operation failed");
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      toast.error("Please login to enroll");
      navigate('/auth/login');
      return;
    }

    if (selectedCourse?.price === 0) {
      try {
        const { error } = await supabase
          .from('enrollments')
          .insert({ user_id: user._id, course_id: id });

        if (error) throw error;

        const { error: updateError } = await supabase
          .from('courses')
          .update({ total_students: (selectedCourse?.totalStudents || 0) + 1 })
          .eq('id', id);

        if (updateError) console.error('Failed to update student count:', updateError);

        setIsEnrolled(true);
        toast.success("Successfully enrolled!");
        navigate('/my-learning');
      } catch (error) {
        console.error('Enrollment failed:', error);
        toast.error("Enrollment failed");
      }
    } else {
      if (!isInCart) {
        await handleAddToCart();
      }
      navigate('/cart');
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className="text-yellow-500" />
        ) : (
          <FaRegStar key={i} className="text-gray-300" />
        )
      );
    }
    return stars;
  };

  if (loading || !selectedCourse) {
    return (
      <div className="container mx-auto px-5 py-20 mt-20">
        <div className="text-center">
          <p className="text-neutral-600 dark:text-neutral-400">Loading course details...</p>
        </div>
      </div>
    );
  }

  const totalDuration = sections.reduce((sum, section) => sum + section.duration, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20 mt-16">
        <div className="container mx-auto px-5">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h1 className="text-4xl font-bold mb-4">{selectedCourse.title}</h1>
              <p className="text-lg mb-6">{selectedCourse.description}</p>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex">{renderStars(Math.round(selectedCourse.averageRating))}</div>
                <span className="font-semibold">{selectedCourse.averageRating.toFixed(1)}</span>
                <span>({selectedCourse.totalReviews} reviews)</span>
              </div>

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <FaUsers />
                  <span>{selectedCourse.totalStudents} students</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaClock />
                  <span>{totalDuration} min</span>
                </div>
                <div className="flex items-center gap-2">
                  <MdSignalCellularAlt />
                  <span>{selectedCourse.level}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaLanguage />
                  <span>{selectedCourse.language.join(', ')}</span>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm">Created by <span className="font-semibold">{selectedCourse.instructor.fullName}</span></p>
              </div>
            </div>

            <div className="md:col-span-1">
              <div className="bg-white dark:bg-neutral-800 rounded-lg overflow-hidden shadow-xl">
                <img
                  src={selectedCourse.thumbnail}
                  alt={selectedCourse.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="text-3xl font-bold text-neutral-800 dark:text-white mb-4">
                    {selectedCourse.price === 0 ? 'Free' : `$${selectedCourse.price}`}
                  </div>

                  {isEnrolled ? (
                    <button
                      onClick={() => navigate(`/course-player/${id}`)}
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 mb-3"
                    >
                      <FaPlay /> Continue Learning
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleEnroll}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg mb-3"
                      >
                        {selectedCourse.price === 0 ? 'Enroll Now' : 'Buy Now'}
                      </button>
                      <div className="flex gap-2">
                        <button
                          onClick={handleAddToCart}
                          className={`flex-1 ${isInCart ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'} text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2`}
                        >
                          <FaShoppingCart /> {isInCart ? 'In Cart' : 'Add to Cart'}
                        </button>
                        <button
                          onClick={handleToggleWishlist}
                          className="px-4 py-3 border-2 border-purple-600 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-50 dark:hover:bg-neutral-700"
                        >
                          {isInWishlist ? <FaHeart className="text-xl" /> : <FaRegHeart className="text-xl" />}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-5 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {selectedCourse.whatYouWillLearn.length > 0 && (
              <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-4 text-neutral-800 dark:text-white">What you'll learn</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {selectedCourse.whatYouWillLearn.map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-neutral-700 dark:text-neutral-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {sections.length > 0 && (
              <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-4 text-neutral-800 dark:text-white">Course Content</h2>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  {sections.length} sections • {totalDuration} min total length
                </p>
                <div className="space-y-2">
                  {sections.map((section) => (
                    <div
                      key={section.id}
                      className="border dark:border-neutral-700 rounded p-4 hover:bg-gray-50 dark:hover:bg-neutral-700"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-neutral-800 dark:text-white">{section.title}</h3>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">{section.description}</p>
                        </div>
                        <span className="text-sm text-neutral-500 ml-4">{section.duration} min</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedCourse.requirements.length > 0 && (
              <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-4 text-neutral-800 dark:text-white">Requirements</h2>
                <ul className="list-disc list-inside space-y-2">
                  {selectedCourse.requirements.map((req, index) => (
                    <li key={index} className="text-neutral-700 dark:text-neutral-300">{req}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4 text-neutral-800 dark:text-white">Description</h2>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {selectedCourse.description}
              </p>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow sticky top-24">
              <h3 className="text-xl font-bold mb-4 text-neutral-800 dark:text-white">Instructor</h3>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={selectedCourse.instructor.profilePic || '/home/person1.png'}
                  alt={selectedCourse.instructor.fullName}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h4 className="font-semibold text-neutral-800 dark:text-white">
                    {selectedCourse.instructor.fullName}
                  </h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Instructor</p>
                </div>
              </div>
              <button
                onClick={() => navigate(`/instructors/${selectedCourse.instructor._id}`)}
                className="w-full border-2 border-purple-600 text-purple-600 dark:text-purple-400 font-semibold py-2 rounded-lg hover:bg-purple-50 dark:hover:bg-neutral-700"
              >
                View Profile
              </button>
            </div>

            {selectedCourse.tags.length > 0 && (
              <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow mt-6">
                <h3 className="text-xl font-bold mb-4 text-neutral-800 dark:text-white">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCourse.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
