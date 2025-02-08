import React from "react";
import {
  SiCodechef,
  SiCodeforces,
  SiCplusplus,
  SiGeeksforgeeks,
  SiHackerrank,
  SiJavascript,
  SiLeetcode,
  SiPython,
} from "react-icons/si";
import { CgCode } from "react-icons/cg";

/**
 * HeikiBackground component generates a subtle background pattern with floating CP platform icons.
 * Icons float with subtle animations for visual interest.
 *
 * NOTE: Ensure the parent element has `relative` positioning.
 * Any child elements other than HeikiBackground should also have `relative` positioning.
 *
 * @param {string} primaryColor - The primary color for the pattern (default: "#00895e").
 * @param {string} secondaryColor - The secondary color for the pattern (default: "#2f8d46").
 * @param {string} backgroundColor - The background color (default: "#ffffff").
 * @param {number} opacity - The opacity of the shapes and blocks (default: 0.1).
 * @param {string} density - The density of the icons ('sparse', 'medium', 'dense') (default: 'medium').
 * @param {string} pattern - The pattern type ('grid' or 'blocks') (default: 'blocks').
 */
const HeikiBackground = ({
  primaryColor = "#00895e",
  secondaryColor = "#2f8d46",
  backgroundColor = "#ffffff",
  opacity = 0.1,
  density = "medium",
  pattern = "blocks",
}) => {
  // Array of CP platform icons using Lucide icons
  const cpIcons = [
    { icon: SiCodeforces, name: "CodeForces" },
    { icon: SiLeetcode, name: "LeetCode" },
    { icon: SiGeeksforgeeks, name: "GeeksForGeeks" },
    { icon: SiCodechef, name: "CodeChef" },
    { icon: SiHackerrank, name: "HackerRank" },
    { icon: SiJavascript, name: "Javascript" },
    { icon: SiPython, name: "Python" },
    { icon: SiCplusplus, name: "C++" },
  ];

  // Generate floating icons based on density
  const getFloatingIcons = () => {
    const densityMap = {
      sparse: 12,
      medium: 24,
      dense: 40,
    };

    const count = densityMap[density] || densityMap.medium;
    const icons = [];

    for (let i = 0; i < count; i++) {
      const randomIcon = cpIcons[Math.floor(Math.random() * cpIcons.length)];
      const icon = {
        Icon: randomIcon.icon,
        name: randomIcon.name,
        x: `${Math.random() * 90 + 5}%`,
        y: `${Math.random() * 90 + 5}%`,
        size: Math.random() * (24 - 16) + 16,
        color: Math.random() > 0.5 ? primaryColor : secondaryColor,
        animationDelay: Math.random() * -20,
        animationDuration: Math.random() * (12 - 8) + 8, // Slightly faster animation
        floatDistance: Math.random() * (12 - 7) + 7, // Very little distance increase
        floatDirection: Math.random() > 0.5 ? "x" : "y",
      };
      icons.push(icon);
    }

    return icons;
  };

  // Generate random blocks for the buildings pattern
  const getRandomBlocks = () => {
    const blocks = [];
    const columns = 12;
    const maxHeight = 8;

    for (let col = 0; col < columns; col++) {
      const height = Math.floor(Math.random() * maxHeight) + 3;
      for (let row = 0; row < height; row++) {
        blocks.push({
          x: `${(col / columns) * 100}%`,
          y: `${100 - (row + 1) * (100 / maxHeight)}%`,
          width: `${(1 / columns) * 100}%`,
          height: `${(1 / maxHeight) * 100}%`,
          opacity: Math.random() * 0.04 + 0.02,
          color: Math.random() > 0.5 ? primaryColor : secondaryColor,
        });
      }
    }

    return blocks;
  };

  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden"
      style={{ backgroundColor }}
    >
      {/* Pattern: either grid or blocks */}
      {pattern === "grid" ? (
        // Grid pattern with floating icons
        <>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(to right, ${primaryColor} 1px, transparent 1px),
                linear-gradient(to bottom, ${primaryColor} 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
              opacity: opacity / 2,
            }}
          />
          {getFloatingIcons().map((icon, index) => (
            <div
              key={`icon-${index}`}
              className="absolute transition-transform duration-1000"
              style={{
                left: icon.x,
                top: icon.y,
                opacity,
                animation:
                  icon.floatDirection === "x"
                    ? `floatX ${icon.animationDuration}s ease-in-out infinite`
                    : `floatY ${icon.animationDuration}s ease-in-out infinite`,
                animationDelay: `${icon.animationDelay}s`,
              }}
            >
              <icon.Icon
                size={icon.size}
                color={icon.color}
                className="transform transition-transform hover:scale-110"
              />
            </div>
          ))}
          <style jsx>{`
            @keyframes floatX {
              0%,
              100% {
                transform: translateX(0px);
              }
              50% {
                transform: translateX(10px);
              }
            }
            @keyframes floatY {
              0%,
              100% {
                transform: translateY(0px);
              }
              50% {
                transform: translateY(10px);
              }
            }
          `}</style>
        </>
      ) : (
        // Blocks pattern with floating icons
        <div className="absolute inset-0">
          {getRandomBlocks().map((block, index) => (
            <div
              key={`block-${index}`}
              className="absolute transition-opacity duration-300"
              style={{
                left: block.x,
                top: block.y,
                width: block.width,
                height: block.height,
                backgroundColor: block.color,
                opacity: block.opacity,
                borderRight: "1px solid rgba(255,255,255,0.1)",
                borderTop: "1px solid rgba(255,255,255,0.1)",
              }}
            />
          ))}
          {getFloatingIcons().map((icon, index) => (
            <div
              key={`icon-${index}`}
              className="absolute transition-transform duration-1000"
              style={{
                left: icon.x,
                top: icon.y,
                opacity,
                animation:
                  icon.floatDirection === "x"
                    ? `floatX ${icon.animationDuration}s ease-in-out infinite`
                    : `floatY ${icon.animationDuration}s ease-in-out infinite`,
                animationDelay: `${icon.animationDelay}s`,
              }}
            >
              <icon.Icon
                size={icon.size}
                color={icon.color}
                className="transform transition-transform hover:scale-110"
              />
            </div>
          ))}
          <style jsx>{`
            @keyframes floatX {
              0%,
              100% {
                transform: translateX(0px);
              }
              50% {
                transform: translateX(10px);
              }
            }
            @keyframes floatY {
              0%,
              100% {
                transform: translateY(0px);
              }
              50% {
                transform: translateY(10px);
              }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default HeikiBackground;
