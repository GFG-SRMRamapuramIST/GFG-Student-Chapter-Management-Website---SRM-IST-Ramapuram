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
    { text: "Solve now!", icon: <FaFire className="w-3 h-3 text-red-500" /> },
    {
      text: "Ready to challenge?",
      icon: <FaRocket className="w-3 h-3 text-blue-500" />,
    },
    {
      text: "Test your skills!",
      icon: <FaLightbulb className="w-3 h-3 text-yellow-400" />,
    },
    {
      text: "Think you can solve it?",
      icon: <FaBolt className="w-3 h-3 text-amber-500" />,
    },
    {
      text: "Crack this problem!",
      icon: <FaFire className="w-3 h-3 text-red-500" />,
    },
    {
      text: "Challenge of the Day!",
      icon: <FaTrophy className="w-3 h-3 text-yellow-500" />,
    },
    {
      text: "Push your limits!",
      icon: <FaRocket className="w-3 h-3 text-blue-500" />,
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 font-sans antialiased">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Problems of the Day
        </h2>

        {loading ? (
          <div className="p-4 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <FaSpinner className="animate-spin text-3xl text-gfgsc-green" />
              <p className="text-sm text-gray-600">Loading ...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {problems.map((problem) => {
              const randomText =
                staticTextsWithIcons[
                  Math.floor(Math.random() * staticTextsWithIcons.length)
                ];
              return (
                <div
                  key={problem.platform}
                  className="group bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Platform Header - Reduced padding */}
                  <div className={`p-2 ${getPlatformColor(problem.platform)}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-white">
                        {problem.platform}
                      </span>
                      <span className="text-xs text-white/80">
                        {new Date().toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Problem Content - Reduced padding */}
                  <div className="p-3">
                    <h3 className="font-medium text-sm text-gray-900 group-hover:text-emerald-600 transition-colors mb-2 line-clamp-1">
                      {problem.title}
                    </h3>

                    {/* Problem Metadata - Simplified layout */}
                    <div className="flex justify-between mb-2 text-xs">
                      <div className="bg-gray-50 px-2 py-1 rounded text-center flex items-center">
                        <span
                          className={`font-medium ${getDifficultyColor(
                            problem.difficulty
                          )}`}
                        >
                          {problem.difficulty}
                        </span>
                      </div>
                      <div className="bg-gray-50 px-2 py-1 rounded text-center flex items-center">
                        <span className="text-gray-500 mr-1">Acc:</span>
                        <span className="font-medium text-gray-900">
                          {parseFloat(problem.accuracy).toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    {/* Problem Tags - Horizontal scrolling */}
                    <div className="flex gap-1 mb-2 overflow-x-auto pb-1 scrollbar-hide">
                      {problem.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-1.5 py-0.5 whitespace-nowrap rounded-full bg-gray-100 text-gray-600 text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {problem.tags.length > 3 && (
                        <span className="px-1.5 py-0.5 whitespace-nowrap rounded-full bg-gray-100 text-gray-500 text-xs">
                          +{problem.tags.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Action Footer - Simplified */}
                    <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        {randomText.icon}
                        <span className="truncate max-w-[100px]">{randomText.text}</span>
                      </div>
                      <a
                        href={problem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                      >
                        <span>Solve</span>
                        <FaExternalLinkAlt className="w-2 h-2" />
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