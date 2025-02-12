import PropTypes from "prop-types";

// Icons
import {
  RiUserLine,
  RiArrowUpSLine,
  RiArrowDownSLine,
  RiDeleteBin6Line,
  RiSearchLine,
  RiSortAsc,
  RiSortDesc,
} from "react-icons/ri";

const UserTable = ({
  users,
  handlePromote,
  handleDemote,
  handleDelete,
  handleNextBtnClick,
  handlePrevBtnClick,
  handleSortOrderChange,
  pageData,
  searchData,
  sortDirection,
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
                itemsPerPage: parseInt(e.target.value, 10), // Corregido aquí
              }))
            }
          >
            <option value={1}>1 per page</option>
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
          </select>
          {/*<button
            onClick={() => setShowBlockedUsers(!showBlockedUsers)}
            className={`px-4 py-2 rounded-lg transition-colors duration-200
              ${
                showBlockedUsers
                  ? "bg-red-100 text-red-600 hover:bg-red-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            <IoBan className="inline mr-2" />
            {showBlockedUsers ? "Hide" : "Show"} Blocked
          </button>*/}
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

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={handleSortOrderChange}
              >
                <div className="flex items-center space-x-1">
                  <span>Name</span>
                  {sortDirection === "asc" ? <RiSortAsc /> : <RiSortDesc />}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone No.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr
                key={user.id}
                className={`${user.blocked ? "bg-red-50" : "bg-white"} 
                  transition-colors duration-200 hover:bg-gray-50`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <RiUserLine
                      className={`mr-2 ${
                        user.blocked ? "text-red-400" : "text-gray-400"
                      }`}
                    />
                    <span className={user.blocked ? "text-red-500" : ""}>
                      {user.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {user.phoneNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium
                    ${
                      user.role === "ADMIN"
                        ? "bg-purple-100 text-purple-600"
                        : user.position === "CORE"
                        ? "bg-blue-100 text-blue-600"
                        : user.position === "MEMBER"
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePromote(user)}
                      className="p-1 rounded hover:bg-gray-100"
                      disabled={user.position === "ADMIN"}
                      title={
                        user.position === "ADMIN"
                          ? "Cannot promote admin"
                          : "Promote user"
                      }
                    >
                      <RiArrowUpSLine className="text-green-600" />
                    </button>
                    <button
                      onClick={() => handleDemote(user)}
                      className="p-1 rounded hover:bg-gray-100"
                      disabled={user.position === "USER"}
                      title={
                        user.position === "USER"
                          ? "Cannot demote user"
                          : "Demote user"
                      }
                    >
                      <RiArrowDownSLine className="text-orange-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(user)}
                      className="p-1 rounded hover:bg-gray-100"
                      title="Delete user"
                    >
                      <RiDeleteBin6Line className="text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          Showing {(pageInfo.currentPage - 1) * pageInfo.itemsPerPage + 1} to{" "}
          {Math.min(pageInfo.currentPage * pageInfo.itemsPerPage, users.length)}{" "}
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
    </div>
  );
};

UserTable.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
    })
  ).isRequired,
  handlePromote: PropTypes.func.isRequired,
  handleDemote: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleNextBtnClick: PropTypes.func.isRequired,
  handlePrevBtnClick: PropTypes.func.isRequired,
  handleSortOrderChange: PropTypes.func.isRequired,
  pageData: PropTypes.shape({
    pageInfo: PropTypes.shape({
      currentPage: PropTypes.number.isRequired,
      itemsPerPage: PropTypes.number.isRequired,
      totalPages: PropTypes.number,
    }).isRequired,
    setPageInfo: PropTypes.func.isRequired,
  }).isRequired,
  searchData: PropTypes.shape({
    searchUser: PropTypes.string.isRequired,
    setSearchUser: PropTypes.func.isRequired,
  }).isRequired,
  sortDirection: PropTypes.oneOf(["asc", "desc"]).isRequired,
};

export default UserTable;
