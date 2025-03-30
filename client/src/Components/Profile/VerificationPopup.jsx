import { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { RiExternalLinkLine } from "react-icons/ri";
import PropTypes from "prop-types";
import { ToastMsg } from "../../Utilities";
import { getPlatformUrl } from "../../Constants";

const VerificationPopup = ({
  isOpen,
  onClose,
  platform,
  username,
  onVerificationComplete,
}) => {
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    // Start verification process as soon as popup opens
    if (isOpen && !firstName) {
      generateFirstName();
    }
  }, [isOpen]);

  // Mock API call to generate firstName
  const generateFirstName = async () => {
    setLoading(true);
    try {
      // Simulate API call
      console.log(`Generating firstName for ${platform} user ${username}`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockFirstName = `verify_${Math.random().toString(36).substring(7)}`;
      setFirstName(mockFirstName);
    } catch (error) {
      ToastMsg("Failed to generate verification code", "error");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  // Mock API call to verify profile
  const verifyProfile = async () => {
    setLoading(true);
    try {
      // Simulate API call
      console.log(
        `Verifying ${platform} user ${username} with firstName ${firstName}`
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const success = Math.random() > 0.5; // Randomly succeed or fail

      if (success) {
        ToastMsg("Profile verified successfully!", "success");
        onVerificationComplete();
        onClose();
      } else {
        ToastMsg(
          "Verification failed. Please make sure you updated your profile correctly.",
          "error"
        );
      }
    } catch (e) {
      ToastMsg("Verification failed. Please try again.", "error");
      console.error("Verification error:", e);
    } finally {
      setLoading(false);
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
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
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
                <ol className="list-decimal list-inside space-y-2">
                  <li>
                  Open your {platform}  profile
                    <a
                      href={getProfileUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                        <RiExternalLinkLine className="inline-block ml-1 mb-0.5" />
                    </a>
                  </li>
                  <li>
                    Edit your first name to:{" "}
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                      {firstName}
                    </span>
                  </li>
                  <li>Save your profile changes</li>
                  <li>Come back here and click verify</li>
                </ol>
              </div>


              <button
                onClick={verifyProfile}
                className="w-full py-2 bg-gfgsc-green text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Verify Profile
              </button>

              <button
                onClick={onClose}
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
