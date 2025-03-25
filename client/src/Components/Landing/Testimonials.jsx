import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaQuoteLeft } from "react-icons/fa";
import { AakashPfp } from "../../Assets";

const TestimonialsSection = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  const testimonials = [
    {
      quote:
        "The platform transformed my coding journey. It's not just about learning, but about growing together as a tech community.",
      name: "Sanjana Jaldu",
      role: "Vice President",
      image: "https://placehold.co/400x400",
      company: "GeeksforGeeks Student Chapter",
    },
    {
      quote:
        "What sets this platform apart is its incredible ability to blend competitive spirit with genuine learning and support.",
      name: "Aakash Kumar",
      role: "President",
      image: AakashPfp,
      company: "GeeksforGeeks Student Chapter",
    },
    {
      quote:
        "More than just a platform, it's a launchpad for ambitious tech enthusiasts to transform their potential into reality.",
      name: "Rachit Dhaka",
      role: "Operational Head",
      image: "https://placehold.co/400x400",
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

    intervalRef.current = setInterval(scrollToNextTestimonial, 3000); // Change every 3 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  return (
    <div className="relative py-20 bg-gfg-white">
      <div
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gfg-black mb-4">
            Voices of Our Community
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              {/* Left - Testimonial Text */}
              <div className="space-y-8">
                <div className="relative">
                  <FaQuoteLeft className="absolute -top-8 -left-8 text-gfgsc-green/20 text-6xl" />
                  <p className="text-2xl font-light text-gfg-black leading-relaxed italic">
                    "{testimonials[activeTestimonial].quote}"
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gfgsc-green">
                    {testimonials[activeTestimonial].name}
                  </h3>
                  <p className="text-gray-600">
                    {testimonials[activeTestimonial].role} |{" "}
                    {testimonials[activeTestimonial].company}
                  </p>
                </div>
              </div>

              {/* Right - Profile Image */}
              <div className="flex justify-center">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 1 }}
                  className="relative"
                >
                  <div className="w-96 h-96 rounded-3xl overflow-hidden shadow-2xl">
                    <img
                      src={testimonials[activeTestimonial].image}
                      alt={testimonials[activeTestimonial].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gfgsc-green rounded-full shadow-lg"></div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Dots */}
          <div className="flex justify-center space-x-4 mt-16">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`
                  w-4 h-4 rounded-full transition-all duration-300
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
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-gfgsc-green-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gfgsc-green-200/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
