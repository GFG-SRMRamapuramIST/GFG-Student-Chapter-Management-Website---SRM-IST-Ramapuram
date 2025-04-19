import { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { AddPointsPopup, UserTable } from "../../Components";
import { ConfirmationPopup, ToastMsg } from "../../Utilities";
import { AdminServices } from "../../Services";

const UserManagement = () => {
  const {
    fetchAllUsers,
    promoteUser,
    demoteUser,
    deleteUserAccount,
    toggleProtectedStatus,
    updateTotalQuestionSolvedOfUser,
  } = AdminServices();

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  // Filter and pagination states
  const [pageInfo, setPageInfo] = useState({
    currentPage: 1,
    itemsPerPage: 20,
    totalPages: 1,
  });
  const [searchUser, setSearchUser] = useState("");
  const [debouncedSearchUser, setDebouncedSearchUser] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  // Position and protection status filters
  const [selectedPositions, setSelectedPositions] = useState([]);
  const [selectedProtectionStatus, setSelectedProtectionStatus] = useState("");

  // Confirmation popup state
  const [confirmationState, setConfirmationState] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // Add Points popup state
  const [pointsPopupState, setPointsPopupState] = useState({
    isOpen: false,
    user: null,
  });

  // Position hierarchy for promotion/demotion
  const positions = [
    "USER",
    "MEMBER",
    "COREMEMBER",
    "VICEPRESIDENT",
    "PRESIDENT",
    "ADMIN",
  ];

  // Fetch users with filters
  const fetchUsersData = async ({
    page = pageInfo.currentPage,
    limit = pageInfo.itemsPerPage,
    search = debouncedSearchUser,
    sortOrder = sortDirection === "asc" ? 1 : -1,
    roles = selectedPositions,
    protected: isProtected = selectedProtectionStatus === "protected"
      ? true
      : selectedProtectionStatus === "unprotected"
      ? false
      : undefined,
  } = {}) => {
    try {
      setLoading(true);
      const response = await fetchAllUsers({
        page,
        limit,
        search,
        sortOrder,
        roles,
        protected: isProtected,
      });

      if (response.status === 200) {
        setUsers(response.data.data);
        setPageInfo({
          currentPage: parseInt(response.data.currentPage || 1, 10),
          itemsPerPage: parseInt(response.data.limit || 20, 10),
          totalPages: parseInt(response.data.totalPages || 1, 10),
        });
      } else {
        ToastMsg("Error fetching user data", "error");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      ToastMsg("Internal server error", "error");
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch and search debouncing
  useEffect(() => {
    fetchUsersData();
  }, [
    pageInfo.currentPage,
    pageInfo.itemsPerPage,
    debouncedSearchUser,
    sortDirection,
  ]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchUser(searchUser);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchUser]);

  // Handle promotion
  const handlePromote = (user) => {
    const nextPosition = positions[positions.indexOf(user.role) + 1];
    setConfirmationState({
      isOpen: true,
      type: "info",
      title: "Promote User",
      message: `Are you sure you want to promote ${user.name} from ${user.role} to ${nextPosition}?`,
      onConfirm: async () => {
        try {
          const response = await promoteUser({ userId: user._id });
          if (response.status === 200) {
            ToastMsg(response.data.message, "success");
          } else {
            ToastMsg("Failed to promote user", "error");
          }
        } catch (error) {
          console.error("Error promoting user:", error);
          ToastMsg("Error promoting user", "error");
        } finally {
          fetchUsersData();
        }
      },
    });
  };

  // Handle demotion
  const handleDemote = (user) => {
    const prevPosition = positions[positions.indexOf(user.role) - 1];
    setConfirmationState({
      isOpen: true,
      type: "warning",
      title: "Demote User",
      message: `Are you sure you want to demote ${user.name} from ${user.role} to ${prevPosition}?`,
      onConfirm: async () => {
        try {
          const response = await demoteUser({ userId: user._id });
          if (response.status === 200) {
            ToastMsg(response.data.message, "success");
          } else {
            ToastMsg("Failed to demote user", "error");
          }
        } catch (error) {
          console.error("Error demoting user:", error);
          ToastMsg("Error demoting user", "error");
        } finally {
          fetchUsersData();
        }
      },
    });
  };

  // Handle user deletion
  const handleDelete = (user) => {
    setConfirmationState({
      isOpen: true,
      type: "danger",
      title: "Delete User",
      message: `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          const response = await deleteUserAccount({ userId: user._id });
          if (response.status === 200) {
            ToastMsg(response.data.message, "success");
          } else {
            ToastMsg("Failed to delete user", "error");
          }
        } catch (error) {
          console.error("Error deleting user:", error);
          ToastMsg("Error deleting user", "error");
        } finally {
          fetchUsersData();
        }
      },
    });
  };

  // Handle user protection
  const handleProtect = (user) => {
    if (user.protected) {
      setConfirmationState({
        isOpen: true,
        type: "danger",
        title: "Unprotect User",
        message: `Are you sure you want to remove protection from ${user.name}?`,
        onConfirm: async () => {
          try {
            const response = await toggleProtectedStatus({ userId: user._id });
            //console.log(response);
            if (response.status === 200) {
              ToastMsg(response.data.message, "success");
            } else {
              ToastMsg(response.response.data.message, "error");
            }
          } catch (error) {
            console.error("Error removing protection of the user:", error);
            ToastMsg("Error removing protection of the user", "error");
          } finally {
            fetchUsersData();
          }
        },
      });
    } else {
      setConfirmationState({
        isOpen: true,
        type: "info",
        title: "Protect User",
        message: `Are you sure you want to protect ${user.name}?`,
        onConfirm: async () => {
          try {
            const response = await toggleProtectedStatus({ userId: user._id });
            if (response.status === 200) {
              ToastMsg(response.data.message, "success");
            } else {
              ToastMsg(response.response.data.message, "error");
            }
          } catch (error) {
            console.error("Error protecting the user:", error);
            ToastMsg("Error protecting the user", "error");
          } finally {
            fetchUsersData();
          }
        },
      });
    }
  };

  // Pagination handlers
  const handleNextBtnClick = () => {
    setPageInfo((prev) => ({ ...prev, currentPage: prev.currentPage + 1 }));
  };

  const handlePrevBtnClick = () => {
    setPageInfo((prev) => ({ ...prev, currentPage: prev.currentPage - 1 }));
  };

  // Sorting handler
  const handleSortOrderChange = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // Filter handlers
  const handleApplyFilters = () => {
    fetchUsersData();
  };

  const handleResetFilters = () => {
    setSelectedPositions([]);
    setSelectedProtectionStatus("");

    fetchUsersData({
      page: 1,
      search: "",
      roles: [],
      protected: undefined,
    });
  };

  // Handle points update
  const handleAddPoints = (user) => {
    setPointsPopupState({
      isOpen: true,
      user,
    });
  };

  const handlePointsSubmit = async ({ userId, points }) => {
    console.log("Points updated successfully", { userId, points });
    try {
      setLoading(true);
      const response = await updateTotalQuestionSolvedOfUser({
        userId,
        points,
      });

      if (response.status == 200) {
        ToastMsg(response.data.message, "success");
      } else {
        ToastMsg(response.response.data.message, "error");
      }
    } catch (error) {
      console.error("Error adding point for the user:", error);
      ToastMsg("Error adding point for the user", "error");
    } finally {
      setLoading(false);
      fetchUsersData();
    }
  };

  return (
    <div className="relative">
      <ConfirmationPopup
        isOpen={confirmationState.isOpen}
        onClose={() =>
          setConfirmationState({ ...confirmationState, isOpen: false })
        }
        onConfirm={confirmationState.onConfirm}
        type={confirmationState.type}
        title={confirmationState.title}
        message={confirmationState.message}
      />

      <AddPointsPopup
        isOpen={pointsPopupState.isOpen}
        onClose={() => setPointsPopupState({ ...pointsPopupState, isOpen: false })}
        user={pointsPopupState.user}
        onSubmit={handlePointsSubmit}
      />

      {loading ? (
        <div className="flex justify-center py-12">
          <FaSpinner className="animate-spin text-3xl text-green-600" />
        </div>
      ) : (
        <UserTable
          users={users}
          handlePromote={handlePromote}
          handleDemote={handleDemote}
          handleDelete={handleDelete}
          handleProtect={handleProtect}
          handleAddPoints={handleAddPoints}
          handleNextBtnClick={handleNextBtnClick}
          handlePrevBtnClick={handlePrevBtnClick}
          handleSortOrderChange={handleSortOrderChange}
          pageData={{ pageInfo, setPageInfo }}
          searchData={{ searchUser, setSearchUser }}
          sortDirection={sortDirection}
          positionState={{ selectedPositions, setSelectedPositions }}
          protectionState={{
            selectedProtectionStatus,
            setSelectedProtectionStatus,
          }}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
        />
      )}
    </div>
  );
};

export default UserManagement;
