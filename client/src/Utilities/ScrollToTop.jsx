import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

import { FaArrowUp } from "react-icons/fa";

const ScrollToTop = () => {
  const [backToTop, setBackToTop] = useState(false);
  const location = useLocation();

  // Scroll to the top on route change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [location.pathname]); // Trigger when the pathname changes

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setBackToTop(true);
      } else {
        setBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollUp = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {backToTop && (
        <motion.button
          className="bg-gray-700 p-2 rounded-full"
          onClick={scrollUp}
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.2 }}
        >
          <FaArrowUp className="text-gfgsc-green w-5 h-5" />
        </motion.button>
      )}
    </div>
  );
};

export default ScrollToTop;
