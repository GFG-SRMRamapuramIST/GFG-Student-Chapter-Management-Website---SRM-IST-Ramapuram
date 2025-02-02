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
import { motion, AnimatePresence } from "framer-motion";
import { BiSolidDashboard, BiUser, BiUserCircle } from "react-icons/bi";
import { FiChevronDown, FiBook } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { IoLogOutOutline } from "react-icons/io5";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const isLoggedIn = location.pathname !== "/" && !location.pathname.startsWith("/auth");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = isLoggedIn
    ? [
        {
          name: "Dashboard",
          path: "/dashboard",
          icon: <BiSolidDashboard className="text-lg" />,
        },
        {
          name: "Leaderboard",
          path: "/leaderboard",
          icon: <FaTrophy className="text-lg" />,
        },
        {
          name: "Teams",
          path: "/teams",
          icon: <FaUsers className="text-lg" />,
        },
        {
          name: "Resources",
          path: "/resources",
          icon: <FiBook className="text-lg" />,
        },
      ]
    : [
        { name: "Contact", path: "/about" },
        { name: "Login", path: "/auth/login", boxed: true },
      ];

  const profileMenuItems = [
    { name: "My Profile", path: "/profile", icon: <CgProfile /> },
    { name: "Edit Profile", path: "/profile/edit", icon: <FaUsers /> },
    { name: "My Team", path: "/profile/team", icon: <FaUsers /> },
    { name: "Logout", path: "/auth/logout", icon: <IoLogOutOutline /> },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white backdrop-blur-lg bg-opacity-80 shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to={isLoggedIn ? "/dashboard" : "/"}
            className="flex items-center space-x-3 group"
          >
            <div className="relative">
              <SiGeeksforgeeks className="text-4xl text-gfgsc-green transition-transform duration-300 group-hover:scale-110" />
              {/* <motion.div
                className="absolute -inset-2 bg-gfgsc-green-200 rounded-full -z-10"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              /> */}
            </div>
            <span className="font-bold text-2xl text-gfg-black">GFGSC</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                  ${
                    location.pathname === link.path
                      ? "text-gfgsc-green bg-gfgsc-green-200 shadow-sm"
                      : "text-gfg-black hover:text-gfgsc-green hover:bg-gfgsc-green-200/50"
                  }
                ${link.boxed ? "bg-gfgsc-green text-white hover:bg-gfgsc-green/90 shadow-sm" : ""}`}
              >
                {link.icon && <span>{link.icon}</span>}
                <span>{link.name}</span>
              </Link>
            ))}

            {/* Profile Menu */}
            {isLoggedIn && (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                    ${isProfileOpen ? "text-gfgsc-green bg-gfgsc-green-200" : "text-gfg-black hover:text-gfgsc-green hover:bg-gfgsc-green-200/50"}`}
                >
                  {/* <img
                    src="/api/placeholder/32/32"
                    alt="Profile"
                    className="w-6 h-6 rounded-full border-2 border-gfgsc-green"
                  /> */}
                  <BiUserCircle className="w-6 h-6 rounded-full " />
                  <FiChevronDown className={`transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 border border-gfgsc-green-200"
                    >
                      {profileMenuItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gfg-black hover:text-gfgsc-green hover:bg-gfgsc-green-200/50 transition-colors duration-200"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <span>{item.icon}</span>
                          <span>{item.name}</span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gfg-black hover:text-gfgsc-green hover:bg-gfgsc-green-200/50 transition-all duration-200"
            >
              {isOpen ? <IoClose size={24} /> : <GiHamburgerMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gfgsc-green-200"
          >
            <div className="px-4 py-3 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200
                    ${
                      location.pathname === link.path
                        ? "text-gfgsc-green bg-gfgsc-green-200"
                        : "text-gfg-black hover:text-gfgsc-green hover:bg-gfgsc-green-200/50"
                    }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.icon && <span>{link.icon}</span>}
                  <span>{link.name}</span>
                </Link>
              ))}

              {isLoggedIn && (
                <div className="pt-2 mt-2 border-t border-gfgsc-green-200">
                  {profileMenuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium text-gfg-black hover:text-gfgsc-green hover:bg-gfgsc-green-200/50 transition-all duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      <span>{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;