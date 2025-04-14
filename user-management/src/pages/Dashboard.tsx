import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import UserCard from "../components/UserCard";
import '../index.css'; 
import React from "react";

function UserManagement() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<{ id: number; [key: string]: any }[]>([]);
  const [darkMode, setDarkMode] = useState(false);

  // Fetch users from the API
  const fetchUsers = async (query = "") => {
    try {
      const response = await fetch(`/api/users?search=${query}`); // Pass the search query as a query parameter
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

  // Create a new user
  const createUser = async () => {
    const newUser = {
      firstName: "New",
      lastName: "User",
      email: `new.user${Date.now()}@example.com`,
      status: "ACTIVE",
      dob: "2000-01-01",
    };

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      const data = await response.json();
      if (response.status === 201) {
        setUsers((prevUsers) => [...prevUsers, data.user]); // Add the new user to the state
      } else {
        console.error("Failed to create user:", data.message);
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  // Edit a user
  const editUser = async (updatedUser) => {
    try {
      const response = await fetch(`/api/users/${updatedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });
      const data = await response.json();
      if (response.status === 200) {
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === updatedUser.id ? data.user : user))
        ); // Update the user in the state
      } else {
        console.error("Failed to edit user:", data.message);
      }
    } catch (error) {
      console.error("Error editing user:", error);
    }
  };

  // Delete a user
  const deleteUser = async (userToDelete) => {
    try {
      const response = await fetch(`/api/users/${userToDelete.id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (response.status === 200) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userToDelete.id)); // Remove the user from the state
      } else {
        console.error("Failed to delete user:", data.message);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Fetch all users on initial load
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users whenever the search input changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers(search);
    }, 300); // Add a debounce delay to avoid excessive API calls

    return () => clearTimeout(delayDebounceFn); // Cleanup the timeout
  }, [search]);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
        <Navbar
          onCreateUser={createUser} // Pass the createUser function to Navbar
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
            {users.map((user, index) => (
              <UserCard
                key={index}
                user={user}
                onEdit={editUser} // Pass the editUser function
                onDelete={deleteUser} // Pass the deleteUser function
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