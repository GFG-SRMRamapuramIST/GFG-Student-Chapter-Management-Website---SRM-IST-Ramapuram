import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSpinner, FaExternalLinkAlt, FaCheck } from 'react-icons/fa';
import { ToastMsg } from '../Utilities';

const VerificationPopup = ({ 
  isOpen, 
  onClose, 
  platform, 
  username,
  onVerificationComplete,
  verifyFunction,
  generateFirstNameFunction
}) => {
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [loading, setLoading] = useState(false);
  
  const platformUrls = {
    leetcode: `https://leetcode.com/${username}`,
    codechef: `https://www.codechef.com/users/${username}`,
    codeforces: `https://codeforces.com/profile/${username}`,
    geeksforgeeks: `https://auth.geeksforgeeks.org/user/${username}`,
  };

  useEffect(() => {
    if (isOpen) {
      generateFirstName();
    }
  }, [isOpen]);

  const generateFirstName = async () => {
    try {
      setLoading(true);
      const response = await generateFirstNameFunction(platform);
      if (response.status === 200) {
        setFirstName(response.data.firstName);
      } else {
        ToastMsg("Failed to generate verification code", "error");
        onClose();
      }
    } catch (error) {
      ToastMsg("Error generating verification code", "error");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    try {
      setLoading(true);
      const response = await verifyFunction(platform);
      if (response.status === 200) {
        ToastMsg("Profile verified successfully!", "success");
        onVerificationComplete();
        onClose();
      } else {
        ToastMsg("Verification failed. Please check your profile name and try again.", "error");
      }
    } catch (error) {
      ToastMsg("Error during verification", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl"
          >
            <h2 className="text-2xl font-bold text-gfg-black mb-4">
              Verify {platform.charAt(0).toUpperCase() + platform.slice(1)} Profile
            </h2>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <FaSpinner className="animate-spin text-gfgsc-green text-2xl" />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step === 1 ? 'bg-gfgsc-green text-white' : 'bg-gray-200'}`}>
                      1
                    </span>
                    <span>Open your {platform} profile</span>
                  </div>
                  
                  <a 
                    href={platformUrls[platform]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-gfgsc-green hover:underline"
                  >
                    <span>Click here to open {platform}</span>
                    <FaExternalLinkAlt size={12} />
                  </a>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step === 2 ? 'bg-gfgsc-green text-white' : 'bg-gray-200'}`}>
                      2
                    </span>
                    <span>Set your first name to:</span>
                  </div>
                  <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                    {firstName}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step === 3 ? 'bg-gfgsc-green text-white' : 'bg-gray-200'}`}>
                      3
                    </span>
                    <span>Verify your profile</span>
                  </div>
                  <button
                    onClick={handleVerify}
                    className="w-full py-2 bg-gfgsc-green text-white rounded-lg hover:bg-gfg-green transition-colors"
                  >
                    Verify Now
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VerificationPopup;