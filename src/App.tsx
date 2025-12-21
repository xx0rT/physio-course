import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/context/authProvider';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import ScrollTopBtn from '@/components/scrollTopBtn';

import HomePage from '@/pages/Home';
import CoursesPage from '@/pages/Courses';
import CourseDetailsPage from '@/pages/CourseDetails';
import CoursePlayerPage from '@/pages/CoursePlayer';
import InstructorsPage from '@/pages/Instructors';
import InstructorDetailsPage from '@/pages/InstructorDetails';
import ServicesPage from '@/pages/Services';
import FAQPage from '@/pages/FAQ';
import SupportPage from '@/pages/Support';
import SearchPage from '@/pages/Search';
import DashboardPage from '@/pages/Dashboard';
import CartPage from '@/pages/Cart';
import CheckoutPage from '@/pages/Checkout';
import MyLearningPage from '@/pages/MyLearning';
import WishlistPage from '@/pages/Wishlist';
import LoginPage from '@/pages/Login';
import RegisterPage from '@/pages/Register';
import BecomeInstructorPage from '@/pages/BecomeInstructor';
import AddCoursesPage from '@/pages/AddCourses';
import UpdateProfilePage from '@/pages/UpdateProfile';
import UpdatePasswordPage from '@/pages/UpdatePassword';
import NotFoundPage from '@/pages/NotFound';

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const locale = i18n.language;
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  return (
    <AuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/courses/:id" element={<CourseDetailsPage />} />
                <Route path="/courses/player/:id" element={<CoursePlayerPage />} />
                <Route path="/instructors" element={<InstructorsPage />} />
                <Route path="/instructors/:id" element={<InstructorDetailsPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/support" element={<SupportPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/dashboard/cart" element={<CartPage />} />
                <Route path="/dashboard/checkout" element={<CheckoutPage />} />
                <Route path="/dashboard/my-learning" element={<MyLearningPage />} />
                <Route path="/dashboard/wishlist" element={<WishlistPage />} />
                <Route path="/auth/login" element={<LoginPage />} />
                <Route path="/auth/register" element={<RegisterPage />} />
                <Route path="/auth/becomeInstructor" element={<BecomeInstructorPage />} />
                <Route path="/auth/addCourses" element={<AddCoursesPage />} />
                <Route path="/auth/update-profile" element={<UpdateProfilePage />} />
                <Route path="/auth/update-password" element={<UpdatePasswordPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
            <ScrollTopBtn />
          </div>
        </Router>
        <ToastContainer />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
