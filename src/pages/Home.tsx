import HeroSection from "@/components/home/heroSection";
import CategoriesSection from "@/components/home/categoriesSection";
import CoursesSection from "@/components/home/CoursesSection";
import Features from "@/components/home/features";
import WhyChooseUsSection from "@/components/home/chooseUsSection";
import CertificatesSection from "@/components/home/certificatesSection";
import AboutUsSection from "@/components/home/aboutUsSection";
import BentoGrid from "@/components/home/bentogrid";
import InstructorsSection from "@/components/home/InstructorsSection";
import Testimonials from "@/components/home/testimonials";
import AsSeenOnSection from "@/components/home/asSeenOnSection";
import TestimonialSection from "@/components/home/testimonialSection";
import SkillsSection from "@/components/home/skillsSection";
import FAQSection from "@/components/home/FAQSection";
import ScrollProgress from "@/components/shared/scroll-progress";
import StickySection from "@/components/shared/sticky-section";

export default function HomePage() {
  return (
    <>
      <ScrollProgress />

      <StickySection id="hero">
        <HeroSection />
      </StickySection>

      <StickySection id="categories" stickyLabel="Kategorie">
        <CategoriesSection />
      </StickySection>

      <StickySection id="courses" stickyLabel="Kurzy">
        <CoursesSection />
      </StickySection>

      <StickySection id="features" stickyLabel="Naše funkce">
        <Features />
      </StickySection>

      <StickySection id="why-choose" stickyLabel="Proč si vybrat nás">
        <WhyChooseUsSection />
      </StickySection>

      <StickySection id="certificates" stickyLabel="Certifikace">
        <CertificatesSection />
      </StickySection>

      <StickySection id="about" stickyLabel="O nás">
        <AboutUsSection />
      </StickySection>

      <StickySection id="services" stickyLabel="Naše služby">
        <BentoGrid />
      </StickySection>

      <StickySection id="instructors" stickyLabel="Naši lektoři">
        <InstructorsSection />
      </StickySection>

      <StickySection id="testimonials" stickyLabel="Co říkají studenti">
        <Testimonials />
        <TestimonialSection />
      </StickySection>

      <StickySection id="stats" stickyLabel="Statistiky">
        <SkillsSection />
      </StickySection>

      <StickySection id="faq" stickyLabel="Časté dotazy">
        <FAQSection />
      </StickySection>
    </>
  );
}
