import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

// Importing Icons ****************************************************
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
import { BiSolidDashboard, BiUser, BiUserCircle } from "react-icons/bi";
import { FiChevronDown, FiBook } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { IoLogOutOutline } from "react-icons/io5";
// *********************************************************************

import { logo } from "../../Assets";

import { removeUserToken } from "../../Actions";
import { MdAdminPanelSettings } from "react-icons/md";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
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

  const handleLogout = () => {
    // Removing user token from Redux store
    dispatch(removeUserToken());
    navigate("/");
  };

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
        {
          name: "Admin",
          path: "/admin",
          icon: <MdAdminPanelSettings className="text-lg" />,
        },
      ]
    : [
        { name: "About", path: "/about" },
        { name: "Login", path: "/auth/login", boxed: true },
      ];

  const profileMenuItems = [
    {
      name: "My Profile",
      path: "/profile",
      icon: <CgProfile />,
      variant: "default",
    },
    {
      name: "Edit Profile",
      path: "/profile/edit",
      icon: <FaUsers />,
      variant: "default",
    },
    {
      name: "Logout",
      path: "/",
      icon: <IoLogOutOutline />,
      variant: "danger",
      onClick: handleLogout,
    },
  ];

  // Check if a route is active (including nested routes)
  const isActiveRoute = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white backdrop-blur-lg bg-opacity-80 shadow-lg"
          : "bg-transparent"
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
              <img src={logo} alt="GFGSC" className="p-1 h-12" />
            </div>

            {/* <div className={`relative ${!isScrolled && "bg-white shadow-lg rounded-xl p-1"}`}>
              <div className={`p-1 ${!isScrolled && "bg-gray-200  rounded-xl" }`}>
                <img src={logo} alt="GFGSC" className="p-1 h-12" />
              </div>
            </div> */}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} className="relative group">
                <div
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                  ${
                    isActiveRoute(link.path)
                      ? "text-gfgsc-green bg-gfgsc-green-200/50"
                      : "text-gfg-black hover:text-gfgsc-green hover:bg-gfgsc-green-200/30"
                  }
                  ${
                    link.boxed
                      ? "bg-gfgsc-green text-white hover:bg-gfgsc-green/90"
                      : ""
                  }`}
                >
                  {link.icon && (
                    <span className="transition-transform duration-300 group-hover:scale-110">
                      {link.icon}
                    </span>
                  )}
                  <span>{link.name}</span>
                </div>
              </Link>
            ))}

            {/* Profile Menu */}
            {isLoggedIn && (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`relative flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                    ${
                      isProfileOpen || isActiveRoute("/profile")
                        ? "text-gfgsc-green bg-gfgsc-green-200/50"
                        : "text-gfg-black hover:text-gfgsc-green hover:bg-gfgsc-green-200/30"
                    }`}
                >
                  <BiUserCircle className="w-6 h-6 rounded-full transition-transform duration-300 hover:scale-110" />
                  <FiChevronDown
                    className={`transition-transform duration-300 ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                  />
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
                          className={`flex items-center space-x-2 px-4 py-2 text-sm transition-colors duration-200
                            ${
                              item.variant === "danger"
                                ? "text-red-600 hover:bg-red-50 hover:text-red-700"
                                : "text-gfg-black hover:text-gfgsc-green hover:bg-gfgsc-green-200/30"
                            }`}
                          onClick={(e) => {
                            setIsProfileOpen(false);
                            if (item.onClick) item.onClick(e);
                          }}
                        >
                          <span className="transition-transform duration-300 group-hover:scale-110">
                            {item.icon}
                          </span>
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
                  className="relative group block"
                >
                  <div
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200
                      ${
                        isActiveRoute(link.path)
                          ? "text-gfgsc-green bg-gfgsc-green-200/50"
                          : "text-gfg-black hover:text-gfgsc-green hover:bg-gfgsc-green-200/30"
                      }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.icon && (
                      <span className="transition-transform duration-300 group-hover:scale-110">
                        {link.icon}
                      </span>
                    )}
                    <span>{link.name}</span>
                  </div>
                  {/* Mobile active indicator line */}
                  {isActiveRoute(link.path) && (
                    <motion.div
                      layoutId="mobileActiveIndicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gfgsc-green rounded-r-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </Link>
              ))}

              {isLoggedIn && (
                <div className="pt-2 mt-2 border-t border-gfgsc-green-200">
                  {profileMenuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="relative group block"
                      onClick={(e) => {
                        if (item.onClick) item.onClick(e);
                      }}
                    >
                      <div
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200
                          ${
                            item.variant === "danger"
                              ? "text-red-600 hover:bg-red-50 hover:text-red-700"
                              : isActiveRoute(item.path)
                              ? "text-gfgsc-green bg-gfgsc-green-200/50"
                              : "text-gfg-black hover:text-gfgsc-green hover:bg-gfgsc-green-200/30"
                          }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="transition-transform duration-300 group-hover:scale-110">
                          {item.icon}
                        </span>
                        <span>{item.name}</span>
                      </div>
                      {isActiveRoute(item.path) &&
                        item.variant !== "danger" && (
                          <motion.div
                            layoutId="mobileActiveIndicator"
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gfgsc-green rounded-r-full"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                          />
                        )}
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
