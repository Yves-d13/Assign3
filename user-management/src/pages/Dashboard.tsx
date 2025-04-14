import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import UserCard from "../components/UserCard";
import '../index.css'; 
import React from "react";

function UserManagement() {
  const [search, setSearch] = useState("");
  interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    [key: string]: any; // Add this if there are additional dynamic properties
  }

  const [users, setUsers] = useState<User[]>([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();
        if (response.status === 200) {
          setUsers(data.users || []);
        } else {
          console.error("Failed to fetch users:", data.message);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
        <Navbar
          onCreateUser={() => {}}
          onLogout={() => alert("Logged out")}
          onToggleTheme={() => setDarkMode(!darkMode)}
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
                onEdit={(updatedUser) => {
                  const updatedUsers = users.map((u) =>
                    u.id === updatedUser.id ? updatedUser : u
                  );
                  setUsers(updatedUsers);
                }}
                onDelete={(userToDelete) => {
                  const updatedUsers = users.filter((u) => u.id !== userToDelete.id);
                  setUsers(updatedUsers);
                }}
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