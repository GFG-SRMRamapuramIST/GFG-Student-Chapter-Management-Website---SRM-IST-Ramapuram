import { useState } from 'react';
import { RiLockPasswordLine } from 'react-icons/ri';
import { motion, AnimatePresence } from 'framer-motion';
import { RotatingCloseButton } from '../../Utilities';

const PasswordChangeModal = ({ isOpen, onClose, onSubmit }) => {
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!passwords.current) newErrors.current = 'Current password is required';
    if (!passwords.new) newErrors.new = 'New password is required';
    if (!passwords.confirm) newErrors.confirm = 'Please confirm your new password';
    if (passwords.new !== passwords.confirm) {
      newErrors.confirm = 'Passwords do not match';
    }
    if (passwords.new && passwords.new.length < 6) {
      newErrors.new = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(passwords);
      onClose();
      setPasswords({ current: '', new: '', confirm: '' });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-xl max-w-md w-full"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center text-xl font-semibold text-red-500">
                  <RiLockPasswordLine className="mr-2" />
                  <h3>Change Password</h3>
                </div>
                <RotatingCloseButton onClick={onClose} />
              </div>

              {/* Body */}
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwords.current}
                    onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      errors.current ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.current && (
                    <p className="text-red-500 text-sm mt-1">{errors.current}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwords.new}
                    onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      errors.new ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.new && (
                    <p className="text-red-500 text-sm mt-1">{errors.new}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      errors.confirm ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.confirm && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirm}</p>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 bg-gray-50 flex justify-end space-x-3 rounded-b-xl">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Update Password
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PasswordChangeModal;