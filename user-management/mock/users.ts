import { MockMethod } from 'vite-plugin-mock';

import { ApiHeaders } from './mock.type';
import { generateResponse, getUnAuthorizedResponse, validateToken } from './mock.util';
import usersData from './users.json';

interface User {
  id: number;
  firstName: string;
  lastName?: string;
  email: string;
}

let users: User[] = [...usersData.users]; // Use a mutable array to simulate a database

const mock: MockMethod[] = [
  // GET: Fetch users
  {
    url: '/api/users',
    method: 'get',
    timeout: 2000,
    response: ({ query, headers }: { query: { search?: string }; headers: ApiHeaders }) => {
      if (validateToken(headers.authorization)) {
        const { search } = query;
        const lowerCaseSearch = search?.toLowerCase() || '';

        let filteredUsers = users;
        if (lowerCaseSearch) {
          filteredUsers = users.filter(
            (user) =>
              user.firstName.toLowerCase().includes(lowerCaseSearch) ||
              (user.lastName && user.lastName.toLowerCase().includes(lowerCaseSearch)) ||
              user.email.toLowerCase().includes(lowerCaseSearch),
          );
        }
        return generateResponse({ users: filteredUsers });
      }
      return getUnAuthorizedResponse();
    },
  },

  // POST: Create a new user
  {
    url: '/api/users',
    method: 'post',
    timeout: 1000,
    response: ({ body, headers }: { body: any; headers: ApiHeaders }) => {
      if (validateToken(headers.authorization)) {
        const newUser = { id: Date.now(), ...body }; // Generate a unique ID
        users.push(newUser);
        return generateResponse(newUser);
      }
      return getUnAuthorizedResponse();
    },
  },

  // PUT: Update an existing user
  {
    url: '/api/users/:id',
    method: 'put',
    timeout: 1000,
    response: ({ body, headers, query }: { body: any; headers: ApiHeaders; query: { id: string } }) => {
      if (validateToken(headers.authorization)) {
        const userId = parseInt(query.id, 10);
        const userIndex = users.findIndex((user) => Number(user.id) === userId);

        if (userIndex === -1) {
          return generateResponse({ message: 'User not found' }, 404);
        }

        users[userIndex] = { ...users[userIndex], ...body };
        return generateResponse(users[userIndex]);
      }
      return getUnAuthorizedResponse();
    },
  },

  // DELETE: Delete a user
  {
    url: '/api/users/:id',
    method: 'delete',
    timeout: 1000,
    response: ({ headers, params }: { headers: ApiHeaders; params: { id: string } }) => {
      if (validateToken(headers.authorization)) {
        const userId = Number(params.id); // Convert `id` to a number
        if (isNaN(userId)) {
          return generateResponse({ message: 'Invalid user ID' }, 400); // Handle invalid ID
        }
  
        users = users.filter((user) => Number(user.id) !== userId); // Ensure both are numbers
        return generateResponse({ message: 'User deleted successfully' });
      }
      return getUnAuthorizedResponse();
    },
  },


];

export default mock;