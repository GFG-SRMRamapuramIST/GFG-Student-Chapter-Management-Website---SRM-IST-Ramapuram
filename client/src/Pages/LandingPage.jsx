import ReactGA from "react-ga4";
import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";

import { BsStars } from "react-icons/bs";
import { BiGroup, BiVideo } from "react-icons/bi";
import { FaQuoteRight } from "react-icons/fa";

import {
  AboutSection,
  HeroSection,
  TestimonialsSection,
  VideoFeatureSection,
} from "../Components";

function LandingPage() {
  // Google Analytics tracking
  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: "gfgsrm-tech.vercel.app/",
      title: "Landing Page",
    });
  }, []);

  // State for active section
  const [activeSection, setActiveSection] = useState("hero");

  // Refs for scroll sections
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const videoRef = useRef(null);
  const testimonialsRef = useRef(null);

  // Check if sections are in view
  const heroInView = useInView(heroRef, { margin: "-100px 0px" });
  const aboutInView = useInView(aboutRef, { margin: "-100px 0px" });
  const videoInView = useInView(videoRef, { margin: "-100px 0px" });
  const testimonialsInView = useInView(testimonialsRef, {
    margin: "-100px 0px",
  });

  // Update active section based on scroll position
  useEffect(() => {
    if (heroInView) setActiveSection("hero");
    else if (aboutInView) setActiveSection("about");
    else if (videoInView) setActiveSection("video");
    else if (testimonialsInView) setActiveSection("testimonials");
  }, [heroInView, aboutInView, videoInView, testimonialsInView]);

  // Scroll to section function
  const scrollToSection = (sectionRef) => {
    sectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="relative">
      {/* Floating Navigation */}
      <div className="fixed top-1/2 -translate-y-1/2 right-6 z-50 hidden md:block">
        <div className="flex flex-col items-center space-y-4 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg">
          {[
            { id: "hero", icon: <BsStars size={18} /> },
            { id: "about", icon: <BiGroup size={18} /> },
            { id: "video", icon: <BiVideo size={18} /> },
            { id: "testimonials", icon: <FaQuoteRight size={16} /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() =>
                scrollToSection(
                  item.id === "hero"
                    ? heroRef
                    : item.id === "about"
                    ? aboutRef
                    : item.id === "video"
                    ? videoRef
                    : testimonialsRef
                )
              }
              className={`p-2 rounded-full transition-all duration-300 ${
                activeSection === item.id
                  ? "bg-gfgsc-green text-white"
                  : "bg-transparent text-gfg-black hover:bg-gfgsc-green-200"
              }`}
              aria-label={`Go to ${item.id} section`}
            >
              {item.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Sections with refs */}
      <div ref={heroRef}>
        <HeroSection />
      </div>
      <div ref={aboutRef}>
        <AboutSection />
      </div>
      <div ref={videoRef}>
        <VideoFeatureSection />
      </div>
      <div ref={testimonialsRef}>
        <TestimonialsSection />
      </div>
    </div>
  );
}

export default LandingPage;
