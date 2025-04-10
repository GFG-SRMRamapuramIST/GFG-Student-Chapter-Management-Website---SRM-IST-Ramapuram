import PropTypes from "prop-types";
import { useState } from "react";

// Icons
import {
  RiUserLine,
  RiArrowUpSLine,
  RiArrowDownSLine,
  RiDeleteBin6Line,
  RiSearchLine,
  RiSortAsc,
  RiSortDesc,
  RiInboxLine,
  RiShieldFill,
  RiShieldLine,
  RiFilterLine,
  RiCloseLine
} from "react-icons/ri";
import { Link } from "react-router-dom";

const UserTable = ({
  users,
  handlePromote,
  handleDemote,
  handleDelete,
  handleProtect,
  handleNextBtnClick,
  handlePrevBtnClick,
  handleSortOrderChange,
  pageData,
  searchData,
  sortDirection,
}) => {
  const { pageInfo, setPageInfo } = pageData;
  const { searchUser, setSearchUser } = searchData;
  
  // Multi-select filters state
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPositions, setSelectedPositions] = useState([]);
  const [selectedProtectionStatus, setSelectedProtectionStatus] = useState("");
  
  // List of all possible positions
  const allPositions = ["ADMIN", "COREMEMBER", "VICEPRESIDENT", "PRESIDENT", "MEMBER", "USER"];
  
  // Handle filter changes
  const handlePositionFilterChange = (position) => {
    setSelectedPositions(prev => 
      prev.includes(position) 
        ? prev.filter(p => p !== position)
        : [...prev, position]
    );
  };
  
  const handleProtectionStatusFilterChange = (status) => {
    setSelectedProtectionStatus(prev => prev === status ? "" : status);
  };
  
  // Apply filters 
  const applyFilters = () => {
    console.log("Applying filters:", {
      positions: selectedPositions,
      protectionStatus: selectedProtectionStatus
    });
    
    // API call here
    
    setShowFilters(false);
  };
  
  // Reset filters
  const resetFilters = () => {
    setSelectedPositions([]);
    setSelectedProtectionStatus("");
    
    console.log("Filters reset");
    // API call here
  };

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
                itemsPerPage: parseInt(e.target.value, 20),
              }))
            }
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
          </select>
          
          {/* Filter Button */}
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3 py-2 border rounded-lg flex items-center space-x-2 hover:bg-gray-50 ${
                selectedPositions.length > 0 || selectedProtectionStatus !== "" ? "bg-green-50 text-green-600 border-green-300" : ""
              }`}
            >
              <RiFilterLine />
              <span>Filters</span>
              {(selectedPositions.length > 0 || selectedProtectionStatus !== "") && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs bg-green-500 text-white rounded-full">
                  {selectedPositions.length + (selectedProtectionStatus !== "" ? 1 : 0)}
                </span>
              )}
            </button>
            
            {/* Filter Dropdown */}
            {showFilters && (
              <div className="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Filter Users</h3>
                    <button onClick={() => setShowFilters(false)} className="text-gray-500 hover:text-gray-700">
                      <RiCloseLine className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Position Filter */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2 text-gray-700">Position</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {allPositions.map(position => (
                        <label key={position} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={selectedPositions.includes(position)}
                            onChange={() => handlePositionFilterChange(position)}
                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                          />
                          <span className="text-sm">{position}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  {/* Protection Status Filter */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2 text-gray-700">Protection Status</h4>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          checked={selectedProtectionStatus === "protected"}
                          onChange={() => handleProtectionStatusFilterChange("protected")}
                          className="rounded-full border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm flex items-center">
                          <RiShieldFill className="text-blue-600 mr-1" /> Protected
                        </span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          checked={selectedProtectionStatus === "unprotected"}
                          onChange={() => handleProtectionStatusFilterChange("unprotected")}
                          className="rounded-full border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm flex items-center">
                          <RiShieldLine className="text-gray-600 mr-1" /> Unprotected
                        </span>
                      </label>
                    </div>
                  </div>
                  
                  {/* Filter Actions */}
                  <div className="flex justify-between pt-4 border-t border-gray-200">
                    <button
                      onClick={resetFilters}
                      className="px-3 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50"
                    >
                      Reset
                    </button>
                    <button
                      onClick={applyFilters}
                      className="px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
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
      
      {/* Active Filters Display */}
      {(selectedPositions.length > 0 || selectedProtectionStatus !== "") && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-500">Active filters:</span>
          
          {selectedPositions.map(position => (
            <div key={position} className="bg-green-50 border border-green-200 rounded-full px-3 py-1 text-xs flex items-center">
              <span className="text-green-700">{position}</span>
              <button 
                onClick={() => handlePositionFilterChange(position)}
                className="ml-2 text-green-500 hover:text-green-700"
              >
                <RiCloseLine className="w-3 h-3" />
              </button>
            </div>
          ))}
          
          {selectedProtectionStatus && (
            <div className="bg-green-50 border border-green-200 rounded-full px-3 py-1 text-xs flex items-center">
              <span className="text-green-700">
                {selectedProtectionStatus === "protected" ? "Protected" : "Unprotected"}
              </span>
              <button 
                onClick={() => setSelectedProtectionStatus("")}
                className="ml-2 text-green-500 hover:text-green-700"
              >
                <RiCloseLine className="w-3 h-3" />
              </button>
            </div>
          )}
          
          <button
            onClick={resetFilters}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Clear all
          </button>
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        {users.length > 0 ? (
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
                  Subscribed
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
                  key={user._id}
                  className={` ${user.blocked ? "bg-red-50" : user.protected ? "bg-blue-50" : "bg-white"} 
                    transition-colors duration-200 hover:bg-gray-50`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      to={`/profile/${user._id}`}
                      className="flex items-center"
                    >
                      <RiUserLine
                        className={`mr-2 ${
                          user.blocked ? "text-red-400" : user.protected ? "text-blue-400" : "text-gray-400"
                        }`}
                      />
                      <span className={user.blocked ? "text-red-500" : user.protected ? "text-blue-700" : ""}>
                        {user.name}
                      </span>
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {user.phoneNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {user.subscribed ? "Yes" : "No"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium
                      ${
                        user.role === "ADMIN"
                          ? "bg-purple-100 text-purple-600"
                          : user.role === "COREMEMBER"
                          ? "bg-blue-100 text-blue-600"
                          : user.role === "VICEPRESIDENT" || user.role === "PRESIDENT"
                          ? "bg-amber-100 text-amber-600"
                          : user.role === "MEMBER"
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      {/* Dynamic protect/unprotect button based on user's protected status */}
                      <button
                        onClick={() => handleProtect(user)}
                        className="p-1 rounded hover:bg-gray-100"
                        title={user.protected ? "Remove protection" : "Protect user"}
                      >
                        {user.protected ? (
                          <RiShieldFill className="text-blue-600" />
                        ) : (
                          <RiShieldLine className="text-gray-500" />
                        )}
                      </button>
                      <button
                        onClick={() => handlePromote(user)}
                        className="p-1 rounded hover:bg-gray-100"
                        disabled={user.role === "ADMIN"}
                        title={
                          user.role === "ADMIN"
                            ? "Cannot promote admin"
                            : "Promote user"
                        }
                      >
                        <RiArrowUpSLine className={user.role === "ADMIN" ? "text-gray-400" : "text-green-600"} />
                      </button>
                      <button
                        onClick={() => handleDemote(user)}
                        className="p-1 rounded hover:bg-gray-100"
                        disabled={user.role === "USER"}
                        title={
                          user.role === "USER"
                            ? "Cannot demote user"
                            : "Demote user"
                        }
                      >
                        <RiArrowDownSLine className={user.role === "USER" ? "text-gray-400" : "text-orange-600"} />
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        className="p-1 rounded hover:bg-gray-100"
                        disabled={user.protected}
                        title={user.protected ? "Protected user cannot be deleted" : "Delete user"}
                      >
                        <RiDeleteBin6Line className={user.protected ? "text-gray-400" : "text-red-600"} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <RiInboxLine className="text-gray-300 text-5xl mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-1">
              No users found
            </h3>
            <p className="text-gray-500 max-w-md">
              {searchUser || selectedPositions.length > 0 || selectedProtectionStatus
                ? `No users matching the current filters were found.`
                : "There are no users registered in the system yet."}
            </p>
          </div>
        )}
      </div>

      {users.length > 0 && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Showing {(pageInfo.currentPage - 1) * pageInfo.itemsPerPage + 1} to{" "}
            {Math.min(
              pageInfo.currentPage * pageInfo.itemsPerPage,
              users.length
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

UserTable.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      protected: PropTypes.bool,
      blocked: PropTypes.bool,
    })
  ).isRequired,
  handlePromote: PropTypes.func.isRequired,
  handleDemote: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleProtect: PropTypes.func.isRequired,
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