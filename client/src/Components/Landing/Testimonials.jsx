import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaQuoteLeft } from "react-icons/fa";
import { AakashPic, AbhishekPic, RachitPic, SanjanaPic } from "../../Assets";
import { ImageLoaderComponent } from "../../Utilities";

const TestimonialsSection = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  const testimonials = [
    {
      quote:
        "What sets this platform apart is its incredible ability to blend competitive spirit with genuine learning and support.",
      name: "Aakash Kumar",
      role: "President",
      image: AakashPic,
      company: "GeeksforGeeks Student Chapter",
    },
    {
      quote:
        "The platform transformed my coding journey. It's not just about learning, but about growing together as a tech community.",
      name: "Sanjana Jaldu",
      role: "Vice President",
      image: SanjanaPic,
      company: "GeeksforGeeks Student Chapter",
    },
    {
      quote:
        "More than just a platform, it's a launchpad for ambitious tech enthusiasts to transform their potential into reality.",
      name: "Rachit Dhaka",
      role: "Operational Head",
      image: RachitPic,
      company: "GeeksforGeeks Student Chapter",
    },
    {
      quote:
        "Being part of this community has been a game-changer. It has provided me with opportunities to learn, lead, and inspire.",
      name: "Abhishek Newase",
      role: "Technical Head",
      image: AbhishekPic,
      company: "GeeksforGeeks Student Chapter",
    },
  ];

  useEffect(() => {
    const scrollToNextTestimonial = () => {
      if (!isPaused) {
        setActiveTestimonial((prev) =>
          prev === testimonials.length - 1 ? 0 : prev + 1
        );
      }
    };

    intervalRef.current = setInterval(scrollToNextTestimonial, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, testimonials.length]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  return (
    <div className="relative py-12 md:py-20 bg-gfg-white overflow-hidden">
      <div
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gfg-black mb-3 md:mb-4">
            Voices of Our Community
          </h2>
          <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto">
            Hear from those who've experienced the transformative power of our
            platform
          </p>
        </motion.div>

        <div className="relative">
          {/* Testimonial Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col-reverse md:grid md:grid-cols-3 gap-8 md:gap-12 items-center"
            >
              {/* Mobile: Profile Image */}
              <div className="md:hidden flex justify-center items-center mb-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative w-32 h-32"
                >
                  <div className="w-full h-full rounded-full overflow-hidden shadow-lg">
                    <img
                      src={testimonials[activeTestimonial].image}
                      alt={testimonials[activeTestimonial].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>
              </div>

              {/* Left - Testimonial Text */}
              <div className="md:col-span-2 pace-y-6 md:space-y-8 text-center md:text-left">
                <div className="relative">
                  <FaQuoteLeft className="hidden md:block absolute -top-8 -left-8 text-gfgsc-green/20 text-6xl" />
                  <p className="text-lg md:text-2xl font-light text-gfg-black leading-relaxed italic">
                    "{testimonials[activeTestimonial].quote}"
                  </p>
                </div>

                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gfgsc-green">
                    {testimonials[activeTestimonial].name}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600">
                    {testimonials[activeTestimonial].role} |{" "}
                    {testimonials[activeTestimonial].company}
                  </p>
                </div>
              </div>

              {/* Desktop: Profile Image */}
              <div className="hidden md:flex justify-center">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 1 }}
                  className="relative"
                >
                  <div className="w-64 h-64 rounded-3xl overflow-hidden shadow-2xl">
                    <ImageLoaderComponent
                      url={testimonials[activeTestimonial].image.url}
                      alt={testimonials[activeTestimonial].image.alt}
                      hashCode={testimonials[activeTestimonial].image.hashCode}
                      className="w-full h-full object-cover"
                      blurWidth="400px"
                      blurHeight="400px"
                    />
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gfgsc-green rounded-full shadow-lg"></div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Dots */}
          <div className="flex justify-center space-x-2 md:space-x-4 mt-8 md:mt-16">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`
                  w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-300
                  ${
                    activeTestimonial === index
                      ? "bg-gfgsc-green scale-125"
                      : "bg-gray-300 hover:bg-gfgsc-green/50"
                  }
                `}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Subtle Background Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-48 md:w-64 h-48 md:h-64 bg-gfgsc-green-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-gfgsc-green-200/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
