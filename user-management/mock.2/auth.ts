import { MockMethod } from 'vite-plugin-mock';
import { generateResponse, generateToken, getServerError } from './mock.util';

const mock: MockMethod[] = [
  {
    url: '/api/login',
    method: 'post',
    timeout: 2000,
    rawResponse: async (req, res) => {
      try {
        let body = '';
        await new Promise((resolve) => {
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', resolve);
        });

        const { email, password } = JSON.parse(body) as { email: string; password: string };

        // Check credentials
        if (email === 'academy@gmail.com' && password === 'academy123') {
          const expiresIn = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365; // 1 year
          const accessToken = generateToken({ email, password, expiresIn });
          console.log('Mock server response:', { expiresIn, accessToken });

          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200; // Success
          return res.end(JSON.stringify({ expiresIn, accessToken }));
        }

        // Invalid credentials
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 401; // Unauthorized
        return res.end(JSON.stringify({ message: 'Invalid Credentials!' }));
      } catch (error) {
        console.error('Error in mock server:', error);
        return getServerError(res);
      }
    },
  },
];

export default mock;