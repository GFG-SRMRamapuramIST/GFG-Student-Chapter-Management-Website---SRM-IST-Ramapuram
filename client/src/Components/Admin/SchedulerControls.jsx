import { useEffect, useState } from "react";

// Importing Icons
import { FaSpinner } from "react-icons/fa";

// Importing APIs
import { AdminServices } from "../../Services";

import { ToastMsg } from "../../Utilities";

const SchedulerControls = () => {
  const { fetchConstantValues, editConstantValues } = AdminServices();

  const [loading, setLoading] = useState(false);
  const [schedulerOptions, setSchedulerOptions] = useState({
    achievementScheduler: false,
    backupDataScheduler: false,
    resetDataScheduler: false,
    autoKickScheduler: false,
    passingPercentage: 10, // 10 to 70
    perContestPoint: 0, // 0 to 10
    perDayPracticePoint: 0, // 0 to 6
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
          passingPercentage,
          perContestPoint,
          perDayPracticePoint,
        } = response.data.constant;
        setSchedulerOptions({
          achievementScheduler,
          backupDataScheduler,
          resetDataScheduler,
          autoKickScheduler,
          passingPercentage,
          perContestPoint,
          perDayPracticePoint,
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

  const handleDropdownChange = (e) => {
    const { value } = e.target;
    setSchedulerOptions((prev) => ({
      ...prev,
      passingPercentage: parseInt(value, 10),
    }));
    setIsFormEdited(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log(schedulerOptions);

    try {
      setLoading(true);
      const response = await editConstantValues(schedulerOptions);
      //console.log(response);
      if (response.status === 200) {
        ToastMsg("Constant values edited successfully", "success");
      } else {
        ToastMsg("Error editing constant values", "error");
      }
    } catch (error) {
      console.error("Error editing constant values: ", error);
      ToastMsg("Error editing constant values", "error");
    } finally {
      setLoading(false);
      setIsFormEdited(false);
      getConstantValues();
    }
  };

  return (
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

            {/* Dropdown for Passing Marks */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Passing Percentage
              </label>
              <div className="relative">
                <select
                  value={schedulerOptions.passingPercentage}
                  onChange={handleDropdownChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gfgsc-green-200 focus:ring-gfgsc-green-200 py-2 pl-3 pr-10 text-base bg-white border"
                >
                  {[10, 20, 30, 40, 50, 60, 70].map((mark) => (
                    <option key={mark} value={mark}>
                      {mark}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-hover-gray">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Dropdown for Per Contest Points */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Points Per Contest
              </label>
              <div className="relative">
                <select
                  value={schedulerOptions.perContestPoint}
                  onChange={(e) => {
                    setSchedulerOptions((prev) => ({
                      ...prev,
                      perContestPoint: parseInt(e.target.value, 10),
                    }));
                    setIsFormEdited(true);
                  }}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gfgsc-green-200 focus:ring-gfgsc-green-200 py-2 pl-3 pr-10 text-base bg-white border"
                >
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((point) => (
                    <option key={point} value={point}>
                      {point}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-hover-gray">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Dropdown for Per Day Practice Points */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Points Per Day Practice
              </label>
              <div className="relative">
                <select
                  value={schedulerOptions.perDayPracticePoint}
                  onChange={(e) => {
                    setSchedulerOptions((prev) => ({
                      ...prev,
                      perDayPracticePoint: parseInt(e.target.value, 10),
                    }));
                    setIsFormEdited(true);
                  }}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gfgsc-green-200 focus:ring-gfgsc-green-200 py-2 pl-3 pr-10 text-base bg-white border"
                >
                  {[0, 1, 2, 3, 4, 5, 6].map((point) => (
                    <option key={point} value={point}>
                      {point}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-hover-gray">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
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
    </div>
  );
};

export default SchedulerControls;
