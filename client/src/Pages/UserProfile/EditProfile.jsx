import { useEffect, useState } from "react";
import PropTypes from "prop-types";

// Components
import {
  PasswordChangeModal,
  PlatformLinkPlaceholder,
  ProfilePictureEditor,
} from "../../Components";

// Assets and Icons
import { codolioIcon } from "../../Assets";
import { FaSpinner } from "react-icons/fa";
import {
  RiPencilLine,
  RiCheckLine,
  RiCloseLine,
  RiLockPasswordLine,
  RiLinkedinBoxFill,
} from "react-icons/ri";
import { platformIcons } from "../../Constants";

import { ToastMsg } from "../../Utilities";

// Importing APIs
import { UserServices } from "../../Services";

const EditProfile = () => {
  const {
    getEditProfilePageDataFuncion,
    editProfileFunction,
    changePasswordFunction,
    changeProfilePicFunction,
  } = UserServices();

  const [loading, setLoading] = useState(true);

  // State management for different profile sections
  const [profileData, setProfileData] = useState({});

  // Fetching edit profile page data *****
  const getEditProfilePageData = async () => {
    setLoading(true);
    try {
      //console.log("Fetching Edit Profile Data...");
      const response = await getEditProfilePageDataFuncion();
      //console.log(response.data);
      setProfileData(response.data);
    } catch (error) {
      ToastMsg("Internal Server Error!", "error");
      console.error("Login Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEditProfilePageData();
  }, []);
  // *************************************

  // Constants
  const academic_years_list = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

  // State to manage which fields are currently being edited
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // ***** Edit Profile Handles *****

  const handleProfilePicSave = async (file) => {
    const formData = new FormData();
    try {
      setLoading(true);
      formData.append("profilePicture", file);
      //console.log("Profile Picture Upload:", file);

      const response = await changeProfilePicFunction(formData);
      //console.log(response);
      if (response.status == 200) {
        ToastMsg(response.data.message, "success");
      } else {
        ToastMsg(response.response.data.message, "error");
      }
    } catch (error) {
      ToastMsg("Failed to update profile picture!", "error");
      console.error("Profile Picture Update Error:", error);
    } finally {
      setLoading(false);
      getEditProfilePageData();
    }
  };

  const handleProfilePicDelete = async () => {
    const formData = new FormData();
    try {
      setLoading(true);

      formData.append("profilePicture", null);

      const response = await changeProfilePicFunction(formData);
      //console.log(response);
      if (response.status == 200) {
        ToastMsg(response.data.message, "success");
      } else {
        ToastMsg(response.response.data.message, "error");
      }
    } catch (error) {
      ToastMsg("Failed to update profile picture!", "error");
      console.error("Profile Picture Update Error:", error);
    } finally {
      setLoading(false);
      getEditProfilePageData();
    }
  };

  // Password change handler
  const handlePasswordChange = async (passwords) => {
    //console.log(passwords);
    try {
      setLoading(true);
      const response = await changePasswordFunction({
        currentPassword: passwords.current,
        newPassword: passwords.new,
      });

      if (response.status === 200) {
        ToastMsg("Password updated successfully!", "success");
      } else {
        ToastMsg(
          response.response.data.message || "Failed to update password!",
          "error"
        );
      }
    } catch (error) {
      ToastMsg("Internal Server Error!", "error");
      console.error("Password Update Error:", error);
    } finally {
      getEditProfilePageData();
      setLoading(false);
    }
  };

  // ***** Edit Profile Handle END *****

  // Editable Input Component
  const EditableInput = ({
    value,
    field,
    type = "text",
    icon: Icon,
    options,
  }) => {
    const [localValue, setLocalValue] = useState(value);
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = async () => {
      if (!localValue?.trim()) {
        ToastMsg("Field cannot be empty!", "error");
        return;
      }

      setIsEditing(false);
      setLoading(true);

      try {
        let valueToSend = localValue;

        // Map academic year to numbers
        const academicYearMap = {
          "1st Year": 1,
          "2nd Year": 2,
          "3rd Year": 3,
          "4th Year": 4,
        };

        if (field === "academicYear") {
          valueToSend = academicYearMap[localValue];
        }

        const response = await editProfileFunction({ [field]: valueToSend });

        if (response.status === 200) {
          ToastMsg("Profile updated successfully!", "success");
        } else {
          ToastMsg(
            response.response.data.message || "Failed to update profile!",
            "error"
          );
          setLocalValue(value); // Reset to original value on error
        }
      } catch (error) {
        ToastMsg("Internal Server Error!", "error");
        console.error("Profile Update Error:", error);
        setLocalValue(value); // Reset to original value on error
      } finally {
        getEditProfilePageData();
        setLoading(false);
      }
    };

    const renderValue = () => {
      if (value) {
        return <div className="text-zinc-700">{value}</div>;
      }
      return value;
    };

    return (
      <div className="flex items-center space-x-2">
        {!isEditing ? (
          <>
            <div className="flex-1 flex items-center bg-white rounded-lg p-2">
              {Icon && <Icon className="mr-2 text-gfgsc-green" />}
              {renderValue()}
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="flex p-2 text-gfgsc-green hover:bg-gfgsc-green-100 rounded-full transition-colors"
            >
              <RiPencilLine />
            </button>
          </>
        ) : (
          <>
            {options ? (
              <select
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gfgsc-green bg-white"
              >
                <option value="">Select Year</option>
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={type}
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gfgsc-green bg-white"
              />
            )}
            <button
              onClick={handleSave}
              disabled={!localValue?.trim()}
              className={`flex p-2 rounded-full transition-colors ${
                !localValue?.trim()
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "text-green-600 hover:bg-green-100"
              }`}
            >
              <RiCheckLine />
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setLocalValue(value);
              }}
              className="flex p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
            >
              <RiCloseLine />
            </button>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-gfg-black mb-8">Edit Profile</h1>

        {/* Personal Information Section */}
        <div className="bg-white shadow-lg rounded-xl p-6 space-y-6">
          <h2 className="text-2xl font-semibold text-gfgsc-green border-b pb-3">
            Personal Information
          </h2>

          {/* Profile Picture */}
          <div className="flex items-center space-x-6">
            <ProfilePictureEditor
              currentImage={profileData.profilePic}
              onSave={handleProfilePicSave}
              onDelete={handleProfilePicDelete}
              loading={loading}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4 bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              {loading ? (
                <FaSpinner className="animate-spin inline-block" />
              ) : (
                <EditableInput
                  value={profileData.name}
                  section="personal"
                  field="name"
                />
              )}
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              {loading ? (
                <FaSpinner className="animate-spin inline-block" />
              ) : (
                <EditableInput
                  value={profileData.bio}
                  section="personal"
                  field="bio"
                />
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              {loading ? (
                <FaSpinner className="animate-spin inline-block" />
              ) : (
                <EditableInput
                  value={profileData.phoneNumber}
                  section="personal"
                  field="phoneNumber"
                  type="tel"
                />
              )}
            </div>

            {/* Academic Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Academic Year
              </label>
              {loading ? (
                <FaSpinner className="animate-spin inline-block" />
              ) : (
                <EditableInput
                  value={profileData.academicYear}
                  section="personal"
                  field="academicYear"
                  options={academic_years_list}
                />
              )}
            </div>
          </div>
        </div>

        {/* Coding Profiles Section */}
        <div className="bg-white shadow-lg rounded-xl p-6 space-y-6">
          <h2 className="text-2xl font-semibold text-gfgsc-green border-b pb-3">
            Coding Profiles
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* LeetCode */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl">
              <div className="flex items-center space-x-3 mb-3">
                {platformIcons.leetcode && (
                  <platformIcons.leetcode className="text-[#FFA116] text-2xl" />
                )}
                <label className="font-medium text-gray-800">LeetCode</label>
              </div>
              <div className="space-y-2">
                {loading ? (
                  <FaSpinner className="animate-spin inline-block" />
                ) : (
                  <>
                    <EditableInput
                      value={profileData.coding.leetcode}
                      section="coding"
                      field="leetcodeUsername"
                    />
                    <PlatformLinkPlaceholder
                      platform="leetcode"
                      username={profileData.coding.leetcode}
                    />
                  </>
                )}
              </div>
            </div>

            {/* CodeChef */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl">
              <div className="flex items-center space-x-3 mb-3">
                {platformIcons.codechef && (
                  <platformIcons.codechef className="text-[#5B4638] text-2xl" />
                )}
                <label className="font-medium text-gray-800">CodeChef</label>
              </div>
              <div className="space-y-2">
                {loading ? (
                  <FaSpinner className="animate-spin inline-block" />
                ) : (
                  <>
                    <EditableInput
                      value={profileData.coding.codechef}
                      section="coding"
                      field="codechefUsername"
                    />
                    <PlatformLinkPlaceholder
                      platform="codechef"
                      username={profileData.coding.codechef}
                    />
                  </>
                )}
              </div>
            </div>

            {/* Codeforces */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl">
              <div className="flex items-center space-x-3 mb-3">
                {platformIcons.codeforces && (
                  <platformIcons.codeforces className="text-[#1F8ACB] text-2xl" />
                )}
                <label className="font-medium text-gray-800">Codeforces</label>
              </div>
              <div className="space-y-2">
                {loading ? (
                  <FaSpinner className="animate-spin inline-block" />
                ) : (
                  <>
                    <EditableInput
                      value={profileData.coding.codeforces}
                      section="coding"
                      field="codeforcesUsername"
                    />
                    <PlatformLinkPlaceholder
                      platform="codeforces"
                      username={profileData.coding.codeforces}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Social Links Section */}
        <div className="bg-white shadow-lg rounded-xl p-6 space-y-6">
          <h2 className="text-2xl font-semibold text-gfgsc-green border-b pb-3">
            Social Links
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* LinkedIn */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl ">
              <div className="flex items-center space-x-3 mb-3">
                <RiLinkedinBoxFill className="text-[#0A66C2] text-2xl" />
                <label className="font-medium text-gray-800">LinkedIn</label>
              </div>
              <div className="space-y-2">
                {loading ? (
                  <FaSpinner className="animate-spin inline-block" />
                ) : (
                  <>
                    <EditableInput
                      value={profileData.social.linkedin}
                      section="social"
                      field="linkedinUsername"
                    />
                    <PlatformLinkPlaceholder
                      platform="linkedin"
                      username={profileData.social.linkedin}
                    />
                  </>
                )}
              </div>
            </div>

            {/* Codolio */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl">
              <div className="flex items-center space-x-3 mb-3">
                <img
                  src={codolioIcon}
                  className="h-4 text-[#171515] text-2xl"
                />
                <label className="font-medium text-gray-800">Codolio</label>
              </div>
              <div className="space-y-2">
                {loading ? (
                  <FaSpinner className="animate-spin inline-block" />
                ) : (
                  <>
                    <EditableInput
                      value={profileData.social.codolio}
                      section="social"
                      field="codolioUsername"
                    />
                    <PlatformLinkPlaceholder
                      platform="codolio"
                      username={profileData.social.codolio}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Password Change Section */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-red-500 flex items-center">
              <RiLockPasswordLine className="mr-2" /> Password
            </h2>
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="px-4 py-2 text-red-500 border-2 border-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>

      {/* Add the modal */}
      <PasswordChangeModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSubmit={handlePasswordChange}
      />
    </div>
  );
};

EditProfile.propTypes = {
  initialData: PropTypes.shape({
    personal: PropTypes.shape({
      name: PropTypes.string,
      bio: PropTypes.string,
      phoneNumber: PropTypes.string,
      academicYear: PropTypes.string,
      profilePic: PropTypes.string,
    }),
    coding: PropTypes.shape({
      leetcode: PropTypes.string,
      codechef: PropTypes.string,
      codeforces: PropTypes.string,
    }),
    social: PropTypes.shape({
      linkedin: PropTypes.string,
      github: PropTypes.string,
      codolio: PropTypes.string,
    }),
    currentPassword: PropTypes.string,
  }),
};

export default EditProfile;
