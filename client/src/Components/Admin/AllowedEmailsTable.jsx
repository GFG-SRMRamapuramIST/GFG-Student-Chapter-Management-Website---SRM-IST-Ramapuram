import PropTypes from "prop-types";

// Importing Icons
import { RiMailAddLine, RiDeleteBin6Line, RiSearchLine, RiInboxLine } from "react-icons/ri";

const AllowedEmailsTable = ({
  allowedEmails,
  handleDeleteAllowedEmail,
  handleNextBtnClick,
  handlePrevBtnClick,
  pageData,
  searchData,
}) => {
  const { pageInfo, setPageInfo } = pageData;
  const { searchUser, setSearchUser } = searchData;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center space-x-4">
          <select
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={pageInfo.itemsPerPage}
            onChange={(e) =>
              setPageInfo((prevState) => ({
                ...prevState,
                itemsPerPage: parseInt(e.target.value, 10),
              }))
            }
          >
            <option value={1}>1 per page</option>
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
          </select>
        </div>
        <div className="relative">
          <RiSearchLine className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            placeholder="Search user ..."
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {allowedEmails.length > 0 ? (
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
              {allowedEmails.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <RiMailAddLine className="mr-2 text-gray-400" />
                      {item.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() =>
                        handleDeleteAllowedEmail(item.email, item._id)
                      }
                      className="p-1 rounded hover:bg-gray-100"
                    >
                      <RiDeleteBin6Line className="text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <RiInboxLine className="text-gray-300 text-5xl mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-1">No emails found</h3>
            <p className="text-gray-500 max-w-md">
              {searchUser 
                ? `No emails matching "${searchUser}" were found.` 
                : "There are no allowed emails in the system yet. Add an email to get started."}
            </p>
          </div>
        )}
      </div>

      {allowedEmails.length > 0 && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Showing {(pageInfo.currentPage - 1) * pageInfo.itemsPerPage + 1} to{" "}
            {Math.min(
              pageInfo.currentPage * pageInfo.itemsPerPage,
              allowedEmails.length
            )}{" "}
            of {pageInfo.totalPages} pages
          </span>
          <div className="flex space-x-2">
            <button
              onClick={handlePrevBtnClick}
              disabled={pageInfo.currentPage === 1}
              className="px-3 py-1 rounded-lg border hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={handleNextBtnClick}
              disabled={pageInfo.currentPage >= pageInfo.totalPages}
              className="px-3 py-1 rounded-lg border hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

AllowedEmailsTable.propTypes = {
  allowedEmails: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      createdAt: PropTypes.string,
    })
  ).isRequired,
  handleDeleteAllowedEmail: PropTypes.func.isRequired,
  handleNextBtnClick: PropTypes.func.isRequired,
  handlePrevBtnClick: PropTypes.func.isRequired,
  pageData: PropTypes.shape({
    pageInfo: PropTypes.shape({
      currentPage: PropTypes.number.isRequired,
      itemsPerPage: PropTypes.number.isRequired,
      totalPages: PropTypes.number.isRequired,
    }).isRequired,
    setPageInfo: PropTypes.func.isRequired,
  }).isRequired,
  searchData: PropTypes.shape({
    searchUser: PropTypes.string.isRequired,
    setSearchUser: PropTypes.func.isRequired,
  }).isRequired,
};

export default AllowedEmailsTable;