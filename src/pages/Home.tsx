import HeroSection from "@/components/home/heroSection";
import Features from "@/components/home/features";
import WhyChooseUsSection from "@/components/home/chooseUsSection";
import CertificatesSection from "@/components/home/certificatesSection";
import AboutUsSection from "@/components/home/aboutUsSection";
import BentoGrid from "@/components/home/bentogrid";
import CoursesSection from "@/components/home/CoursesSection";
import InstructorsSection from "@/components/home/InstructorsSection";
import Testimonials from "@/components/home/testimonials";
import AsSeenOnSection from "@/components/home/asSeenOnSection";
import TestimonialSection from "@/components/home/testimonialSection";
import SkillsSection from "@/components/home/skillsSection";
import FAQSection from "@/components/home/FAQSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <Features />
      <WhyChooseUsSection />
      <CertificatesSection />
      <AboutUsSection />
      <BentoGrid />
      <CoursesSection />
      <InstructorsSection />
      <Testimonials />
      <AsSeenOnSection />
      <TestimonialSection />
      <SkillsSection />
      <FAQSection />
    </>
  );
}
