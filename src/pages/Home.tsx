import HeroSection from "@/components/home/heroSection";
import Features from "@/components/home/features";
import WhyChooseUsSection from "@/components/home/chooseUsSection";
import AboutUsSection from "@/components/home/aboutUsSection";
import BentoGrid from "@/components/home/bentogrid";
import CoursesSection from "@/components/home/CoursesSection";
import InstructorsSection from "@/components/home/InstructorsSection";
import Testimonials from "@/components/home/testimonials";
import TestimonialSection from "@/components/home/testimonialSection";
import SkillsSection from "@/components/home/skillsSection";
import FAQSection from "@/components/home/FAQSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <Features />
      <WhyChooseUsSection />
      <AboutUsSection />
      <BentoGrid />
      <CoursesSection />
      <InstructorsSection />
      <Testimonials />
      <TestimonialSection />
      <SkillsSection />
      <FAQSection />
    </>
  );
}
