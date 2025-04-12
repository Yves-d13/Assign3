import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore, useThemeStore } from "../store/store";
import Navbar from "../components/Navbar";
import UserCard from "../components/UserCard";
import '../index.css';
import React from "react";

interface User {
  id?: string;
  firstName: string;
  lastName?: string;
  email: string;
  status: string;
  dob: string;
}

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

  

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
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
          }
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setUsers(data.result.data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
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
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify(newUser)
      });

      if (!response.ok) throw new Error('Failed to create user');

      const createdUser = await response.json();
      setUsers([...users, createdUser]);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleEdit = (user: User) => {
    setCurrentUser(user);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (user: User) => {
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete user');

      setUsers(users.filter(u => u.id !== user.id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`/api/users/${currentUser?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify(currentUser)
      });

      if (!response.ok) throw new Error('Failed to update user');

      const updatedUser = await response.json();
      setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating user:', error);
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
                onEdit={handleEdit}
                onDelete={handleDelete}
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
            />
            <input
              type="text"
              placeholder="Last Name"
              className={`w-full p-2 mb-4 border rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
              value={newUser.lastName}
              onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className={`w-full p-2 mb-4 border rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
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
            />
            <div className="flex justify-end">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleSaveNewUser}
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
            <div className="flex justify-end">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleSaveEdit}
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