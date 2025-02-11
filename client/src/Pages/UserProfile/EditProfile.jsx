import { useState } from "react";
import PropTypes from "prop-types";

// Components
import { PasswordChangeModal } from "../../Components";

// Assets and Icons
import { AakashPfp, codolioIcon } from "../../Assets";
import {
  RiPencilLine,
  RiCheckLine,
  RiCloseLine,
  RiImageAddLine,
  RiLockPasswordLine,
  RiLinkedinBoxFill,
  RiGithubFill,
} from "react-icons/ri";
import { platformIcons } from "../../Constants";

const EditProfile = () => {
  // State management for different profile sections
  const [profileData, setProfileData] = useState({
    // Personal Info
    name: "Aakash Kumar",
    bio: "Full-stack developer passionate about algorithms and competitive programming.",
    phoneNumber: "+91 9876543210",
    academicYear: "3rd Year",
    profilePic: AakashPfp,

    // Coding Profiles
    coding: {
      leetcode: "aakashyadav",
      codechef: "aakashkumar",
      codeforces: "aakashkyadav",
    },

    // Social Links
    social: {
      linkedin: "aakashkumar",
      github: "aakashkumar",
      codolio: "aakashkumar",
    },

    // Password Management
    currentPassword: "123454",
  });

  // Constants
  const academic_years_list = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

  // State to manage which fields are currently being edited
  const [editingFields, setEditingFields] = useState({});
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // ***** Edit Profile Handles *****

  // Generic field edit handler
  const handleFieldEdit = (section, field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [section]:
        typeof prev[section] === "object"
          ? { ...prev[section], [field]: value }
          : value,
    }));
  };

  // Profile Picture Upload Handler
  const handleProfilePicUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // TODO: Implement file upload logic
      console.log("Profile Picture Upload:", file);
      setProfileData((prev) => ({
        ...prev,
        profilePic: URL.createObjectURL(file),
      }));
    }
  };

  const handlePasswordChange = (passwords) => {
    // TODO: Implement password change logic
    console.log("Changing password:", passwords);
    // Add your API call here
  };

  // ***** Edit Profile Handle END *****

  // Edit Mode Toggle
  const toggleEditMode = (section, field) => {
    setEditingFields((prev) => ({
      ...prev,
      [`${section}-${field}`]: !prev[`${section}-${field}`],
    }));
  };

  // Editable Input Component
  const EditableInput = ({
    value,
    onSave,
    section,
    field,
    type = "text",
    icon: Icon,
    options,
  }) => {
    const [localValue, setLocalValue] = useState(value);
    const isEditing = editingFields[`${section}-${field}`];

    const handleSave = () => {
      onSave(localValue);
      toggleEditMode(section, field);
      // TODO: Backend save logic
      console.log(`Saving ${section} - ${field}:`, localValue);
    };

    return (
      <div className="flex items-center space-x-2">
        {!isEditing ? (
          <>
            <div className="flex-1 flex items-center bg-white rounded-lg p-2">
              {Icon && <Icon className="mr-2 text-gfgsc-green" />}
              <span className="text-gray-700">{value}</span>
            </div>
            <button
              onClick={() => toggleEditMode(section, field)}
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
              className="flex p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors"
            >
              <RiCheckLine />
            </button>
            <button
              onClick={() => toggleEditMode(section, field)}
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
            <div className="relative">
              <img
                src={profileData.profilePic || "https://placehold.co/100x100"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-gfgsc-green-200"
              />
              <label
                htmlFor="profilePicUpload"
                className="absolute bottom-0 right-0 bg-gfgsc-green text-white p-2 rounded-full cursor-pointer"
              >
                <RiImageAddLine />
                <input
                  type="file"
                  id="profilePicUpload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleProfilePicUpload}
                />
              </label>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <EditableInput
                value={profileData.name}
                onSave={(val) => handleFieldEdit("name", "name", val)}
                section="personal"
                field="name"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <EditableInput
                value={profileData.bio}
                onSave={(val) => handleFieldEdit("bio", "bio", val)}
                section="personal"
                field="bio"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <EditableInput
                value={profileData.phoneNumber}
                onSave={(val) =>
                  handleFieldEdit("phoneNumber", "phoneNumber", val)
                }
                section="personal"
                field="phoneNumber"
                type="tel"
              />
            </div>

            {/* Academic Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Academic Year
              </label>
              <EditableInput
                value={profileData.academicYear}
                onSave={(val) =>
                  handleFieldEdit("academicYear", "academicYear", val)
                }
                section="personal"
                field="academicYear"
                options={academic_years_list}
              />
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
                <EditableInput
                  value={profileData.coding.leetcode}
                  onSave={(val) => handleFieldEdit("coding", "leetcode", val)}
                  section="coding"
                  field="leetcode"
                />
                <div className="text-xs text-gray-500">
                  leetcode.com/u/{profileData.coding.leetcode}
                </div>
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
                <EditableInput
                  value={profileData.coding.codechef}
                  onSave={(val) => handleFieldEdit("coding", "codechef", val)}
                  section="coding"
                  field="codechef"
                />
                <div className="text-xs text-gray-500">
                  codechef.com/users/{profileData.coding.codechef}
                </div>
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
                <EditableInput
                  value={profileData.coding.codeforces}
                  onSave={(val) => handleFieldEdit("coding", "codeforces", val)}
                  section="coding"
                  field="codeforces"
                />
                <div className="text-xs text-gray-500">
                  codeforces.com/profile/{profileData.coding.codeforces}
                </div>
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
                <EditableInput
                  value={profileData.social.linkedin}
                  onSave={(val) => handleFieldEdit("social", "linkedin", val)}
                  section="social"
                  field="linkedin"
                />
                <div className="text-xs text-gray-500">
                  linkedin.com/in/{profileData.social.linkedin}
                </div>
              </div>
            </div>

            {/* GitHub */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl ">
              <div className="flex items-center space-x-3 mb-3">
                <RiGithubFill className="text-[#171515] text-2xl" />
                <label className="font-medium text-gray-800">GitHub</label>
              </div>
              <div className="space-y-2">
                <EditableInput
                  value={profileData.social.github}
                  onSave={(val) => handleFieldEdit("social", "github", val)}
                  section="social"
                  field="github"
                />
                <div className="text-xs text-gray-500">
                  github.com/{profileData.social.github}
                </div>
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
                <EditableInput
                  value={profileData.social.codolio}
                  onSave={(val) => handleFieldEdit("social", "codolio", val)}
                  section="social"
                  field="codolio"
                />
                <div className="text-xs text-gray-500">
                  codolio.com/profile/{profileData.social.codolio}
                </div>
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
