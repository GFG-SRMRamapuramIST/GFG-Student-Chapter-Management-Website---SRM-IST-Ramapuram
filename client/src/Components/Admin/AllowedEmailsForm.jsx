// Icons
import { RiAddCircleLine, RiFileUploadLine } from 'react-icons/ri';

const AllowedEmailsForm = ({ emailInput, setEmailInput, handleAddEmail, handleCsvUpload }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-4">
      <h3 className="text-lg font-medium">Add Allowed Emails</h3>
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <textarea
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="Enter email addresses (comma-separated)"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 h-24"
          />
          <p className="text-sm text-gray-500 mt-1">
            Example: user1@example.com, user2@example.com
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAddEmail}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <RiAddCircleLine className="inline mr-2" />
            Add Emails
          </button>
          <div className="relative">
            <input
              type="file"
              accept=".csv"
              onChange={handleCsvUpload}
              className="hidden"
              id="csvUpload"
            />
            <label
              htmlFor="csvUpload"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
            >
              <RiFileUploadLine className="inline mr-2" />
              Upload CSV
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllowedEmailsForm;