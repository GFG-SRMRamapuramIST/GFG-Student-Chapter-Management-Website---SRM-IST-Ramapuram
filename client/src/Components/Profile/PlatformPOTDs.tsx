import React from "react";
import { FaExternalLinkAlt, FaCode, FaCheckCircle, FaClock } from "react-icons/fa";

const PlatformPOTDs = ({ problems }) => {
  return (
    <div className="p-6 font-sans antialiased">
      <div className="">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Problems of the Day</h2>

        <div className="grid grid-cols-3 gap-6">
          {problems.map((problem) => (
            <div
              key={problem.platform}
              className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Platform Header */}
              <div className={`p-4 ${getPlatformColor(problem.platform)}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">{problem.platform}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-white/80">{problem.date}</span>
                    {problem.solved && (
                      <FaCheckCircle className="w-4 h-4 text-green-200" />
                    )}
                  </div>
                </div>
              </div>

              {/* Problem Content */}
              <div className="p-4">
                <div className="mb-4">
                  <h3 className="font-medium text-gray-900 group-hover:text-emerald-600 transition-colors">
                    {problem.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {problem.description}
                  </p>
                </div>

                {/* Problem Metadata */}
                <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                  <div className="bg-gray-50 p-2 rounded-lg text-center">
                    <div className="text-gray-500 text-xs">Difficulty</div>
                    <div className={`font-medium ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg text-center">
                    <div className="text-gray-500 text-xs">Time Limit</div>
                    <div className="font-medium text-gray-900">
                      {problem.timeLimit}
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
                    <FaClock className="w-4 h-4" />
                    <span>Time left: {problem.timeLeft}</span>
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
          ))}
        </div>
      </div>
    </div>
  );
};

// Utility functions for dynamic colors
const getPlatformColor = (platform) => {
  const colors = {
    'LeetCode': 'bg-[#2d3142]',
    'CodeChef': 'bg-[#4a2511]',
    'GeeksForGeeks': 'bg-[#2f8d46]',
    'default': 'bg-emerald-600'
  };
  return colors[platform] || colors.default;
};

const getDifficultyColor = (difficulty) => {
  const colors = {
    'Easy': 'text-green-600',
    'Medium': 'text-yellow-600',
    'Hard': 'text-red-600',
    'default': 'text-gray-600'
  };
  return colors[difficulty] || colors.default;
};


export default PlatformPOTDs;