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
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quibusdam ad error, ratione a beatae provident atque suscipit asperiores deserunt, voluptas fuga veritatis reiciendis placeat facere vero nesciunt cumque. Quas, voluptate!
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi sit omnis voluptates porro pariatur dolore vero? Autem, numquam! Labore earum animi, provident ducimus accusamus eveniet doloribus tempore ullam corporis aspernatur!
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum dolorum temporibus corrupti amet consequatur qui nemo eum tempore voluptates id ad facere fugit perspiciatis accusantium, laborum alias officiis omnis ut!
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni, dolores adipisci aut nostrum culpa labore rerum officiis excepturi ea inventore consequatur in, nemo natus. Expedita eligendi sequi modi autem magnam? Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam veritatis voluptates blanditiis sequi iusto maiores at tempore molestias tempora amet saepe distinctio, corporis culpa. Quia maxime perspiciatis veniam quas sequi?
                    </p>

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
                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quibusdam ad error, ratione a beatae provident atque suscipit asperiores deserunt, voluptas fuga veritatis reiciendis placeat facere vero nesciunt cumque. Quas, voluptate!
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi sit omnis voluptates porro pariatur dolore vero? Autem, numquam! Labore earum animi, provident ducimus accusamus eveniet doloribus tempore ullam corporis aspernatur!
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum dolorum temporibus corrupti amet consequatur qui nemo eum tempore voluptates id ad facere fugit perspiciatis accusantium, laborum alias officiis omnis ut!
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni, dolores adipisci aut nostrum culpa labore rerum officiis excepturi ea inventore consequatur in, nemo natus. Expedita eligendi sequi modi autem magnam? Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam veritatis voluptates blanditiis sequi iusto maiores at tempore molestias tempora amet saepe distinctio, corporis culpa. Quia maxime perspiciatis veniam quas sequi?
                        </p>
                    </div>
                    
                    <p className="text-sm md:text-base lg:text-lg text-gray-700 text-justify clear-both pt-4">
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quibusdam ad error, ratione a beatae provident atque suscipit asperiores deserunt, voluptas fuga veritatis reiciendis placeat facere vero nesciunt cumque. Quas, voluptate!
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi sit omnis voluptates porro pariatur dolore vero? Autem, numquam! Labore earum animi, provident ducimus accusamus eveniet doloribus tempore ullam corporis aspernatur!
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum dolorum temporibus corrupti amet consequatur qui nemo eum tempore voluptates id ad facere fugit perspiciatis accusantium, laborum alias officiis omnis ut!
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni, dolores adipisci aut nostrum culpa labore rerum officiis excepturi ea inventore consequatur in, nemo natus. Expedita eligendi sequi modi autem magnam? Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam veritatis voluptates blanditiis sequi iusto maiores at tempore molestias tempora amet saepe distinctio, corporis culpa. Quia maxime perspiciatis veniam quas sequi?
                    </p>
                </div>
                <div className="w-full bg-white rounded-xl shadow-sm p-4 md:p-8 mt-8">
                    <ContinuousCarousel />
                </div>
            </div>
        </div>
    );
};

export default AboutUs;