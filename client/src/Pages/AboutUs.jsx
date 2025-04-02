import ReactGA from "react-ga4";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

// Assets & Icons
import {
  AakashPic,
  AbhishekPic,
  GeekFestImg,
  HalloweenHangoutImg,
  OnboardingMeetingImg,
  RachitPic,
  SanjanaPic,
} from "../Assets";
import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaLaptopCode,
} from "react-icons/fa";
import {
  BiCalendarEvent,
  BiCodeAlt,
  BiGroup,
  BiChevronLeft,
  BiChevronRight,
} from "react-icons/bi";
import { BsArrowRight, BsStars } from "react-icons/bs";
import { HiOutlineLightBulb } from "react-icons/hi";

// Utilities
import { ImageLoaderComponent } from "../Utilities";

const AboutUs = () => {
  // Google Analytics tracking
  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: "gfgsrm-tech.vercel.app/about",
      title: "About-us Page",
    });
  }, []);

  // State for active sections and animations
  const [activeSection, setActiveSection] = useState("about");
  const [currentEvent, setCurrentEvent] = useState(0);

  // Refs for scroll animations
  const aboutRef = useRef(null);
  const missionRef = useRef(null);
  const teamRef = useRef(null);
  const developersRef = useRef(null);
  const eventsRef = useRef(null);

  // Check if sections are in view
  const aboutInView = useInView(aboutRef, { margin: "-100px 0px" });
  const missionInView = useInView(missionRef, { margin: "-100px 0px" });
  const teamInView = useInView(teamRef, { margin: "-100px 0px" });
  const developersInView = useInView(developersRef, { margin: "-100px 0px" });
  const eventsInView = useInView(eventsRef, { margin: "-100px 0px" });

  // Update active section based on scroll position
  useEffect(() => {
    if (aboutInView) setActiveSection("about");
    else if (missionInView) setActiveSection("mission");
    else if (teamInView) setActiveSection("team");
    else if (developersInView) setActiveSection("developers");
    else if (eventsInView) setActiveSection("events");
  }, [aboutInView, missionInView, teamInView, developersInView, eventsInView]);

  // Scroll to section function
  const scrollToSection = (sectionRef) => {
    sectionRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // Core team members data
  const coreTeam = [
    {
      name: "Aakash Kumar Yadav",
      role: "President",
      image: AakashPic,
      quote: "Building the next generation of tech leaders",
      links: { github: "#", linkedin: "#", instagram: "#" },
    },
    {
      name: "Sanjana Jaldu",
      role: "Vice President",
      image: SanjanaPic,
      quote: "Fostering innovation through collaboration",
      links: { github: "#", linkedin: "#", instagram: "#" },
    },
    {
      name: "Rachit Dhaka",
      role: "Operations Head",
      image: RachitPic,
      quote: "Connecting minds, sharing knowledge",
      links: { github: "#", linkedin: "#", instagram: "#" },
    },
    {
      name: "Abishek Newase",
      role: "Technical Head",
      image: AbhishekPic,
      quote: "Creating opportunities for everyone to shine",
      links: { github: "#", linkedin: "#", instagram: "#" },
    },
  ];

  // Developers data
  const developers = [
    {
      name: "Vishal Kumar Yadav",
      role: "Full Stack Developer",
      image: "https://placehold.co/600/1f1f1f/fff",
      skills: ["Node.js", "Express", "MongoDB", "Redux"],
      links: { github: "#", linkedin: "#" },
    },
    {
      name: "Jeyasurya U R",
      role: "Frontend Developer",
      image: "https://placehold.co/600/1f1f1f/fff",
      skills: ["React", "Tailwind CSS", "Framer Motion"],
      links: { github: "#", linkedin: "#" },
    },
    {
      name: "Amisha Kumari",
      role: "Frontend Developer",
      image: "https://placehold.co/600/1f1f1f/fff",
      skills: ["React", "Javascript", "Google Sheets", "Animation"],
      links: { github: "#", linkedin: "#" },
    },
  ];

  // Events gallery data
  const events = [
    {
      id: 1,
      title: "GeekFest 2024",
      image: GeekFestImg,
      date: "March 15, 2024",
      description:
        "Our annual coding festival featuring hackathons, workshops, and guest lectures from industry experts.",
    },
    {
      id: 2,
      title: "Halloween Coding Hangout",
      image: HalloweenHangoutImg,
      date: "October 31, 2023",
      description:
        "A spooky-themed coding session where members solved algorithmic challenges with Halloween-inspired problems.",
    },
    {
      id: 3,
      title: "New Member Onboarding",
      image: OnboardingMeetingImg,
      date: "September 5, 2023",
      description:
        "Welcoming new members to our chapter with orientation sessions and team-building activities.",
    },
  ];

  // Navigation for event carousel
  const nextEvent = () => {
    setCurrentEvent((prev) => (prev === events.length - 1 ? 0 : prev + 1));
  };

  const prevEvent = () => {
    setCurrentEvent((prev) => (prev === 0 ? events.length - 1 : prev - 1));
  };

  // Auto-scroll carousel every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextEvent();
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Floating Navigation */}
      <div className="fixed top-1/2 -translate-y-1/2 right-6 z-50 hidden md:block">
        <div className="flex flex-col items-center space-y-4 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg">
          {[
            { id: "about", icon: <BsStars size={18} /> },
            { id: "mission", icon: <HiOutlineLightBulb size={18} /> },
            { id: "team", icon: <BiGroup size={18} /> },
            { id: "developers", icon: <FaLaptopCode size={18} /> },
            { id: "events", icon: <BiCalendarEvent size={18} /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() =>
                scrollToSection(
                  item.id === "about"
                    ? aboutRef
                    : item.id === "mission"
                    ? missionRef
                    : item.id === "team"
                    ? teamRef
                    : item.id === "developers"
                    ? developersRef
                    : eventsRef
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

      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-gfgsc-green/10 blur-3xl"></div>
        <div className="absolute bottom-40 left-10 w-96 h-96 rounded-full bg-gfgsc-green-400/10 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-gfg-green/5 blur-2xl"></div>
      </div>

      {/* Hero Section with Parallax Effect */}
      <section
        ref={aboutRef}
        className="min-h-screen flex items-center justify-center relative overflow-hidden max-md:pt-12"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-gfgsc-green/5 blur-[100px]"></div>
          <div className="absolute bottom-1/3 left-1/4 w-96 h-96 rounded-full bg-gfgsc-green/5 blur-[120px]"></div>
        </div>

        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gfgsc-green/10 rounded-full mb-8"
            >
              {/* <img src={logo} alt="GFG Logo" className="w-6 h-6" /> */}
              <span className="text-gfgsc-green text-sm font-medium">
                GFG SRM RMP
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold text-gfg-black mb-6 leading-tight"
            >
              Where Tech Dreams
              <span className="block text-gfgsc-green">Take Flight</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-gray-600 text-xl mb-12 leading-relaxed"
            >
              Welcome to SRM IST Ramapuram's GeeksforGeeks Student Chapter — a
              community where innovation meets excellence, and every line of
              code tells a story.
            </motion.p>

            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="#mission"
                className="px-8 py-4 bg-gfgsc-green text-white rounded-lg font-medium hover:bg-gfg-green transition-colors inline-flex items-center group"
              >
                Explore Our Legacy
                <BsArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="#contact"
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Join the Chapter
              </motion.a>
            </motion.div> */}

            <motion.div className="mb-8 ">
              <div className="flex justify-center text-left items-center gap-4">
                <div>
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map((_, i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full border-2 border-white bg-gfgsc-green-200 overflow-hidden"
                      >
                        <img
                          src={`https://i.pravatar.cc/150?img=${i + 10}`}
                          alt="Team member"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-sm">
                  <p className="text-gray-600">
                    Built by students, for students
                  </p>
                  <p className="text-gray-900 font-medium">SRM IST Ramapuram</p>
                </div>
              </div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 1 }}
              className="hidden md:flex absolute bottom-12 left-1/2 -translate-x-1/2 flex-col items-center"
            >
              <span className="text-sm text-gray-500 mb-2">
                Scroll to Discover
              </span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut",
                }}
                className="w-5 h-9 border-2 border-gfgsc-green rounded-full flex items-start justify-center p-1"
              >
                <motion.div className="w-1 h-2 bg-gfgsc-green rounded-full" />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission and Vision Section */}
      <section ref={missionRef} className="py-20 relative">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-gfgsc-green-200 text-gfgsc-green font-medium text-sm mb-3">
              OUR PURPOSE
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gfg-black mb-4">
              Mission & Vision
            </h2>
            <div className="w-16 h-1 bg-gfgsc-green mx-auto"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-white rounded-2xl p-8 shadow-lg border-l-8 border-gfgsc-green transform md:rotate-2 hover:rotate-0 transition-all duration-500"
            >
              <div className="flex items-center mb-4">
                <div className="p-2 bg-gfgsc-green-200 rounded-lg mr-4">
                  <BsStars size={24} className="text-gfgsc-green" />
                </div>
                <h3 className="text-2xl font-bold text-gfg-black">
                  Our Mission
                </h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                To cultivate a thriving community of problem-solvers and create
                a collaborative environment where students can enhance their
                technical skills, share knowledge, and prepare for successful
                careers in technology.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-white rounded-2xl p-8 shadow-lg border-l-8 border-gfg-green transform md:-rotate-2 hover:rotate-0 transition-all duration-500"
            >
              <div className="flex items-center mb-4">
                <div className="p-2 bg-gfgsc-green-200 rounded-lg mr-4">
                  <HiOutlineLightBulb size={24} className="text-gfgsc-green" />
                </div>
                <h3 className="text-2xl font-bold text-gfg-black">
                  Our Vision
                </h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                To be recognized as the premier technical chapter that
                transforms students into industry-ready professionals through
                practical exposure, competitive programming, and peer learning
                opportunities.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mt-20 bg-gradient-to-r from-gfgsc-green-200 to-gfgsc-green-400 p-8 rounded-2xl shadow-lg"
          >
            <h3 className="text-2xl font-bold text-gfg-black mb-6">
              What We Do
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="w-12 h-12 flex items-center justify-center bg-gfgsc-green-200 rounded-lg mb-4 group-hover:bg-gfgsc-green group-hover:text-white transition-colors duration-300">
                  <BiCodeAlt size={24} />
                </div>
                <h4 className="text-xl font-semibold text-gfg-black mb-2">
                  Coding Competitions
                </h4>
                <p className="text-gray-600">
                  Regular contests integrated with platforms like LeetCode,
                  CodeChef, and Codeforces to improve problem-solving skills.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="w-12 h-12 flex items-center justify-center bg-gfgsc-green-200 rounded-lg mb-4 group-hover:bg-gfgsc-green group-hover:text-white transition-colors duration-300">
                  <BiGroup size={24} />
                </div>
                <h4 className="text-xl font-semibold text-gfg-black mb-2">
                  Mentorship Programs
                </h4>
                <p className="text-gray-600">
                  Connecting junior members with experienced seniors for
                  guidance in academics and career planning.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="w-12 h-12 flex items-center justify-center bg-gfgsc-green-200 rounded-lg mb-4 group-hover:bg-gfgsc-green group-hover:text-white transition-colors duration-300">
                  <BiCalendarEvent size={24} />
                </div>
                <h4 className="text-xl font-semibold text-gfg-black mb-2">
                  Technical Workshops
                </h4>
                <p className="text-gray-600">
                  Regular hands-on sessions on algorithms, data structures, and
                  latest technologies conducted by experts.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Team Section */}
      <section ref={teamRef} className="py-20 relative">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-gfgsc-green-200 text-gfgsc-green font-medium text-sm mb-3">
              LEADERSHIP
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gfg-black mb-4">
              Our Core Team
            </h2>
            <div className="w-16 h-1 bg-gfgsc-green mx-auto"></div>
            <p className="text-gray-600 max-w-2xl mx-auto mt-4">
              Meet the dedicated student leaders who work tirelessly to create
              valuable learning experiences and foster a supportive community.
            </p>
          </motion.div>

          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreTeam.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-2xl shadow-lg">
                  <div className="aspect-w-3 aspect-h-4 bg-gfgsc-green-200">
                    <ImageLoaderComponent
                      url={member.image.url}
                      hashCode={member.image.hashCode}
                      alt={member.image.alt}
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                      blurWidth="100%"
                      blurHeight="100%"
                    />
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                    <h3 className="text-lg font-semibold text-white">
                      {member.name}
                    </h3>
                    <p className="text-gfgsc-green-200">{member.role}</p>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-gfgsc-green/90 to-gfgsc-green/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
                    <div className="flex justify-end space-x-2">
                      {Object.entries(member.links).map(
                        ([platform, url], idx) => (
                          <a
                            key={idx}
                            href={url}
                            className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors text-white"
                            aria-label={`${member.name}'s ${platform}`}
                          >
                            {platform === "github" && <FaGithub size={18} />}
                            {platform === "linkedin" && (
                              <FaLinkedin size={18} />
                            )}
                            {platform === "instagram" && (
                              <FaInstagram size={18} />
                            )}
                          </a>
                        )
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {member.name}
                      </h3>
                      <p className="text-gfgsc-green-200 mb-3">{member.role}</p>
                      <p className="text-white/90 text-sm italic">
                        "{member.quote}"
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              className="flex"
              // Animation for infinite scrolling
              animate={{
                opacity: 1,
                x: [0, -300 * coreTeam.length],
                transition: {
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: coreTeam.length * 5, // Adjust speed as needed
                    ease: "linear",
                  },
                },
              }}
            >
              {/* Original set of cards */}
              {coreTeam.map((member, index) => (
                <div
                  key={`original-${index}`}
                  className="flex-shrink-0 w-72 px-2" // Fixed width for consistent sizing
                >
                  <div className="relative overflow-hidden rounded-2xl shadow-lg">
                    <div className="aspect-w-3 aspect-h-4 bg-gfgsc-green-200">
                      <ImageLoaderComponent
                        url={member.image.url}
                        hashCode={member.image.hashCode}
                        alt={member.image.alt}
                        className="w-full h-full object-cover object-center transition-transform duration-700 ease-out"
                        blurWidth="100%"
                        blurHeight="100%"
                      />
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                      <h3 className="text-lg font-semibold text-white">
                        {member.name}
                      </h3>
                      <p className="text-gfgsc-green-200">{member.role}</p>
                    </div>

                    <div
                      className="absolute inset-0 bg-gradient-to-t from-gfgsc-green/90 to-gfgsc-green/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6"
                      onClick={() => {
                        // Add touch-friendly behavior if needed
                      }}
                    >
                      <div className="flex justify-end space-x-2">
                        {Object.entries(member.links).map(
                          ([platform, url], idx) => (
                            <a
                              key={idx}
                              href={url}
                              className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors text-white"
                              aria-label={`${member.name}'s ${platform}`}
                            >
                              {platform === "github" && <FaGithub size={18} />}
                              {platform === "linkedin" && (
                                <FaLinkedin size={18} />
                              )}
                              {platform === "instagram" && (
                                <FaInstagram size={18} />
                              )}
                            </a>
                          )
                        )}
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {member.name}
                        </h3>
                        <p className="text-gfgsc-green-200 mb-3">
                          {member.role}
                        </p>
                        <p className="text-white/90 text-sm italic">
                          "{member.quote}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Duplicate set for seamless infinite loop */}
              {coreTeam.map((member, index) => (
                <div
                  key={`duplicate-${index}`}
                  className="flex-shrink-0 w-72 px-2" // Fixed width for consistent sizing
                >
                  <div className="relative overflow-hidden rounded-2xl shadow-lg">
                    <div className="aspect-w-3 aspect-h-4 bg-gfgsc-green-200">
                      <ImageLoaderComponent
                        url={member.image.url}
                        hashCode={member.image.hashCode}
                        alt={member.image.alt}
                        className="w-full h-full object-cover object-center transition-transform duration-700 ease-out"
                        blurWidth="100%"
                        blurHeight="100%"
                      />
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                      <h3 className="text-lg font-semibold text-white">
                        {member.name}
                      </h3>
                      <p className="text-gfgsc-green-200">{member.role}</p>
                    </div>

                    <div
                      className="absolute inset-0 bg-gradient-to-t from-gfgsc-green/90 to-gfgsc-green/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6"
                      onClick={() => {
                        // Add touch-friendly behavior if needed
                      }}
                    >
                      <div className="flex justify-end space-x-2">
                        {Object.entries(member.links).map(
                          ([platform, url], idx) => (
                            <a
                              key={idx}
                              href={url}
                              className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors text-white"
                              aria-label={`${member.name}'s ${platform}`}
                            >
                              {platform === "github" && <FaGithub size={18} />}
                              {platform === "linkedin" && (
                                <FaLinkedin size={18} />
                              )}
                              {platform === "instagram" && (
                                <FaInstagram size={18} />
                              )}
                            </a>
                          )
                        )}
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {member.name}
                        </h3>
                        <p className="text-gfgsc-green-200 mb-3">
                          {member.role}
                        </p>
                        <p className="text-white/90 text-sm italic">
                          "{member.quote}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Developers Section */}
      <section
        ref={developersRef}
        className="py-20 relative bg-gradient-to-b from-gfg-black to-gfg-black/90 text-white"
      >
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-gfgsc-green text-white font-medium text-sm mb-3">
              THE BUILDERS
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Development Team
            </h2>
            <div className="w-16 h-1 bg-gfgsc-green mx-auto"></div>
            <p className="text-gray-400 max-w-2xl mx-auto mt-4">
              Meet the talented developers who have built this platform from the
              ground up, creating a seamless experience for all our members.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {developers.map((dev, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{ scale: 1.03 }}
                className="relative group bg-gfg-black border border-gray-800 rounded-xl overflow-hidden shadow-xl"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={dev.image}
                    alt={dev.name}
                    className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute hidden group-hover:flex top-3 right-3 space-x-2">
                    {Object.entries(dev.links).map(([platform, url], idx) => (
                      <a
                        key={idx}
                        href={url}
                        className="p-2 bg-gfg-black/30 backdrop-blur-sm rounded-full hover:bg-gfgsc-green transition-colors text-white"
                        aria-label={`${dev.name}'s ${platform}`}
                      >
                        {platform === "github" && <FaGithub size={16} />}
                        {platform === "linkedin" && <FaLinkedin size={16} />}
                      </a>
                    ))}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{dev.name}</h3>
                  <p className="text-gfgsc-green mb-4">{dev.role}</p>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {dev.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-800 rounded-full text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section ref={eventsRef} className="py-20 relative">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-gfgsc-green-200 text-gfgsc-green font-medium text-sm mb-3">
              ACTIVITIES
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gfg-black mb-4">
              Featured Events
            </h2>
            <div className="w-16 h-1 bg-gfgsc-green mx-auto"></div>
            <p className="text-gray-600 max-w-2xl mx-auto mt-4">
              Explore our exciting events that bring together passionate
              students for learning, competition, and fun.
            </p>
          </motion.div>

          {/* Events Carousel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative mt-8 mb-8"
          >
            <div className="relative overflow-hidden rounded-3xl shadow-2xl group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentEvent}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative aspect-w-16 aspect-h-9 md:aspect-h-7"
                >
                  <div className="md:absolute inset-0 bg-gradient-to-t from-gfg-black via-transparent to-transparent z-10"></div>

                  <ImageLoaderComponent
                    url={events[currentEvent].image.url}
                    hashCode={events[currentEvent].image.hashCode}
                    alt={events[currentEvent].image.alt}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  <div className="max-md:pb-12 md:absolute inset-0 flex flex-col justify-end p-6 md:p-10 text-black md:text-white  z-20">
                    <div className="max-w-3xl">
                      <div className="inline-block px-3 py-1 bg-gfgsc-green text-white text-sm font-medium rounded-full mb-3">
                        {events[currentEvent].date}
                      </div>
                      <h3 className="text-2xl md:text-4xl font-bold mb-3">
                        {events[currentEvent].title}
                      </h3>
                      <p className="text-black/80 md:text-white/80 text-base md:text-lg mb-4 md:mb-6">
                        {events[currentEvent].description}
                      </p>
                      <a
                        href="#"
                        className="inline-flex items-center px-4 py-2 bg-gfgsc-green-400/50 md:bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-lg transition-colors"
                      >
                        View Event Details <BsArrowRight className="ml-2" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <button
                onClick={prevEvent}
                className="absolute top-1/2 left-4 z-30 -translate-y-1/2 p-2 bg-black/30 hover:bg-gfgsc-green text-white rounded-full backdrop-blur-sm transition-colors"
                aria-label="Previous event"
              >
                <BiChevronLeft size={24} />
              </button>

              <button
                onClick={nextEvent}
                className="absolute top-1/2 right-4 z-30 -translate-y-1/2 p-2 bg-black/30 hover:bg-gfgsc-green text-white rounded-full backdrop-blur-sm transition-colors"
                aria-label="Next event"
              >
                <BiChevronRight size={24} />
              </button>

              <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
                {events.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentEvent(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      currentEvent === index ? "bg-black" : "bg-gray-500/50"
                    }`}
                    aria-label={`Go to event ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="pb-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gfg-black mb-6">
              Want to be part of our journey?
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Whether you're interested in joining as a member, volunteering as
              a mentor, or collaborating as a sponsor, we'd love to hear from
              you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <a
                href="https://www.whatsapp.com/channel/0029VaqIw7WEQIahAR2NG83Q"
                target="_blank"
                className="px-8 py-3 bg-gfgsc-green text-white rounded-lg shadow-md hover:bg-gfg-green transition-colors inline-flex items-center"
              >
                Join Our Chapter <BsArrowRight className="ml-2" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
