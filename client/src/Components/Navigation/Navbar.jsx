import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaCalendarAlt,
  FaTrophy,
  FaBook,
  FaGithub,
  FaLinkedin,
  FaDiscord,
} from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { SiGeeksforgeeks } from "react-icons/si";
import { motion } from "framer-motion";
import { BiSolidDashboard } from "react-icons/bi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isLoggedIn =
    location.pathname !== "/" && !location.pathname.startsWith("/auth");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = isLoggedIn
    ? [
        { name: "Dashboard", path: "/dashboard", icon: <BiSolidDashboard className="text-xl" /> },
        {
          name: "Teams",
          path: "/teams",
          icon: <FaUsers className="text-xl" />,
        },
        {
          name: "Calendar",
          path: "/calendar",
          icon: <FaCalendarAlt className="text-xl" />,
        },
        {
          name: "Leaderboard",
          path: "/leaderboard",
          icon: <FaTrophy className="text-xl" />,
        },
      ]
    : [
        { name: "Contact", path: "/about" },
        { name: "Login", path: "/auth/login", boxed: true },
      ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to={isLoggedIn ? "/dashboard" : "/"}
            className="flex items-center space-x-2"
          >
            <SiGeeksforgeeks className="text-3xl text-gfgsc-green" />
            <span className="font-bold text-xl text-gfg-black">GFGSC</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                  ${
                    location.pathname === link.path
                      ? "text-gfgsc-green bg-gfgsc-green-200"
                      : "text-gfg-black hover:text-gfgsc-green hover:bg-hover-gray"
                  }
                ${link.boxed ? "border border-gfgsc-green px-4 bg-gfgsc-green text-white" : ""}`}
              >
                {link.icon && <span>{link.icon}</span>}
                <span>{link.name}</span>
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gfg-black hover:text-gfgsc-green transition-colors duration-200"
            >
              {isOpen ? <IoClose size={24} /> : <GiHamburgerMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: isOpen ? 1 : 0,
          height: isOpen ? "auto" : 0,
        }}
        className="md:hidden bg-white"
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-all duration-200
                ${
                  location.pathname === link.path
                    ? "text-gfgsc-green bg-gfgsc-green-200"
                    : "text-gfg-black hover:text-gfgsc-green hover:bg-hover-gray"
                }`}
              onClick={() => setIsOpen(false)}
            >
              {link.icon && <span>{link.icon}</span>}
              <span>{link.name}</span>
            </Link>
          ))}
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;
