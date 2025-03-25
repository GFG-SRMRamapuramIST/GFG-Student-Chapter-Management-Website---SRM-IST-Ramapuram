import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaUniversalAccess, FaLightbulb, FaGraduationCap } from 'react-icons/fa';

const VideoFeatureSection = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const keyHighlights = [
    {
      icon: FaUniversalAccess,
      title: "Accessible Learning",
      description: "Break barriers and democratize tech education for all."
    },
    {
      icon: FaLightbulb,
      title: "Innovation Catalyst",
      description: "Transform potential into groundbreaking technological solutions."
    },
    {
      icon: FaGraduationCap,
      title: "Continuous Growth",
      description: "Your journey from student to industry-ready professional starts here."
    }
  ];

  return (
    <div className="relative bg-gradient-to-br from-white to-gfgsc-green-200/30 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4 mb-12"
        >
          <h2 className="text-4xl font-bold text-center text-gfg-black">
            Our Vision, Our Journey
          </h2>
          <p className="text-xl text-center text-gray-600 max-w-3xl mx-auto">
            Discover how we're reshaping the landscape of tech education and community collaboration.
          </p>
        </motion.div>

        <div className="relative flex flex-col items-center">
          {/* Video Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-4xl aspect-video rounded-3xl overflow-hidden shadow-2xl relative"
          >
            {!isVideoPlaying ? (
              <>
                <img 
                  src="https://placehold.co/1920x1080?text=GFGSC+Promo" 
                  alt="Video Thumbnail" 
                  className="w-full h-full object-cover"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsVideoPlaying(true)}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="bg-gfgsc-green/80 text-white rounded-full w-24 h-24 flex items-center justify-center">
                    <FaPlay className="text-4xl ml-2" />
                  </div>
                </motion.button>
              </>
            ) : (
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1"
                title="GFGSC Promo Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}
          </motion.div>

          {/* Key Highlights Overlay */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 grid md:grid-cols-3 gap-8"
          >
            {keyHighlights.map((highlight, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all group"
              >
                <div className="mb-4 flex items-center">
                  <highlight.icon 
                    className="text-3xl text-gfgsc-green group-hover:text-gfg-green transition-colors" 
                  />
                </div>
                <h3 className="text-xl font-bold text-gfg-black mb-2">
                  {highlight.title}
                </h3>
                <p className="text-gray-600">
                  {highlight.description}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Subtle Background Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-gfgsc-green-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-gfgsc-green-200/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default VideoFeatureSection;