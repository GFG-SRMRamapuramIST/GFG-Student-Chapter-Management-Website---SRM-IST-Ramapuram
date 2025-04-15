import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GfgCoin } from "../../Assets";
import { HiOutlinePlusSm, HiOutlineMinusSm } from "react-icons/hi";
import { RotatingCloseButton } from "../../Utilities";

const AddPointsPopup = ({ isOpen, onClose, user, onSubmit }) => {
  const [pointsType, setPointsType] = useState("increment");
  const [pointsAmount, setPointsAmount] = useState(1);

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const popupVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    exit: { opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } },
  };

  // Handle submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const finalPoints = pointsType === "increment" ? pointsAmount : -pointsAmount;
    onSubmit({ userId: user._id, points: finalPoints });
    onClose();
  };

  // Prevent clicks inside the popup from closing it
  const handleContainerClick = (e) => {
    e.stopPropagation();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={overlayVariants}
        >
          <motion.div
            className="bg-white rounded-xl shadow-xl overflow-hidden max-w-md w-full max-h-[90vh] flex flex-col"
            onClick={handleContainerClick}
            variants={popupVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">Manage Points</h3>
              <RotatingCloseButton onClick={onClose} />
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto">
              {/* User Info */}
              <div className="px-6 pt-5 pb-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={user?.pfp || "https://ui-avatars.com/api/?name=User"}
                      alt={user?.name}
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-gfgsc-green ring-offset-2"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full shadow p-1">
                      <div className="flex items-center bg-gfgsc-green/10 px-2 py-0.5 rounded-full">
                        <span className="font-bold text-gfgsc-green text-sm">{user?.points || 0}</span>
                        <img src={GfgCoin} alt="points" className="w-3.5 h-3.5 ml-1" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{user?.name}</h4>
                    <p className="text-gray-500 text-sm">{user?.email}</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-5">
                {/* Point Type Selection - Tabs */}
                <div className="mt-2">
                  <div className="flex rounded-lg border border-gray-200 p-1 bg-gray-50">
                    <button
                      type="button"
                      onClick={() => setPointsType("increment")}
                      className={`flex-1 py-2.5 rounded-md flex items-center justify-center gap-1.5 transition-all text-sm font-medium ${
                        pointsType === "increment"
                          ? "bg-white shadow text-gfgsc-green"
                          : "text-gray-600 hover:bg-white/60"
                      }`}
                    >
                      <HiOutlinePlusSm size={16} />
                      <span>Add Points</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPointsType("decrement")}
                      className={`flex-1 py-2.5 rounded-md flex items-center justify-center gap-1.5 transition-all text-sm font-medium ${
                        pointsType === "decrement"
                          ? "bg-white shadow text-red-500"
                          : "text-gray-600 hover:bg-white/60"
                      }`}
                    >
                      <HiOutlineMinusSm size={16} />
                      <span>Deduct Points</span>
                    </button>
                  </div>
                </div>

                {/* Points Amount */}
                <div>
                  <label htmlFor="points" className="block text-sm font-medium text-gray-700 mb-2">
                    Points Amount
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <input
                      type="number"
                      name="points"
                      id="points"
                      min="1"
                      value={pointsAmount}
                      onChange={(e) => setPointsAmount(Math.max(1, parseInt(e.target.value) || 1))}
                      className="block w-full rounded-md border-gray-300 pl-4 pr-12 py-3 focus:border-gfgsc-green focus:ring focus:ring-gfgsc-green/20 focus:ring-opacity-50 text-gray-800"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <img src={GfgCoin} alt="points" className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Result Preview */}
                <motion.div 
                  className={`rounded-lg p-4 ${
                    pointsType === "increment" 
                      ? "bg-green-50 border border-green-100" 
                      : "bg-red-50 border border-red-100"
                  }`}
                  initial={{ opacity: 0.8, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-600">
                      New Points Total:
                    </span>
                    <div className="flex items-center">
                      <span className={`font-bold text-lg ${
                        pointsType === "increment" 
                          ? "text-green-700" 
                          : "text-red-700"
                      }`}>
                        {user?.points + (pointsType === "increment" ? pointsAmount : -pointsAmount)}
                      </span>
                      <img src={GfgCoin} alt="points" className="w-5 h-5 ml-1" />
                    </div>
                  </div>
                  <div className="text-xs flex items-center gap-1">
                    {pointsType === "increment" ? (
                      <span className="text-green-600 flex items-center">
                        <HiOutlinePlusSm className="mr-0.5" />
                        {pointsAmount} points added
                      </span>
                    ) : (
                      <span className="text-red-600 flex items-center">
                        <HiOutlineMinusSm className="mr-0.5" />
                        {pointsAmount} points deducted
                      </span>
                    )}
                  </div>
                </motion.div>
              </form>
            </div>

            {/* Action Buttons - Fixed at bottom */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3 mt-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <motion.button
                type="submit"
                form="pointsForm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                className={`px-4 py-2 rounded-md text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  pointsType === "increment"
                    ? "bg-gfgsc-green hover:bg-gfgsc-green/90 focus:ring-green-500"
                    : "bg-red-500 hover:bg-red-600 focus:ring-red-500"
                }`}
              >
                {pointsType === "increment" ? "Add Points" : "Deduct Points"}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddPointsPopup;