import { useState, useRef } from 'react';
import { RiImageAddLine, RiCheckLine, RiCloseLine, RiDeleteBin6Line, RiPencilLine } from 'react-icons/ri';
import { FaSpinner } from 'react-icons/fa';
import PropTypes from 'prop-types';

const ProfilePictureEditor = ({ currentImage, onSave, onDelete, loading }) => {
    const [tempImage, setTempImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = useRef(null);
  
    const handleFileSelect = (event) => {
      const file = event.target.files[0];
      if (file) {
        setSelectedFile(file);
        setTempImage(URL.createObjectURL(file));
        setIsEditing(true);
      }
    };
  
    const handleSave = () => {
      if (selectedFile && tempImage) {
        onSave(selectedFile);
        setIsEditing(false);
        setTempImage(null);
        setSelectedFile(null);
      }
    };
  
    const handleCancel = () => {
      setIsEditing(false);
      setTempImage(null);
      setSelectedFile(null);
    };

  const handleDelete = () => {
    onDelete();
  };

  if (loading) {
    return (
      <div className="w-32 h-32 rounded-full flex items-center justify-center bg-gray-100">
        <FaSpinner className="animate-spin text-2xl text-gfgsc-green" />
      </div>
    );
  }

  return (
    <div className="relative">
      <img
        src={tempImage || currentImage || "https://placehold.co/100x100"}
        alt="Profile"
        className="w-32 h-32 rounded-full object-cover border-4 border-gfgsc-green-200"
      />
      
      {!isEditing ? (
        <div className="absolute -bottom-2 -right-2 flex space-x-2">
          {!currentImage ? (
            <label
              htmlFor="profilePicUpload"
              className="bg-gfgsc-green text-white p-2 rounded-full cursor-pointer hover:bg-gfgsc-green-600 transition-colors"
            >
              <RiImageAddLine />
              <input
                type="file"
                id="profilePicUpload"
                className="hidden"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileSelect}
              />
            </label>
          ) : (
            <>
              <button
                onClick={() => fileInputRef.current.click()}
                className="bg-gfgsc-green text-white p-2 rounded-full cursor-pointer hover:bg-gfgsc-green-600 transition-colors"
              >
                <RiPencilLine />
              </button>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileSelect}
              />
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white p-2 rounded-full cursor-pointer hover:bg-red-600 transition-colors"
              >
                <RiDeleteBin6Line />
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="absolute -bottom-2 -right-2 flex space-x-2">
          <button
            onClick={handleSave}
            className="bg-green-500 text-white p-2 rounded-full cursor-pointer hover:bg-green-600 transition-colors"
          >
            <RiCheckLine />
          </button>
          <button
            onClick={handleCancel}
            className="bg-red-500 text-white p-2 rounded-full cursor-pointer hover:bg-red-600 transition-colors"
          >
            <RiCloseLine />
          </button>
        </div>
      )}
    </div>
  );
};

ProfilePictureEditor.propTypes = {
  currentImage: PropTypes.string,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default ProfilePictureEditor;