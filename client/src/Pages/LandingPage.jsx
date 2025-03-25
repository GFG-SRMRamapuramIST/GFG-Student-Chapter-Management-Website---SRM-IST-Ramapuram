import { AboutSection, HeroSection, TestimonialsSection, VideoFeatureSection } from "../Components";

function LandingPage() {
  return (
    <div className="relative">
      <HeroSection />
      <AboutSection />
      <VideoFeatureSection />
      <TestimonialsSection />
    </div>
  );
}

export default LandingPage;
