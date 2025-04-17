import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { SchedulerControls } from "../../Components";
import { ConfirmationPopup, ToastMsg } from "../../Utilities";
import { AdminServices } from "../../Services";

const SchedulerSettings = () => {
  const { resetAchievement } = AdminServices();
  const [resetAchievementLoading, setResetAchievementLoading] = useState(false);
  
  // Confirmation popup state
  const [confirmationState, setConfirmationState] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
    onConfirm: () => {},
  });
  
  // Reset achievements handler
  const resetAchievementFunction = async () => {
    try {
      setResetAchievementLoading(true);
      const response = await resetAchievement();
      if (response.status === 200) {
        ToastMsg(response.data.message, "success");
      } else {
        ToastMsg("Failed to reset achievements", "error");
      }
    } catch (error) {
      console.error("Error resetting achievements:", error);
      ToastMsg("Error resetting achievements", "error");
    } finally {
      setResetAchievementLoading(false);
    }
  };

  return (
    <>
      <ConfirmationPopup
        isOpen={confirmationState.isOpen}
        onClose={() => setConfirmationState({ ...confirmationState, isOpen: false })}
        onConfirm={confirmationState.onConfirm}
        type={confirmationState.type}
        title={confirmationState.title}
        message={confirmationState.message}
      />
      
      <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
        <SchedulerControls />
        
        {/* Additional Scheduler Controls */}
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-gfg-green to-gfgsc-green py-4 px-6">
            <h2 className="text-xl font-bold text-white">Additional Controls</h2>
          </div>

          <div className="p-6 space-y-6">
            {/* Reset Achievements Button */}
            <button
              onClick={() => {
                setConfirmationState({
                  isOpen: true,
                  type: "danger",
                  title: "Reset All Achievements",
                  message:
                    "Are you sure you want to reset achievements for all users? This action cannot be undone.",
                  onConfirm: resetAchievementFunction,
                });
              }}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
            >
              {resetAchievementLoading ? (
                <FaSpinner className="animate-spin inline-block mr-2" />
              ) : null}
              Reset All Achievements
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SchedulerSettings;