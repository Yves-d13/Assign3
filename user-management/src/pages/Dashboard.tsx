import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore, useThemeStore } from "../store/store";
import Navbar from "../components/Navbar";
import UserCard from "../components/UserCard";
import '../index.css';
import { User } from "../types/index";
import React from "react";

interface NewUser {
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  dob: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { accessToken, logout } = useAuthStore();
  const { darkMode, toggleTheme } = useThemeStore();

  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<NewUser>({
    firstName: "",
    lastName: "",
    email: "",
    status: "Active",
    dob: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = search ? `/api/users?search=${search}` : '/api/users';
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            logout();
            navigate('/login');
            return;
          }
          throw new Error(`Failed to fetch users: ${response.statusText}`);
        }

        const data = await response.json();
        setUsers(data.result?.data?.users || []);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [accessToken, navigate, logout, search]);

  const handleCreateUser = () => {
    setNewUser({
      firstName: "",
      lastName: "",
      email: "",
      status: "Active",
      dob: "",
    });
    setIsCreateModalOpen(true);
  };

  const handleSaveNewUser = async () => {
    try {
      setError(null);
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newUser),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to create user: ${response.statusText}`);
      }
  
      const createdUser = await response.json();
      setUsers((prevUsers) => [...prevUsers, createdUser]);
      setIsCreateModalOpen(false);
      setNewUser({
        firstName: '',
        lastName: '',
        email: '',
        status: 'Active',
        dob: '',
      });
    } catch (error) {
      console.error('Error creating user:', error);
      setError(error instanceof Error ? error.message : 'Failed to create user');
    }
  };

  const handleEdit = (user: User) => {
    setCurrentUser(user);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (user: User) => {
    if (!window.confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
      return;
    }
  
    try {
      setError(null);
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (!response.ok) {
        if (response.status === 401) {
          logout();
          navigate('/login');
          return;
        }
        throw new Error(`Failed to delete user: ${response.statusText}`);
      }
  
      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));
    } catch (error) {
      console.error('Error deleting user:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete user');
    }
  };

  const handleSaveEdit = async () => {
    if (!currentUser) return;
  
    try {
      setError(null);
      const response = await fetch(`/api/users/${currentUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(currentUser),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to update user: ${response.statusText}`);
      }
  
      const updatedUser = await response.json();
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      );
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating user:', error);
      setError(error instanceof Error ? error.message : 'Failed to update user');
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <Navbar
        onCreateUser={handleCreateUser}
        onLogout={() => {
          logout();
          navigate('/login');
        }}
        onToggleTheme={toggleTheme}
        darkMode={darkMode}
      />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className={`p-4 mb-4 rounded-lg ${darkMode ? "bg-red-900" : "bg-red-100"}`}>
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Search users..."
          className={`w-full p-3 mb-8 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
            darkMode
              ? "border-gray-600 text-white bg-gray-800 focus:ring-blue-400"
              : "border-gray-300 text-gray-700 bg-white focus:ring-blue-400"
          }`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : users.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onEdit={() => handleEdit(user)}
                onDelete={() => handleDelete(user)}
                darkMode={darkMode}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg">No users found</p>
          </div>
        )}
      </main>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg shadow-lg w-96 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-lg font-bold mb-4">Create User</h2>
            <input
              type="text"
              placeholder="First Name"
              className={`w-full p-2 mb-4 border rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
              value={newUser.firstName}
              onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              className={`w-full p-2 mb-4 border rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
              value={newUser.lastName}
              onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className={`w-full p-2 mb-4 border rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              required
            />
            <select
              className={`w-full p-2 mb-4 border rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
              value={newUser.status}
              onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
            >
              <option value="Active">Active</option>
              <option value="Locked">Locked</option>
            </select>
            <input
              type="date"
              className={`w-full p-2 mb-4 border rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
              value={newUser.dob}
              onChange={(e) => setNewUser({ ...newUser, dob: e.target.value })}
              required
            />
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancel
              </button>
              <button
  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
  onClick={handleSaveNewUser}
  disabled={!newUser.firstName || !newUser.email}
>
  Save
</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && currentUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg shadow-lg w-96 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-lg font-bold mb-4">Edit User</h2>
            <input
              type="text"
              placeholder="First Name"
              className={`w-full p-2 mb-4 border rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
              value={currentUser.firstName}
              onChange={(e) => setCurrentUser({ ...currentUser, firstName: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              className={`w-full p-2 mb-4 border rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
              value={currentUser.lastName || ''}
              onChange={(e) => setCurrentUser({ ...currentUser, lastName: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className={`w-full p-2 mb-4 border rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
              value={currentUser.email}
              onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
              required
            />
            <select
              className={`w-full p-2 mb-4 border rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
              value={currentUser.status}
              onChange={(e) => setCurrentUser({ ...currentUser, status: e.target.value })}
            >
              <option value="Active">Active</option>
              <option value="Locked">Locked</option>
            </select>
            <input
              type="date"
              className={`w-full p-2 mb-4 border rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
              value={currentUser.dob}
              onChange={(e) => setCurrentUser({ ...currentUser, dob: e.target.value })}
            />
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
                onClick={handleSaveEdit}
                disabled={!currentUser.firstName || !currentUser.email}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}