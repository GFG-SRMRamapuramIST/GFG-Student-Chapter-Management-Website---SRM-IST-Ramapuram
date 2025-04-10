import { useEffect, useState } from "react";

// Importing Icons
import { FaSpinner } from "react-icons/fa";

// Importing APIs
import { AdminServices } from "../../Services";

import { ConfirmationPopup, ToastMsg } from "../../Utilities";

const SchedulerControls = () => {
  const { fetchConstantValues, editConstantValues } = AdminServices();

  const [loading, setLoading] = useState(false);
  const [schedulerOptions, setSchedulerOptions] = useState({
    achievementScheduler: false,
    backupDataScheduler: false,
    resetDataScheduler: false,
    autoKickScheduler: false,
    passingMarks: 30,
  });

  const [confirmationState, setConfirmationState] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const getConstantValues = async () => {
    try {
      setLoading(true);
      const response = await fetchConstantValues();
      //console.log(response);
      if (response.status === 200) {
        const {
          achievementScheduler,
          backupDataScheduler,
          resetDataScheduler,
          autoKickScheduler,
          passingMarks,
        } = response.data.constant;
        setSchedulerOptions({
          achievementScheduler,
          backupDataScheduler,
          resetDataScheduler,
          autoKickScheduler,
          passingMarks,
        });
      } else {
        ToastMsg("Error fetching constant values", "error");
      }
    } catch (error) {
      console.error("Error fetching constant values: ", error);
      ToastMsg("Error fetching constant values", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getConstantValues();
  }, []);

  const [isFormEdited, setIsFormEdited] = useState(false);

  const handleToggleChange = (e) => {
    const { name, checked } = e.target;
    setSchedulerOptions((prev) => ({
      ...prev,
      [name]: checked,
    }));
    setIsFormEdited(true);
  };

  const handlePassingMarksChange = (e) => {
    const value = parseInt(e.target.value, 10) || 0;
    setSchedulerOptions((prev) => ({
      ...prev,
      passingMarks: value,
    }));
    setIsFormEdited(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Format scheduler changes
    const schedulerChanges = [
      schedulerOptions.achievementScheduler &&
        "• Achievement Scheduler: Enabled",
      schedulerOptions.backupDataScheduler && "• Backup Scheduler: Enabled",
      schedulerOptions.resetDataScheduler && "• Reset Data Scheduler: Enabled",
      schedulerOptions.autoKickScheduler && "• Auto-kick Scheduler: Enabled",
    ].filter(Boolean); // Remove false values

    const message = [
      "📋 Scheduler Changes:",
      ...(schedulerChanges.length
        ? schedulerChanges
        : ["No scheduler changes"]),
      "",
      "🎯 Passing Criteria:",
      `• Minimum Passing Marks: ${schedulerOptions.passingMarks}`,
    ].join("\n");

    setConfirmationState({
      isOpen: true,
      type: "info",
      title: "Confirm Changes",
      message,
      onConfirm: async () => {
        try {
          setLoading(true);
          const response = await editConstantValues(schedulerOptions);
          if (response.status === 200) {
            ToastMsg("Settings updated successfully", "success");
          } else {
            ToastMsg("Failed to update settings", "error");
          }
        } catch (error) {
          console.error("Error updating settings:", error);
          ToastMsg("Error updating settings", "error");
        } finally {
          setLoading(false);
          setIsFormEdited(false);
          getConstantValues();
        }
      },
    });
  };

  return (
    <>
      <div className="w-full max-w-md  bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-gfg-green to-gfgsc-green py-4 px-6">
          <h2 className="text-xl font-bold text-white">Scheduler Controls</h2>
        </div>
        {loading ? (
          <>
            <div className="flex justify-center items-center h-64">
              <FaSpinner className="animate-spin text-3xl sm:text-4xl text-gfgsc-green" />
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Scheduler Toggle Options */}
              <div className="space-y-4">
                {/* Achievement scheduler */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Run Achievement Scheduler
                  </label>
                  <div
                    onClick={() => {
                      const newValue = !schedulerOptions.achievementScheduler;
                      setSchedulerOptions((prev) => ({
                        ...prev,
                        achievementScheduler: newValue,
                      }));
                      setIsFormEdited(true);
                    }}
                    className="relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer"
                  >
                    <span
                      className={`${
                        schedulerOptions.achievementScheduler
                          ? "bg-gfgsc-green"
                          : "bg-gray-200"
                      } absolute inset-0 rounded-full transition-colors duration-200 ease-in-out`}
                    ></span>
                    <span
                      className={`${
                        schedulerOptions.achievementScheduler
                          ? "translate-x-6"
                          : "translate-x-1"
                      } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out`}
                    ></span>
                    <input
                      type="checkbox"
                      className="sr-only"
                      name="achievementScheduler"
                      checked={schedulerOptions.achievementScheduler}
                      onChange={handleToggleChange}
                    />
                  </div>
                </div>

                {/* Backup scheduler */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Run Backup Scheduler
                  </label>
                  <div
                    onClick={() => {
                      const newValue = !schedulerOptions.backupDataScheduler;
                      setSchedulerOptions((prev) => ({
                        ...prev,
                        backupDataScheduler: newValue,
                      }));
                      setIsFormEdited(true);
                    }}
                    className="relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer"
                  >
                    <span
                      className={`${
                        schedulerOptions.backupDataScheduler
                          ? "bg-gfgsc-green"
                          : "bg-gray-200"
                      } absolute inset-0 rounded-full transition-colors duration-200 ease-in-out`}
                    ></span>
                    <span
                      className={`${
                        schedulerOptions.backupDataScheduler
                          ? "translate-x-6"
                          : "translate-x-1"
                      } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out`}
                    ></span>
                    <input
                      type="checkbox"
                      className="sr-only"
                      name="backupDataScheduler"
                      checked={schedulerOptions.backupDataScheduler}
                      onChange={handleToggleChange}
                    />
                  </div>
                </div>

                {/* Reset data scheduler */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Run Reset Data Scheduler
                  </label>
                  <div
                    onClick={() => {
                      const newValue = !schedulerOptions.resetDataScheduler;
                      setSchedulerOptions((prev) => ({
                        ...prev,
                        resetDataScheduler: newValue,
                      }));
                      setIsFormEdited(true);
                    }}
                    className="relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer"
                  >
                    <span
                      className={`${
                        schedulerOptions.resetDataScheduler
                          ? "bg-gfgsc-green"
                          : "bg-gray-200"
                      } absolute inset-0 rounded-full transition-colors duration-200 ease-in-out`}
                    ></span>
                    <span
                      className={`${
                        schedulerOptions.resetDataScheduler
                          ? "translate-x-6"
                          : "translate-x-1"
                      } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out`}
                    ></span>
                    <input
                      type="checkbox"
                      className="sr-only"
                      name="resetDataScheduler"
                      checked={schedulerOptions.resetDataScheduler}
                      onChange={handleToggleChange}
                    />
                  </div>
                </div>

                {/* Auto kick scheduler */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Auto-kick Scheduler
                  </label>
                  <div
                    onClick={() => {
                      const newValue = !schedulerOptions.autoKickScheduler;
                      setSchedulerOptions((prev) => ({
                        ...prev,
                        autoKickScheduler: newValue,
                      }));
                      setIsFormEdited(true);
                    }}
                    className="relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer"
                  >
                    <span
                      className={`${
                        schedulerOptions.autoKickScheduler
                          ? "bg-gfgsc-green"
                          : "bg-gray-200"
                      } absolute inset-0 rounded-full transition-colors duration-200 ease-in-out`}
                    ></span>
                    <span
                      className={`${
                        schedulerOptions.autoKickScheduler
                          ? "translate-x-6"
                          : "translate-x-1"
                      } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out`}
                    ></span>
                    <input
                      type="checkbox"
                      className="sr-only"
                      name="autoKickScheduler"
                      checked={schedulerOptions.autoKickScheduler}
                      onChange={handleToggleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Simple Integer Input for Passing Marks */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Passing Marks
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={schedulerOptions.passingMarks}
                  onChange={handlePassingMarksChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gfgsc-green-200 focus:ring-gfgsc-green-200 py-2 px-3 text-base bg-white border"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={!isFormEdited}
                  className={`w-full rounded-md py-2 px-4 text-white font-medium transition-all duration-200 ${
                    isFormEdited
                      ? "bg-gfgsc-green hover:bg-gfg-green shadow-md hover:shadow-lg"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        )}

        <ConfirmationPopup
          isOpen={confirmationState.isOpen}
          onClose={() =>
            setConfirmationState((prev) => ({ ...prev, isOpen: false }))
          }
          onConfirm={confirmationState.onConfirm}
          type={confirmationState.type}
          title={confirmationState.title}
          message={confirmationState.message}
          confirmText="Apply Changes"
          cancelText="Cancel"
        />
      </div>
    </>
  );
};

export default SchedulerControls;