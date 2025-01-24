import { useState } from 'react';
import { motion } from 'framer-motion';
import { SiCodechef, SiCodeforces, SiLeetcode } from 'react-icons/si';

const PlatformProgress = ({ platformData }) => {
  const [selectedPlatform, setSelectedPlatform] = useState('leetcode');

  const currentPlatform = platformData[selectedPlatform];

  return (
    <div className="py-8 rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gfg-black">
          Coding Platforms
        </h2>
        <div className="flex space-x-2">
          {Object.keys(platformData).map(platform => (
            <motion.button
              key={platform}
              onClick={() => setSelectedPlatform(platform)}
              whileHover={{ scale: 1.1 }}
              className={`p-2 rounded-full ${selectedPlatform === platform ? 'bg-gfgsc-green text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              {platform === 'leetcode' && <SiLeetcode className="text-yellow-500" />}
              {platform === 'codeforces' && <SiCodeforces className="text-blue-500" />}
              {platform === 'codechef' && <SiCodechef className="text-purple-500" />}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className='flex flex-col gap-2'>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-lg rounded-xl p-5 border border-gfgsc-green-200"
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              {selectedPlatform === 'leetcode' && <SiLeetcode className="text-yellow-500" />}
              {selectedPlatform === 'codeforces' && <SiCodeforces className="text-blue-500" />}
              {selectedPlatform === 'codechef' && <SiCodechef className="text-purple-500" />}
              <span className="ml-2">{currentPlatform.name}</span>
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Solved Questions</span>
                <span className="font-bold">{currentPlatform.totalProblems}</span>
              </div>
              <div className="flex justify-between">
                <span>Contest Rating</span>
                <span className="font-bold">{currentPlatform.rating}</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-lg rounded-xl p-5 border border-gfgsc-green-200"
          >
            <h3 className="text-xl font-semibold mb-4">Problem of the Day</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">{currentPlatform.potd.title}</span>
                <span className={`px-3 py-1 rounded-full text-xs ${currentPlatform.potd.difficulty === 'Easy' ? 'bg-green-100 text-green-800' : currentPlatform.potd.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                  {currentPlatform.potd.difficulty}
                </span>
              </div>
              <button className="w-full bg-gfgsc-green text-white py-2 rounded-lg hover:bg-gfgsc-green-400 transition">
                Solve Now
              </button>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-lg rounded-xl p-5 border border-gfgsc-green-200"
        >
          <h3 className="text-xl font-semibold mb-4">Progress Breakdown</h3>
          {currentPlatform.progressData.map((progress, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between mb-1">
                <span>{progress.name}</span>
                <span>{progress.solved}/{progress.total}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full bg-${progress.color}-500`}
                  style={{width: `${(progress.solved/progress.total)*100}%`}}
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default PlatformProgress;