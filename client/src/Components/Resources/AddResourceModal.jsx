import { FaSpinner } from "react-icons/fa";
import { RotatingCloseButton } from "../../Utilities";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const AddResourceModal = ({ isOpen, onClose, onAdd }) => {
    const [loading, setLoading] = useState(false);
    const [video, setVideo] = useState({
      title: "",
      description: "",
      videoLink: ""
    });
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        setLoading(true);
        await onAdd(video);
      } catch (error) {
        console.log("Error in adding video: ", error);
      } finally {
        setLoading(false);
        setVideo({ title: "", description: "", videoLink: "" });
        onClose();
      }
    };
  
    return (
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-black/50"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Add New Video</h2>
                <RotatingCloseButton onClick={onClose} />
              </div>
  
              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="videoTitle" className="block text-sm font-medium text-gray-700 mb-1">
                      Video Title
                    </label>
                    <input
                      type="text"
                      id="videoTitle"
                      value={video.title}
                      onChange={(e) => setVideo({ ...video, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gfgsc-green focus:border-transparent transition-all"
                      placeholder="Video title"
                      required
                    />
                  </div>
  
                  <div>
                    <label htmlFor="videoDescription" className="block text-sm font-medium text-gray-700 mb-1">
                      Video Description
                    </label>
                    <textarea
                      id="videoDescription"
                      value={video.description}
                      onChange={(e) => setVideo({ ...video, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gfgsc-green focus:border-transparent transition-all"
                      placeholder="Video description"
                      required
                    />
                  </div>
  
                  <div>
                    <label htmlFor="videoLink" className="block text-sm font-medium text-gray-700 mb-1">
                      YouTube Video Link
                    </label>
                    <input
                      type="url"
                      id="videoLink"
                      value={video.videoLink}
                      onChange={(e) => setVideo({ ...video, videoLink: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gfgsc-green focus:border-transparent transition-all"
                      placeholder="https://www.youtube.com/embed/videoId"
                      required
                    />
                  </div>
                </div>
  
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gfgsc-green text-white rounded-lg hover:bg-emerald-600 transition-colors"
                  >
                    {loading ? <FaSpinner className="animate-spin inline-block" /> : null}{" "}
                    Add Video
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  };

export default AddResourceModal;