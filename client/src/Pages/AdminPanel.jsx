import React, { useState } from "react";
import {
  AllowedEmailsForm,
  AllowedEmailsTable,
  UserTable,
} from "../Components";
import { ConfirmationPopup } from "../Utilities";

const AdminPanel = () => {
  // Sample data
  const [users, setUsers] = useState(
    [
      {
        id: 1,
        name: "Aakash",
        email: "john@example.com",
        position: "MEMBER",
        blocked: false,
      },
      {
        id: 2,
        name: "Sanjana",
        email: "jane@example.com",
        position: "CORE",
        blocked: false,
      },
      {
        id: 3,
        name: "Rachit",
        email: "bob@example.com",
        position: "USER",
        blocked: true,
      },
    ].concat(
      Array.from({ length: 20 }, (_, i) => ({
        id: i + 4,
        name: `User${i + 4}`,
        email: `user${i + 4}@example.com`,
        position: ["USER", "MEMBER", "CORE", "ADMIN"][
          Math.floor(Math.random() * 4)
        ],
        blocked: Math.random() > 0.5,
      }))
    )
  );

  const [allowedEmails, setAllowedEmails] = useState([
    { id: 1, email: "allowed1@example.com" },
    { id: 2, email: "allowed2@example.com" },
  ]);

  // Position hierarchy for promotion/demotion
  const positions = ["USER", "MEMBER", "CORE", "ADMIN"];

  // States for tabs, pagination, sorting, etc.
  const [activeTab, setActiveTab] = useState("users");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [showBlockedUsers, setShowBlockedUsers] = useState(true);
  const [emailInput, setEmailInput] = useState("");
  const [csvFile, setCsvFile] = useState(null);

  const [confirmationState, setConfirmationState] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // Modified handler functions
  const handlePromote = (user) => {
    const nextPosition = positions[positions.indexOf(user.position) + 1];
    setConfirmationState({
      isOpen: true,
      type: "info",
      title: "Promote User",
      message: `Are you sure you want to promote ${user.name} from ${user.position} to ${nextPosition}?`,
      onConfirm: () => {
        const currentIndex = positions.indexOf(user.position);
        if (currentIndex < positions.length - 1) {
          const updatedUsers = users.map((u) =>
            u.id === user.id
              ? { ...u, position: positions[currentIndex + 1] }
              : u
          );
          setUsers(updatedUsers);
        }
      },
    });
  };

  const handleDemote = (user) => {
    const prevPosition = positions[positions.indexOf(user.position) - 1];
    setConfirmationState({
      isOpen: true,
      type: "warning",
      title: "Demote User",
      message: `Are you sure you want to demote ${user.name} from ${user.position} to ${prevPosition}?`,
      onConfirm: () => {
        const currentIndex = positions.indexOf(user.position);
        if (currentIndex > 0) {
          const updatedUsers = users.map((u) =>
            u.id === user.id
              ? { ...u, position: positions[currentIndex - 1] }
              : u
          );
          setUsers(updatedUsers);
        }
      },
    });
  };

  const handleBlock = (user) => {
    setConfirmationState({
      isOpen: true,
      type: "danger",
      title: user.blocked ? "Unblock User" : "Block User",
      message: `Are you sure you want to ${
        user.blocked ? "unblock" : "block"
      } ${user.name}?`,
      onConfirm: () => {
        const updatedUsers = users.map((u) =>
          u.id === user.id ? { ...u, blocked: !u.blocked } : u
        );
        setUsers(updatedUsers);
      },
    });
  };

  const handleDelete = (user) => {
    setConfirmationState({
      isOpen: true,
      type: "danger",
      title: "Delete User",
      message: `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
      onConfirm: () => {
        setUsers(users.filter((u) => u.id !== user.id));
      },
    });
  };

  const handleAddEmail = () => {
    if (!emailInput.trim()) return;

    // Split the input by commas and clean up each email
    const emails = emailInput
      .split(",")
      .map((email) => email.trim())
      .filter((email) => {
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return email && emailRegex.test(email);
      });

    if (emails.length === 0) return;

    // Filter out duplicates and add new emails
    const newEmails = emails
      .filter(
        (email) => !allowedEmails.some((existing) => existing.email === email)
      )
      .map((email) => ({
        id: Date.now() + Math.random(), // Ensure unique IDs
        email: email,
      }));

    if (newEmails.length > 0) {
      setAllowedEmails([...allowedEmails, ...newEmails]);
      setEmailInput(""); // Clear input after successful addition
    }
  };

  const handleCsvUpload = (event) => {
    const file = event.target.files[0];
    // Handle CSV processing here
    setCsvFile(file);
  };

  const handleDeleteAllowedEmail = (id) => {
    setAllowedEmails(allowedEmails.filter((e) => e.id !== id));
  };

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

      {activeTab === "users" && (
        <UserTable
          users={users}
          handlePromote={handlePromote}
          handleDemote={handleDemote}
          handleBlock={handleBlock}
          handleDelete={handleDelete}
          showBlockedUsers={showBlockedUsers}
          setShowBlockedUsers={setShowBlockedUsers}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          sortField={sortField}
          setSortField={setSortField}
          sortDirection={sortDirection}
        />
      )}

      {activeTab === "emails" && (
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
          />
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
