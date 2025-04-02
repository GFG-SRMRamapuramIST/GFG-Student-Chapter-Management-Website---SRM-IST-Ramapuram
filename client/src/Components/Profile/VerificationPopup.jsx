import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { FaSpinner } from "react-icons/fa";
import { RiExternalLinkLine } from "react-icons/ri";

import { ToastMsg } from "../../Utilities";
import { getPlatformUrl } from "../../Constants";

// Importing APIs
import { UserServices } from "../../Services";

const platformSpecificSteps = {
  leetcode: [
    "Navigate to your profile page",
    "Click on 'Edit Profile' below your profile picture",
    "Click the edit button near the 'Name' field",
    "Update your name with the verification code shown below",
    "Wait for 5-10 seconds",
    "Come back here and click 'Verify Profile'",
    "Once verified, you can change your name back"
  ],
  codechef: [
    "Go to your profile page",
    "Click on the edit icon next to your profile picture",
    "Click on 'General'",
    "Enter the verification code in 'Your Name' field",
    "Click Save",
    "Wait for 5-10 seconds",
    "Come back here and click 'Verify Profile'",
    "Once verified, you can change your name back"
  ],
  codeforces: [
    "Open your Codeforces profile",
    "Edit your first name to the verification code shown below",
    "Wait for your profile to update (15-30 seconds)",
    "Come back here and click verify"
  ],
  geeksforgeeks: [
    "Go to your profile page",
    "Click on 'Edit Profile' button",
    "Navigate through 'Basic Details' (fill if needed) and click Next",
    "Navigate through 'Experience Details' (fill if needed) and click Next",
    "In 'Personal Details', find 'Display Name' field",
    "Enter the verification code shown below",
    "Click outside the box and wait for auto-save (5-10 seconds)",
    "Come back here and click 'Verify Profile'",
    "Once verified, you can change your name back",
    "If verification fails, please wait a few minutes and try again"
  ]
};

const VerificationPopup = ({
  isOpen,
  onClose,
  platform,
  username,
  onVerificationComplete,
}) => {
  const {
    generateVerificationCodeForAPlatformFunction,
    verifyPlatformFunction,
  } = UserServices();

  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState(null);

  const getSteps = () => {
    return platformSpecificSteps[platform.toLowerCase()] || [
      "Open your profile",
      "Edit your first name to the verification code shown below",
      "Save your profile changes",
      "Come back here and click verify"
    ];
  };

  useEffect(() => {
    const generateVerificationCodeHandler = async () => {
      //console.log(platform);
      try {
        setLoading(true);
        const response = await generateVerificationCodeForAPlatformFunction({
          platform: platform.toLowerCase(),
        });
        //console.log(response);
        if (response.status == 200) {
          setFirstName(response.data.verificationCode);
        } else {
          ToastMsg(response.data.data.message, "error");
        }
      } catch (error) {
        ToastMsg(
          "Failed to generate verification code! Please try later.",
          "error"
        );
        console.error("Failed to generate verification code:", error);
      } finally {
        setLoading(false);
      }
    };

    // Start verification process as soon as popup opens
    if (isOpen && !firstName) {
      generateVerificationCodeHandler();
    }
  }, [isOpen]);

  // Function to reset the popup on close
  const anotherOnCloseFunction = () => {
    setFirstName(null);
  };

  // Mock API call to verify profile
  const verifyProfile = async () => {
    setLoading(true);
    try {
      const response = await verifyPlatformFunction({
        platform: platform.toLowerCase(),
      });
      //console.log(response);
      if (response.status == 200) {
        ToastMsg(response.data.message, "success");
        onVerificationComplete();
      } else {
        ToastMsg(response.response.data.message, "error");
      }
    } catch (error) {
      ToastMsg("Failed to verify! Please try later.", "error");
      console.error("Failed to verify:", error);
    } finally {
      setLoading(false);
      anotherOnCloseFunction();
      onClose();
    }
  };

  // Get platform-specific profile URL
  const getProfileUrl = () => {
    const baseUrl = getPlatformUrl(platform.toLowerCase());
    return baseUrl ? `https://${baseUrl}/${username}` : "#";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="max-h-[90vh] overflow-y-scroll no-scrollbar bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">Verify {platform} Profile</h2>

        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-4">
              <FaSpinner className="animate-spin text-2xl text-gfgsc-green" />
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Follow these steps:</p>
                <ol className="list-decimal list-outside space-y-2 ml-4">
                  <li className="mb-2">
                    Open your {platform} profile
                    <a
                      href={getProfileUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center ml-1 text-blue-500 hover:text-blue-600"
                    >
                      <RiExternalLinkLine className="w-4 h-4" />
                    </a>
                  </li>
                  {getSteps().map((step, index) => (
                    <li key={index} className="mb-2">
                      {step}
                      {step.includes("verification code") && (
                        <span className="block mt-1 font-mono bg-gray-100 px-2 py-1 rounded">
                          {firstName}
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
              </div>

              <button
                onClick={verifyProfile}
                className="w-full py-2 bg-gfgsc-green text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Verify Profile
              </button>

              <button
                onClick={() => {
                  onClose();
                  anotherOnCloseFunction();
                }}
                className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

VerificationPopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  platform: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  onVerificationComplete: PropTypes.func.isRequired,
};

export default VerificationPopup;
