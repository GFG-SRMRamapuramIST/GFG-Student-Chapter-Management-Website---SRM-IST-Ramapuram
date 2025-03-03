import { useState } from "react";

const SchedulerControls = () => {
  const [schedulerOptions, setSchedulerOptions] = useState({
    achievementScheduler: false,
    backupScheduler: false,
    resetAllScheduler: false,
    passingMarks: 10,
  });

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
      passingMarks: parseInt(value, 10),
    }));
    setIsFormEdited(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(schedulerOptions);
    // Reset form edited state after submission
    setIsFormEdited(false);
  };

  return (
    <div className="w-full max-w-md  bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-gfg-green to-gfgsc-green py-4 px-6">
        <h2 className="text-xl font-bold text-white">Scheduler Controls</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-6">
          {/* Scheduler Toggle Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Run Achievement Scheduler</label>
              <div onClick={() => {
                const newValue = !schedulerOptions.achievementScheduler;
                setSchedulerOptions(prev => ({...prev, achievementScheduler: newValue}));
                setIsFormEdited(true);
              }} className="relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer">
                <span className={`${schedulerOptions.achievementScheduler ? "bg-gfgsc-green" : "bg-gray-200"} absolute inset-0 rounded-full transition-colors duration-200 ease-in-out`}></span>
                <span className={`${schedulerOptions.achievementScheduler ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out`}></span>
                <input
                  type="checkbox"
                  className="sr-only"
                  name="achievementScheduler"
                  checked={schedulerOptions.achievementScheduler}
                  onChange={handleToggleChange}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Run Backup Scheduler</label>
              <div onClick={() => {
                const newValue = !schedulerOptions.backupScheduler;
                setSchedulerOptions(prev => ({...prev, backupScheduler: newValue}));
                setIsFormEdited(true);
              }} className="relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer">
                <span className={`${schedulerOptions.backupScheduler ? "bg-gfgsc-green" : "bg-gray-200"} absolute inset-0 rounded-full transition-colors duration-200 ease-in-out`}></span>
                <span className={`${schedulerOptions.backupScheduler ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out`}></span>
                <input
                  type="checkbox"
                  className="sr-only"
                  name="backupScheduler"
                  checked={schedulerOptions.backupScheduler}
                  onChange={handleToggleChange}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Run Reset All Scheduler</label>
              <div onClick={() => {
                const newValue = !schedulerOptions.resetAllScheduler;
                setSchedulerOptions(prev => ({...prev, resetAllScheduler: newValue}));
                setIsFormEdited(true);
              }} className="relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer">
                <span className={`${schedulerOptions.resetAllScheduler ? "bg-gfgsc-green" : "bg-gray-200"} absolute inset-0 rounded-full transition-colors duration-200 ease-in-out`}></span>
                <span className={`${schedulerOptions.resetAllScheduler ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out`}></span>
                <input
                  type="checkbox"
                  className="sr-only"
                  name="resetAllScheduler"
                  checked={schedulerOptions.resetAllScheduler}
                  onChange={handleToggleChange}
                />
              </div>
            </div>
          </div>

          {/* Dropdown for Passing Marks */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Passing Marks
            </label>
            <div className="relative">
              <select
                value={schedulerOptions.passingMarks}
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
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
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
    </div>
  );
};

export default SchedulerControls;