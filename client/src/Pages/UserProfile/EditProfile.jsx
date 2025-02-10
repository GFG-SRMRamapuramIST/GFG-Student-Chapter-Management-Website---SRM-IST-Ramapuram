import { useState } from "react";
import {
  RiPencilLine,
  RiCheckLine,
  RiCloseLine,
  RiImageAddLine,
  RiLockPasswordLine,
  RiLinkedinBoxLine,
  RiGithubLine,
} from "react-icons/ri";
import { AakashPfp } from "../../Assets";
import { PasswordChangeModal } from "../../Components";
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
    leetcode: {
      handle: "aakashyadav",
    },
    codechef: {
      handle: "aakashkumar",
    },
    codeforces: {
      handle: "aakashkyadav",
    },

    // Social Links
    linkedin: "https://linkedin.com/in/aakashkumar",
    codolio: "https://codolio.com/aakashkumar",

    // Password Management
    currentPassword: "123454",
    newPassword: "",
    confirmPassword: "",
  });

  // State to manage which fields are currently being edited
  const [editingFields, setEditingFields] = useState({});
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // ** Edit Profile Handles **

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

  // ** Edit Profile Handle END**

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
            <input
              type={type}
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gfgsc-green bg-white"
            />
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
      <div className="max-w-4xl mx-auto space-y-8">
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

          <div className="grid md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
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
              <label className="block text-sm font-medium text-gray-700">
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
              <label className="block text-sm font-medium text-gray-700">
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
              <label className="block text-sm font-medium text-gray-700">
                Academic Year
              </label>
              <EditableInput
                value={profileData.academicYear}
                onSave={(val) =>
                  handleFieldEdit("academicYear", "academicYear", val)
                }
                section="personal"
                field="academicYear"
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
                  value={profileData.leetcode.handle}
                  onSave={(val) => handleFieldEdit("leetcode", "handle", val)}
                  section="leetcode"
                  field="handle"
                />
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
                  value={profileData.codechef.handle}
                  onSave={(val) => handleFieldEdit("codechef", "handle", val)}
                  section="codechef"
                  field="handle"
                />
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
                  value={profileData.codeforces.handle}
                  onSave={(val) => handleFieldEdit("codeforces", "handle", val)}
                  section="codeforces"
                  field="handle"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Social Links Section */}
        <div className="bg-white shadow-lg rounded-xl p-6 space-y-6">
          <h2 className="text-2xl font-semibold text-gfgsc-green border-b pb-3">
            Social Links
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {/* LinkedIn */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                LinkedIn
              </label>
              <EditableInput
                value={profileData.linkedin}
                onSave={(val) => handleFieldEdit("linkedin", "linkedin", val)}
                section="social"
                field="linkedin"
                icon={RiLinkedinBoxLine}
              />
            </div>

            {/* Codolio */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Codolio
              </label>
              <EditableInput
                value={profileData.codolio}
                onSave={(val) => handleFieldEdit("codolio", "codolio", val)}
                section="social"
                field="codolio"
                icon={RiGithubLine}
              />
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

export default EditProfile;
