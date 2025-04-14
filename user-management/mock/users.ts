import { MockMethod } from 'vite-plugin-mock';
import usersData from './users.json';
import fs from 'fs';
import path from 'path';

let users = usersData.users.map((user) => ({
  ...user,
  dob: user.dateOfBirth, // Map `dateOfBirth` to `dob`
  lastName: user.lastName || "Unknown", // Provide a default value for missing `lastName`
}));

const saveUsersToFile = (updatedUsers) => {
  const filePath = path.resolve(__dirname, './users.json');
  fs.writeFileSync(filePath, JSON.stringify({ users: updatedUsers }, null, 2));
};

const mock: MockMethod[] = [
  // GET: Fetch all users or filter by search query
  {
    url: '/api/users',
    method: 'get',
    timeout: 1000,
    response: ({ query }) => {
      const search = query.search?.toLowerCase() || "";
      const filteredUsers = users.filter(
        (user) =>
          user.firstName?.toLowerCase().includes(search) ||
          user.lastName?.toLowerCase().includes(search) ||
          user.email?.toLowerCase().includes(search)
      );
      return {
        status: 200,
        users: filteredUsers,
      };
    },
  },
  // POST: Create a new user
  {
    url: '/api/users',
    method: 'post',
    timeout: 1000,
    response: ({ body }) => {
      const newUser = {
        id: Date.now().toString(), // Generate a unique ID
        ...body,
      };
      users.push(newUser);
      saveUsersToFile(users); // Save the updated users to the file
      return {
        status: 201,
        message: 'User created successfully',
        user: newUser,
      };
    },
  },
  // PUT: Edit an existing user
  {
    url: '/api/users/:id',
    method: 'put',
    timeout: 1000,
    response: ({ body, query }) => {
      const userId = query.id;
      const userIndex = users.findIndex((user) => user.id === userId);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...body }; // Update the user
        saveUsersToFile(users); // Save the updated users to the file
        return {
          status: 200,
          message: 'User updated successfully',
          user: users[userIndex],
        };
      } else {
        return {
          status: 404,
          message: 'User not found',
        };
      }
    },
  },
  // DELETE: Delete a user
  {
    url: '/api/users/:id',
    method: 'delete',
    timeout: 1000,
    response: ({ query }) => {
      const userId = query.id;
      const userIndex = users.findIndex((user) => user.id === userId);
      if (userIndex !== -1) {
        const deletedUser = users.splice(userIndex, 1); // Remove the user from the array
        saveUsersToFile(users); // Save the updated users to the file
        return {
          status: 200,
          message: 'User deleted successfully',
          user: deletedUser,
        };
      } else {
        return {
          status: 404,
          message: 'User not found',
        };
      }
    },
  },
];

export default mock;