import { useEffect, useState } from "react";

// Importing Icons
import {
  FaExternalLinkAlt,
  FaFire,
  FaTrophy,
  FaBolt,
  FaLightbulb,
  FaRocket,
  FaSpinner,
} from "react-icons/fa";

const PlatformPOTDs = ({ problems }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(!problems || problems.length === 0);
  }, [problems]);

  const staticTextsWithIcons = [
    { text: "Solve now!", icon: <FaFire className="w-4 h-4 text-red-500" /> },
    {
      text: "Ready to challenge?",
      icon: <FaRocket className="w-4 h-4 text-blue-500" />,
    },
    {
      text: "Test your skills!",
      icon: <FaLightbulb className="w-4 h-4 text-yellow-400" />,
    },
    {
      text: "Think you can solve it?",
      icon: <FaBolt className="w-4 h-4 text-amber-500" />,
    },
    {
      text: "Crack this problem!",
      icon: <FaFire className="w-4 h-4 text-red-500" />,
    },
    {
      text: "Challenge of the Day!",
      icon: <FaTrophy className="w-4 h-4 text-yellow-500" />,
    },
    {
      text: "Push your limits!",
      icon: <FaRocket className="w-4 h-4 text-blue-500" />,
    },
  ];

  return (
    <div className="p-6 font-sans antialiased">
      <div className="">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Problems of the Day
        </h2>

        {loading ? (
          <div className="p-6 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <FaSpinner className="animate-spin text-4xl text-gfgsc-green" />
              <p className="text-gray-600">Loading ...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {problems.map((problem) => {
              const randomText =
                staticTextsWithIcons[
                  Math.floor(Math.random() * staticTextsWithIcons.length)
                ];
              return (
                <div
                  key={problem.platform}
                  className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Platform Header */}
                  <div className={`p-4 ${getPlatformColor(problem.platform)}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white">
                        {problem.platform}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-white/80">
                          {new Date().toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Problem Content */}
                  <div className="p-4">
                    <div className="mb-4">
                      <h3 className="font-medium text-gray-900 group-hover:text-emerald-600 transition-colors">
                        {problem.title}
                      </h3>
                    </div>

                    {/* Problem Metadata */}
                    <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                      <div className="bg-gray-50 p-2 rounded-lg text-center">
                        <div className="text-gray-500 text-xs">Difficulty</div>
                        <div
                          className={`font-medium ${getDifficultyColor(
                            problem.difficulty
                          )}`}
                        >
                          {problem.difficulty}
                        </div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-lg text-center">
                        <div className="text-gray-500 text-xs">Accuracy</div>
                        <div className="font-medium text-gray-900">
                          {parseFloat(problem.accuracy).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* Problem Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {problem.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Action Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        {randomText.icon}
                        <span>{randomText.text}</span>
                      </div>
                      <a
                        href={problem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                      >
                        <span>Solve</span>
                        <FaExternalLinkAlt className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// Utility functions for dynamic colors
const getPlatformColor = (platform) => {
  const colors = {
    LeetCode: "bg-[#2d3142]",
    CodeChef: "bg-[#4a2511]",
    GeeksForGeeks: "bg-[#2f8d46]",
    default: "bg-emerald-600",
  };
  return colors[platform] || colors.default;
};

const getDifficultyColor = (difficulty) => {
  const colors = {
    Easy: "text-green-600",
    Medium: "text-yellow-600",
    Hard: "text-red-600",
    default: "text-gray-600",
  };
  return colors[difficulty] || colors.default;
};

export default PlatformPOTDs;
