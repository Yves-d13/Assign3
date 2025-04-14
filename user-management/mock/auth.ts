import { MockMethod } from 'vite-plugin-mock';
import { generateResponse, generateToken } from './mock.util';

const mock: MockMethod[] = [
  {
    url: '/api/login',
    method: 'post',
    timeout: 2000,
    response: (req) => {
      const { email, password } = req.body; // Extract email and password from the request body
      const validEmail = 'academy@gmail.com';
      const validPassword = 'academy123';

      if (email === validEmail && password === validPassword) {
        const expiresIn = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365;
        const accessToken = generateToken({ email, password, expiresIn });
        return generateResponse({ expiresIn, accessToken });
      } else {
        return {
          code: 401,
          message: 'Invalid email or password.',
        };
      }
    },
  },
] as MockMethod[];

export default mock;