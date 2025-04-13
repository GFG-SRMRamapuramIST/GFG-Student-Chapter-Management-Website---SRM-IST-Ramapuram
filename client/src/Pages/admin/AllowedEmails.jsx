import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaSpinner } from "react-icons/fa";
import { AllowedEmailsForm, AllowedEmailsTable } from "../../Components";
import { ConfirmationPopup, ToastMsg } from "../../Utilities";
import { AdminServices } from "../../Services";

const AllowedEmails = () => {
  const userToken = useSelector((state) => state.auth?.userToken);

  const {
    addAllowedEmails,
    addAllowedEmailsCSV,
    fetchAllowedEmails,
    deleteAllowedEmail,
  } = AdminServices();

  const [loading, setLoading] = useState(false);
  const [allowedEmails, setAllowedEmails] = useState([]);
  const [emailInput, setEmailInput] = useState("");

  // Pagination and search states
  const [pageInfo, setPageInfo] = useState({
    currentPage: 1,
    itemsPerPage: 20,
    totalPages: 1,
  });
  const [searchUser, setSearchUser] = useState("");
  const [debouncedSearchUser, setDebouncedSearchUser] = useState("");

  // Confirmation popup state
  const [confirmationState, setConfirmationState] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // Fetch allowed emails
  const fetchAllowedEmailsData = async () => {
    try {
      setLoading(true);
      const response = await fetchAllowedEmails({
        page: pageInfo.currentPage,
        limit: pageInfo.itemsPerPage,
        search: debouncedSearchUser,
      });

      if (response.status === 200) {
        setAllowedEmails(response.data.data);
        setPageInfo({
          currentPage: parseInt(response.data.currentPage || 1, 10),
          itemsPerPage: parseInt(response.data.limit || 20, 10),
          totalPages: parseInt(response.data.totalPages || 1, 10),
        });
      } else {
        ToastMsg("Error fetching allowed emails", "error");
      }
    } catch (error) {
      console.error("Error fetching allowed emails:", error);
      ToastMsg("Internal server error", "error");
    } finally {
      setLoading(false);
    }
  };

  // Debounce search input and fetch initial data
  useEffect(() => {
    fetchAllowedEmailsData();
  }, [pageInfo.currentPage, pageInfo.itemsPerPage, debouncedSearchUser]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchUser(searchUser);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchUser]);

  // Add emails handler
  const handleAddEmail = () => {
    if (!emailInput.trim()) return;

    // Split and validate emails
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
          try {
            const response = await addAllowedEmails({ emails: newEmails });
            if (response.status === 200) {
              ToastMsg(response.data.message, "success");
            } else {
              ToastMsg("Failed to add emails", "error");
            }
          } catch (error) {
            console.error("Error adding emails:", error);
            ToastMsg("Error adding emails", "error");
          } finally {
            setEmailInput("");
            fetchAllowedEmailsData();
          }
        },
      });
    }
  };

  // CSV upload handler
  const handleCsvUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setConfirmationState({
        isOpen: true,
        type: "info",
        title: "Upload CSV",
        message: `Are you sure you want to process ${file.name}? This will add new emails to the allowed list.`,
        onConfirm: async () => {
          const formData = new FormData();
          formData.append("file", file);

          try {
            const response = await addAllowedEmailsCSV(formData, userToken);
            if (response.status === 200) {
              ToastMsg(response.data.message, "success");
            } else {
              ToastMsg("Failed to upload CSV", "error");
            }
          } catch (error) {
            console.error("Error uploading CSV:", error);
            ToastMsg("Error uploading CSV", "error");
          } finally {
            event.target.value = null; // Reset file input
            fetchAllowedEmailsData();
          }
        },
      });
    }
  };

  // Delete email handler
  const handleDeleteAllowedEmail = (email, id) => {
    setConfirmationState({
      isOpen: true,
      type: "danger",
      title: "Delete Email",
      message: `Are you sure you want to delete ${email}? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          const response = await deleteAllowedEmail({ userId: id });
          if (response.status === 200) {
            ToastMsg(response.data.message, "success");
          } else {
            ToastMsg("Failed to delete email", "error");
          }
        } catch (error) {
          console.error("Error deleting email:", error);
          ToastMsg("Error deleting email", "error");
        } finally {
          fetchAllowedEmailsData();
        }
      },
    });
  };

  // Pagination handlers
  const handleNextBtnClick = () => {
    setPageInfo((prev) => ({ ...prev, currentPage: prev.currentPage + 1 }));
  };

  const handlePrevBtnClick = () => {
    setPageInfo((prev) => ({ ...prev, currentPage: prev.currentPage - 1 }));
  };

  return (
    <>
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

      {loading ? (
        <div className="flex justify-center py-12">
          <FaSpinner className="animate-spin text-3xl text-green-600" />
        </div>
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
            pageData={{ pageInfo, setPageInfo }}
            searchData={{ searchUser, setSearchUser }}
          />
        </div>
      )}
    </>
  );
};

export default AllowedEmails;
