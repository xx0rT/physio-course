import HeroSection from "@/components/home/heroSection";
import CategoriesSection from "@/components/home/categoriesSection";
import CoursesSection from "@/components/home/CoursesSection";
import AboutUsSection from "@/components/home/aboutUsSection";
import WhyChooseUsSection from "@/components/home/chooseUsSection";
import SkillsSection from "@/components/home/skillsSection";
import TestimonialSection from "@/components/home/testimonialSection";
import InstructorsSection from "@/components/home/InstructorsSection";
import FAQSection from "@/components/home/FAQSection";
import BentoGrid from "@/components/home/bentogrid";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <CoursesSection />
      <BentoGrid />
      <AboutUsSection />
      <WhyChooseUsSection />
      <SkillsSection />
      <TestimonialSection />
      <InstructorsSection />
      <FAQSection />
    </>
  );
}
