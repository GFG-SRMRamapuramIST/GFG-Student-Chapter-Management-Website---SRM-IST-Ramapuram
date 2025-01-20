import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  SiGeeksforgeeks,
  SiJavascript,
  SiPython,
  SiReact,
  SiTailwindcss,
} from "react-icons/si";
import { FaCode, FaArrowRight, FaBrain, FaUserGraduate } from "react-icons/fa";

const CodeBlock = () => {
  const [text, setText] = useState("");
  const codeString = `class GFGSC {
  this.motto = "Code, Crack, Conquer";
  return "Success!";
}`;

  useEffect(() => {
    let index = 0;
    let isDeleting = false;
    const timer = setInterval(() => {
      if (!isDeleting) {
        setText(codeString.slice(0, index).replace(/\n/g, "<br/>").replace(/ /g, "&nbsp;"));
        index++;
        if (index > codeString.length) {
          setTimeout(() => {
            isDeleting = true;
          }, 1000);
          index--;
        }
      } else {
        setText(codeString.slice(0, index).replace(/\n/g, "<br/>").replace(/ /g, "&nbsp;"));
        index-= 3;
        if (index < 0) {
          setTimeout(() => {
            isDeleting = false;
          }, 500);
          index = 0;
        }
      }
    }, 50);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gfg-black/90 rounded-xl p-4 font-mono text-sm text-gfgsc-green-200"
    >
      <div dangerouslySetInnerHTML={{ __html: text }} className="inline" />
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="inline-block w-2 h-4 bg-gfgsc-green ml-1"
      />
    </motion.div>
  );
};

const FloatingTechIcon = ({ Icon, delay, duration }) => {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{
        y: [-10, 10, -10],
        rotate: [-5, 5, -5],
      }}
      transition={{
        repeat: Infinity,
        duration,
        delay,
        ease: "easeInOut",
      }}
      className="absolute text-2xl text-gfgsc-green/40"
    >
      <Icon />
    </motion.div>
  );
};

const HeroSection = () => {
  const navigate = useNavigate();
  const controls = useAnimation();
  const [hovered, setHovered] = useState(false);

  const floatingIcons = [
    { Icon: SiJavascript, top: "20%", left: "10%", delay: 0, duration: 4 },
    { Icon: SiPython, bottom: "30%", left: "5%", delay: 0.5, duration: 5 },
    { Icon: SiReact, top: "30%", right: "15%", delay: 1, duration: 3.5 },
    {
      Icon: SiTailwindcss,
      bottom: "20%",
      right: "10%",
      delay: 1.5,
      duration: 4.5,
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-white to-gfgsc-green-200/30 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      {/* Floating Tech Icons */}
      {floatingIcons.map((icon, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            top: icon.top,
            left: icon.left,
            right: icon.right,
            bottom : icon.bottom,
          }}
        >
          <FloatingTechIcon {...icon} />
        </div>
      ))}

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            className="inline-flex items-center space-x-2 bg-gfg-black text-white px-6 py-2 rounded-full mb-8"
            whileHover={{ scale: 1.05 }}
          >
            <SiGeeksforgeeks className="text-gfgsc-green" />
            <span>Student Chapter</span>
          </motion.div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <h1 className="text-6xl font-bold leading-tight">
              <span className="block text-gfg-black">Innovate.</span>
              <span className="block text-gfgsc-green">Create.</span>
              <span className="block text-gfg-black">Together.</span>
            </h1>

            <div className="flex flex-wrap gap-4 text-lg text-gray-600">
              {[
                { icon: FaCode, text: "Code Excellence" },
                { icon: FaBrain, text: "Tech Innovation" },
                { icon: FaUserGraduate, text: "Continuous Learning" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 * index }}
                  className="flex items-center space-x-2"
                >
                  <item.icon className="text-gfgsc-green" />
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="relative inline-block"
              onHoverStart={() => setHovered(true)}
              onHoverEnd={() => setHovered(false)}
            >
              <button
                onClick={() => navigate("/auth/register")}
                className="group relative px-8 py-4 bg-gfgsc-green text-white rounded-xl font-medium text-lg overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gfg-green"
                  initial={{ x: "-100%" }}
                  animate={{ x: hovered ? 0 : "-100%" }}
                  transition={{ duration: 0.3 }}
                />
                <motion.div className="relative flex items-center space-x-2">
                  <span>Start Your Journey</span>
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </motion.div>
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="relative z-10 bg-gradient-to-br from-gfgsc-green to-gfg-green p-1 rounded-2xl">
              <div className="bg-white rounded-xl p-6">
                <CodeBlock />

                {/* Stats Cards */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="grid grid-cols-3 gap-4 mt-6"
                >
                  {[
                    { label: "Active Members", value: "1000+" },
                    { label: "Projects", value: "100+" },
                    { label: "Events", value: "50+" },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-3 rounded-lg text-center"
                    >
                      <div className="text-gfgsc-green font-bold">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* Decorative Elements */}
            <motion.div
              className="absolute -right-4 -bottom-4 w-full h-full bg-gfgsc-green/10 rounded-2xl -z-10"
              animate={{ right: ["-3%", "-2%", "-4%"], bottom: ["-3%", "-2%", "-4%"] }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -right-8 -bottom-8 w-full h-full bg-gfgsc-green/5 rounded-2xl -z-20"
              animate={{ right: ["-6%", "-4%", "-8%"], bottom: ["-6%", "-4%", "-8%"] }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
