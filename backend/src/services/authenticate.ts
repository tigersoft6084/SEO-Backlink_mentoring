import fetch from 'node-fetch';
import { Payload } from 'payload';
import { config } from '../config/apiConfig';

interface AuthResponse {
  token?: string;
  message?: string;
}

export async function authenticateAndSave(
  payload: Payload,
  email: string,
  password: string,
  urls: string[]
) {
  try {
    for (const url of urls) {
      console.log(`Authenticating ${email} at URL: ${url}`);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        console.error(`Request failed with status ${response.status} for URL: ${url}`);
        continue; // Skip this URL
      }

      const responseData: unknown = await response.json();
      console.log('Full API Response:', responseData);

      // Safe type validation
      if (
        typeof responseData === 'object' &&
        responseData !== null &&
        'token' in responseData &&
        typeof (responseData as { token: unknown }).token === 'string'
      ) {
        const data: AuthResponse = responseData as AuthResponse;

        console.log('Received Token:', data.token);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + config.token.expirationDays);

        // Update the credential with token details
        await payload.update({
          collection: 'credentials',
          where: { email: { equals: email } },
          data: {
            authenticateUrls: [
              { url, token: data.token, expiresAt: expiresAt.toISOString() },
            ],
          },
        });

        console.log(`Successfully authenticated ${url} for ${email}`);
      } else {
        console.error(`Invalid response from ${url}:`, responseData);
        throw new Error('No token received or invalid response format.');
      }
    }
  } catch (error) {
    console.error('Error during authentication:', error);
    throw error;
  }
}
