import { useState } from "react";
import Navbar from "../components/Navbar";
import UserCard from "../components/UserCard";
import '../index.css'; 
import React from "react";

const dummyUsers = [
  { firstName: "Yves", lastName: "Al Debs", email: "debsyves@gmail.com", status: "Active", dob: "2003-05-05" },
  { firstName: "Jane", lastName: "Smith", email: "jane.smith@example.com", status: "Locked", dob: "1988-10-22" },
  { firstName: "Alice", lastName: "Johnson", email: "alice.johnson@example.com", status: "Active", dob: "1995-02-10" },
  { firstName: "Bob", lastName: "Martin", email: "bob.martin@example.com", status: "Locked", dob: "1980-08-05" },
  { firstName: "Charlie", lastName: "Brown", email: "charlie.brown@example.com", status: "Active", dob: "1992-11-30" },
  { firstName: "David", lastName: "Lee", email: "david.lee@example.com", status: "Locked", dob: "1987-07-14" },
  { firstName: "Eve", lastName: "Green", email: "eve.green@example.com", status: "Active", dob: "1993-09-21" },
  { firstName: "Frank", lastName: "White", email: "frank.white@example.com", status: "Active", dob: "1994-01-25" },
  { firstName: "Grace", lastName: "Black", email: "grace.black@example.com", status: "Locked", dob: "1985-03-17" },
  { firstName: "Hannah", lastName: "", email: "hannah.purple@example.com", status: "Active", dob: "1996-12-03" },
];

function UserManagement() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState(dummyUsers);
  const [darkMode, setDarkMode] = useState(false);

  const handleCreateUser = () => {
    const newUser = {
      firstName: "New",
      lastName: "User",
      email: "new.user@example.com",
      status: "Active",
      dob: "2000-01-01",
    };
    setUsers([...users, newUser]);
  };

  const handleLogout = () => {
    console.log("Logout clicked");
    alert("You have been logged out.");
  };

  const handleEdit = (user) => {
    const updatedUsers = users.map((u) =>
      u.email === user.email ? user : u
    );
    setUsers(updatedUsers);
  };

  const handleDelete = (user) => {
    const updatedUsers = users.filter((u) => u.email !== user.email);
    setUsers(updatedUsers);
  };

  const toggleTheme = () => setDarkMode(!darkMode);

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(search.toLowerCase()) ||
      user.lastName.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
        <Navbar
          onCreateUser={handleCreateUser}
          onLogout={handleLogout}
          onToggleTheme={toggleTheme}
          darkMode={darkMode}
        />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <input
            type="text"
            placeholder="Search users..."
            className={`w-full p-3 mb-8 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              darkMode ? "border-gray-600 bg-gray-800 text-white" : "border-gray-300 bg-white text-black"
            }`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredUsers.map((user, index) => (
              <UserCard
                key={index}
                user={user}
                onEdit={handleEdit}
                onDelete={handleDelete}
                darkMode={darkMode}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default UserManagement;