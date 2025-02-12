import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// Importing Icons
import { FaSpinner } from "react-icons/fa";

import {
  AllowedEmailsForm,
  AllowedEmailsTable,
  UserTable,
} from "../Components";
import { ConfirmationPopup, ToastMsg, verifyUserToken } from "../Utilities";

// Importing APIs
import { AdminServices } from "../Services";

const AdminPanel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userToken = useSelector((state) => state.auth?.userToken);

  const {
    addAllowedEmails,
    fetchAllUsers,
    promoteUser,
    demoteUser,
    deleteUserAccount,
    fetchAllowedEmails,
    deleteAllowedEmail,
  } = AdminServices();

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("users");

  // ******************* Fetch & Operate on User Data Starts Here ***************
  const [users, setUsers] = useState([]);

  // Position hierarchy for promotion/demotion
  const positions = [
    "USER",
    "MEMBER",
    "COREMEMBER",
    "VICEPRESIDENT",
    "PRESIDENT",
    "ADMIN",
  ];

  const fetchUsersData = async () => {
    try {
      setLoading(true);
      const response = await fetchAllUsers({
        page: pageInfo.currentPage,
        limit: pageInfo.itemsPerPage,
        search: debouncedSearchUser,
        sortOrder: sortDirection === "asc" ? 1 : -1,
      });

      if (response.status === 200) {
        setUsers(response.data.data);
        //console.log("Users Data: ", response.data.data);
        setPageInfo({
          currentPage: parseInt(response.data.currentPage, 10),
          itemsPerPage: parseInt(response.data.limit, 10),
          totalPages: parseInt(response.data.totalPages, 10),
        });
      } else {
        ToastMsg("Error in fetching Users data, please try later!", "error");
        console.error(
          "Fetch Users Data Error: ",
          response.response.data.message
        );
      }
    } catch (error) {
      ToastMsg("Internal Server Error!", "error");
      console.error("Fetch Users Data Error: ", error.message);
    } finally {
      setLoading(false);
    }
  };

  const [confirmationState, setConfirmationState] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // Promote a user pop
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
          if (response.status == 200) {
            ToastMsg(response.data.message, "success");
          } else {
            ToastMsg(response.response.data.message, "error");
            //console.log(response.response.data);
          }
        } catch (error) {
          ToastMsg("Error in promoting user! Please try later", "error");
          console.error("Error in promoting user: ", error.message);
        } finally {
          fetchUsersData();
        }
      },
    });
  };

  // Demote a user pop
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
          if (response.status == 200) {
            ToastMsg(response.data.message, "success");
          } else {
            ToastMsg(response.response.data.message, "error");
            //console.log(response.response.data);
          }
        } catch (error) {
          ToastMsg("Error in demoting user! Please try later", "error");
          console.error("Error in demoting user: ", error.message);
        } finally {
          fetchUsersData();
        }
      },
    });
  };

  // Delete a user's account from the website
  const handleDelete = (user) => {
    setConfirmationState({
      isOpen: true,
      type: "danger",
      title: "Delete User",
      message: `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          const response = await deleteUserAccount({ userId: user._id });
          if (response.status == 200) {
            ToastMsg(response.data.message, "success");
          } else {
            ToastMsg(response.response.data.message, "error");
            //console.log(response.response.data);
          }
        } catch (error) {
          ToastMsg(
            "Error in deleting user's account! Please try later",
            "error"
          );
          console.error("Error in deleting user's account: ", error.message);
        } finally {
          fetchUsersData();
        }
      },
    });
  };
  // ******************** Fetch & Operate on User Data Ends Here *****************

  // **************** Fetch & Operate on Allowed Emails Data Starts Here **********
  const [allowedEmails, setAllowedEmails] = useState([]);

  const [emailInput, setEmailInput] = useState("");
  const [csvFile, setCsvFile] = useState(null);

  const fetchAllowedEmailsData = async () => {
    try {
      setLoading(true);
      const response = await fetchAllowedEmails({
        page: pageInfo.currentPage,
        limit: pageInfo.itemsPerPage,
        search: debouncedSearchUser,
        sortOrder: sortDirection === "asc" ? 1 : -1,
      });

      if (response.status === 200) {
        setAllowedEmails(response.data.data);
        //console.log("Allowed Emails Data: ", response.data.data);
        setPageInfo({
          currentPage: parseInt(response.data.currentPage, 10),
          itemsPerPage: parseInt(response.data.limit, 10),
          totalPages: parseInt(response.data.totalPages, 10),
        });
      } else {
        ToastMsg(
          "Error in fetching Allowed Emails data, please try later!",
          "error"
        );
        console.error(
          "Fetch Allowed Emails Data Error: ",
          response.response.data.message
        );
      }
    } catch (error) {
      ToastMsg("Internal Server Error!", "error");
      console.error("Fetch Allowed Emails Data Error: ", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmail = () => {
    if (!emailInput.trim()) return;

    // Split and validate emails first
    const emails = emailInput
      .split(",")
      .map((email) => email.trim())
      .filter((email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return email && emailRegex.test(email);
      });

    if (emails.length === 0) return;

    // Filter duplicates
    const newEmails = emails.filter(
      (email) => !allowedEmails.some((existing) => existing.email === email)
    );

    if (newEmails.length > 0) {
      setConfirmationState({
        isOpen: true,
        type: "info",
        title: "Add Email(s)",
        message: `Are you sure you want to add ${newEmails.length} email${
          newEmails.length > 1 ? "s" : ""
        } to the allowed list?`,
        onConfirm: async () => {
          //console.log(emails);

          try {
            const response = await addAllowedEmails({ emails: newEmails });
            if (response.status == 200) {
              ToastMsg(response.data.message, "success");
            } else {
              ToastMsg(response.response.data.message, "error");
              //console.log(response.response.data);
            }
          } catch (error) {
            ToastMsg("Error in adding emails! Please try later", "error");
            console.error("Error in adding emails: ", error.message);
          } finally {
            setEmailInput("");
            fetchAllowedEmailsData();
          }
        },
      });
    }
  };

  const handleCsvUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setConfirmationState({
        isOpen: true,
        type: "info",
        title: "Upload CSV",
        message: `Are you sure you want to process ${file.name}? This will add new emails to the allowed list.`,
        onConfirm: () => {
          setCsvFile(file);
          // Here you would add the CSV processing logic
          event.target.value = null; // Reset file input
        },
      });
    }
  };

  const handleDeleteAllowedEmail = (email, id) => {
    setConfirmationState({
      isOpen: true,
      type: "danger",
      title: "Delete User",
      message: `Are you sure you want to delete ${email}? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          const response = await deleteAllowedEmail({ userId: id });
          if (response.status == 200) {
            ToastMsg(response.data.message, "success");
          } else {
            ToastMsg(response.response.data.message, "error");
            //console.log(response.response.data);
          }
        } catch (error) {
          ToastMsg(
            "Error in deleting the allowed email! Please try later",
            "error"
          );
          console.error("Error in deleting the allowed email: ", error.message);
        } finally {
          fetchAllowedEmailsData();
        }
      },
    });
  };

  // **************** Fetch & Operate on Allowed Emails Data Ends Here **********

  // **************** Table Display Opertions Starts Here ********************
  const [pageInfo, setPageInfo] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalPage: null,
  });
  const [searchUser, setSearchUser] = useState("");
  const [debouncedSearchUser, setDebouncedSearchUser] = useState(searchUser);
  const [sortDirection, setSortDirection] = useState("asc");

  // Fetch user data or allowed emails data baed on active tab on initial load
  useEffect(() => {
    const fetchData = async () => {
      const response = await verifyUserToken(userToken, dispatch, navigate);
      //console.log(response);

      if (response?.role !== "ADMIN") {
        ToastMsg("Un-authorized access! Only ADMIN allowed!", "error");
        navigate("/");
        return;
      }

      if (activeTab === "users") {
        fetchUsersData();
      } else {
        fetchAllowedEmailsData();
      }
    };

    fetchData();
  }, [
    userToken,
    pageInfo.currentPage,
    pageInfo.itemsPerPage,
    debouncedSearchUser,
    sortDirection,
    activeTab,
  ]);

  // Debounce mechanism for serach input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchUser(searchUser);
    }, 1000); // 1s debounce time

    return () => {
      clearTimeout(handler);
    };
  }, [searchUser]);

  // Pagination - next btn
  const handleNextBtnClick = () => {
    setPageInfo((prevState) => ({
      ...prevState,
      currentPage: prevState.currentPage + 1,
    }));
  };
  // Pagination - prev btn
  const handlePrevBtnClick = () => {
    setPageInfo((prevState) => ({
      ...prevState,
      currentPage: prevState.currentPage - 1,
    }));
  };

  // Sorting
  const handleSortOrderChange = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // ***************** Table Operations Ends Here *************************

  const Tab = ({ label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`px-6 py-3 font-medium transition-colors duration-200
        ${
          isActive
            ? "text-green-600 border-b-2 border-green-600"
            : "text-gray-500 hover:text-green-600"
        }`}
    >
      {label}
    </button>
  );

  return (
    <div className=" mx-auto p-6 space-y-6">
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

      <div className="border-b">
        <div className="flex space-x-4">
          <Tab
            label="User Management"
            isActive={activeTab === "users"}
            onClick={() => setActiveTab("users")}
          />
          <Tab
            label="Allowed Emails"
            isActive={activeTab === "emails"}
            onClick={() => setActiveTab("emails")}
          />
        </div>
      </div>

      {activeTab === "users" &&
        (loading ? (
          <FaSpinner className="animate-spin inline-block" />
        ) : (
          <UserTable
            users={users}
            handlePromote={handlePromote}
            handleDemote={handleDemote}
            handleDelete={handleDelete}
            handleNextBtnClick={handleNextBtnClick}
            handlePrevBtnClick={handlePrevBtnClick}
            handleSortOrderChange={handleSortOrderChange}
            pageData={{ pageInfo, setPageInfo }}
            searchData={{ searchUser, setSearchUser }}
            sortDirection={sortDirection}
          />
        ))}

      {activeTab === "emails" &&
        (loading ? (
          <FaSpinner className="animate-spin inline-block" />
        ) : (
          <div className="space-y-6">
            <AllowedEmailsForm
              emailInput={emailInput}
              setEmailInput={setEmailInput}
              handleAddEmail={handleAddEmail}
              handleCsvUpload={handleCsvUpload}
            />
            <AllowedEmailsTable
              allowedEmails={allowedEmails}
              handleDeleteAllowedEmail={handleDeleteAllowedEmail}
              handleNextBtnClick={handleNextBtnClick}
              handlePrevBtnClick={handlePrevBtnClick}
              handleSortOrderChange={handleSortOrderChange}
              pageData={{ pageInfo, setPageInfo }}
              searchData={{ searchUser, setSearchUser }}
              sortDirection={sortDirection}
            />
          </div>
        ))}
    </div>
  );
};

export default AdminPanel;
