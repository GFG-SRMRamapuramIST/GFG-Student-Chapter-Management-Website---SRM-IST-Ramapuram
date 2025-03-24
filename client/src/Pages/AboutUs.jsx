import React, { useState, useEffect, useRef } from 'react';
import { AakashPfp } from "../Assets";
import { logo } from "../Assets";
import GeekFest from "../Assets/GeekFest.png";
import HalloweenHangout from "../Assets/HalloweenHangout.jpg";
import OnboardingMeeting from "../Assets/OnboardingMeeting.jpg";

const ContinuousCarousel = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);


  const images = [
    GeekFest,
    HalloweenHangout,
    OnboardingMeeting,
    AakashPfp
  ];

  // This effect handles the animation and cleanup
  useEffect(() => {
    const slideWidth = 332; 
    const duration = 20000; 
    
    const animate = (currentTime) => {
      if (isPaused) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      if (!startTimeRef.current) startTimeRef.current = currentTime;
      const elapsed = currentTime - startTimeRef.current;
      const progress = (elapsed % duration) / duration;
      
      const totalMove = slideWidth * images.length;
      const currentMove = progress * totalMove;
      
      const newIndex = Math.floor((currentMove / slideWidth) % images.length);
      setActiveIndex(newIndex);

      if (containerRef.current) {
        containerRef.current.style.transform = `translateX(-${currentMove}px)`;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    
    // Cleanup function
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused, images.length]);

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto overflow-hidden mt-8">
      <div className="overflow-hidden">
        <div 
          ref={containerRef}
          className="flex"
        >
          {images.map((image, index) => (
            <div
              key={`first-${index}`}
              className="flex-shrink-0 mr-8 border-2 border-black rounded-lg p-2"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-[300px] rounded-lg object-cover cursor-pointer"
              />
            </div>
          ))}
          {images.map((image, index) => (
            <div
              key={`second-${index}`}
              className="flex-shrink-0 mr-8 border-2 border-black rounded-lg p-2"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-[300px] rounded-lg object-cover cursor-pointer "
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-8 space-x-4">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors duration-300 
              ${activeIndex === index ? 'bg-emerald-600' : 'bg-gray-300'}`}
          />
        ))}
      </div>
    </div>
  );
};

const AboutUs = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
            <div className="max-w-6xl w-full bg-white rounded-xl shadow-sm p-4 md:p-8 space-y-2 md:space-y-4 mt-4 md:mt-8">
                <img
                    src={logo}
                    alt="gfglogo"
                    className="w-full h-[200px] object-contain rounded-lg"
                />
                <div>
                    <p className="text-sm md:text-base lg:text-lg text-gray-700 text-justify">
                    The GeeksforGeeks Student Chapter, SRMIST is a vibrant and driven community committed to bridging the gap between academic knowledge and industry demands. Our mission is to empower students with the technical expertise and problem-solving abilities required to thrive in the fast-evolving tech landscape. We focus extensively on Competitive Programming, treating it as a strategic discipline that sharpens analytical thinking, improves coding efficiency, and prepares students for coding contests and technical interviews. Our structured approach to Data Structures and Algorithms (DSA) ensures that even the most complex concepts are broken down into simplified, intuitive, and practical applications, making them easier to grasp and implement.  </p>
                    
                    <p className="text-sm md:text-base lg:text-lg text-gray-700 text-justify">
                    Beyond technical learning, we provide students with a platform to engage with industry experts through guest lectures, mentorship programs, and networking opportunities. These interactions offer valuable insights into real-world challenges, trends, and career pathways, helping students stay ahead of the curve. Through hands-on projects, hackathons, and collaborative learning sessions, we create an environment that fosters innovation and teamwork. Our ultimate goal is to ensure that by the time our members graduate, they have the knowledge, confidence, and industry exposure to secure positions in leading technology companies. Whether you are a beginner taking your first steps in coding or an experienced programmer looking to refine your skills, our chapter offers a space to learn, grow, and excel.    </p>


                    <h2 className="text-4xl md:text-2xl mt-6 md:mt-8 mb-6 md:mb-8 font-semibold text-emerald-600">
                        Our Public Website
                    </h2>

                    <div className="relative">
                        <div className="float-right ml-4 md:ml-8 mb-4 md:mb-8 w-full sm:w-auto">
                            <div className="w-full sm:w-64 md:w-80 lg:w-96 h-auto relative group">
                                <img 
                                    src={AakashPfp} 
                                    alt="About Us" 
                                    className="w-full h-auto max-h-48 md:max-h-60 lg:max-h-72 object-contain rounded-lg shadow-md"
                                />
                                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                                    <a 
                                        href="https://gfgsrmrmp.vercel.app/" 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="px-4 py-2 md:px-6 md:py-3 bg-emerald-600 text-white text-sm md:text-base rounded-lg font-medium transform scale-95 hover:scale-100 transition-transform duration-200 hover:bg-emerald-500"
                                    >
                                        Visit Website
                                    </a>
                                </div>
                            </div>
                        </div>
                        <p className="text-sm md:text-base lg:text-lg text-gray-700 text-justify mt-2">
                        The GFG Community Hub is a centralized digital platform designed to enhance engagement and provide easy access to resources for tech enthusiasts at SRMIST. Developed using React, GSAP, TailwindCSS, and Sanity, the website seamlessly integrates event listings, leadership profiles, and membership applications. It offers a well-structured and intuitive user experience, allowing students to stay updated on upcoming workshops, coding contests, and mentorship programs. With a refined UI/UX, the platform ensures smooth navigation, making it easier for members to explore various opportunities and actively participate in community activities.  

                       </p>
                        <p className="text-sm md:text-base lg:text-lg text-gray-700 text-justify mt-2">
                        Beyond event updates and leadership details, the website includes a dedicated "Join Us" page, encouraging students to become part of the community. It also features a blog section that showcases recent activities, key highlights, and insights from past events, keeping members informed about the latest developments. A testimonials section provides firsthand experiences from students who have gained valuable skills and opportunities through the community. The platform continues to evolve, fostering a collaborative learning environment where students can connect, grow, and build a strong foundation in technology.
                        </p>
                        <p className="text-sm md:text-base lg:text-lg text-gray-700 text-justify mt-2">
                        The website not only serves as an information hub but also fosters a sense of belonging within the community. It provides a space where members can explore opportunities, share their experiences, and stay connected with like-minded peers. The dynamic interface ensures that every visitor, whether a beginner or an advanced coder, can find relevant resources to enhance their technical skills. With continuous updates and improvements, the platform remains a vital tool in bridging the gap between learning and industry readiness, empowering students to take meaningful steps toward their careers in technology.  </p>
                    </div>
                    
                  
                </div>
                <div className="w-full bg-white rounded-xl shadow-sm p-4 md:p-8 mt-8">
                    <ContinuousCarousel />
                </div>
            </div>
        </div>
    );
};

export default AboutUs;