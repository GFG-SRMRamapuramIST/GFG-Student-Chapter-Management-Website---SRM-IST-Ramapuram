// Icons
import { RiMailAddLine, RiDeleteBin6Line } from 'react-icons/ri';

const AllowedEmailsTable = ({ allowedEmails, handleDeleteAllowedEmail }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email Address
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {allowedEmails.map(item => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <RiMailAddLine className="mr-2 text-gray-400" />
                  {item.email}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => handleDeleteAllowedEmail(item.id)}
                  className="p-1 rounded hover:bg-gray-100"
                >
                  <RiDeleteBin6Line className="text-red-600" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllowedEmailsTable;