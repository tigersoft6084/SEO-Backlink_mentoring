import { Payload } from 'payload';
import { AuthResponse, AuthenticateUrl } from '../types/auth.d';
import { getFetchAuthOptions } from './fetchAuthOptions';
import { getValidCookies } from './cookieUtils';
import { config } from '../config/apiConfig';

export async function authenticateAndSave(
  payload: Payload,
  email: string,
  password: string,
  urls: string[]
) {
  let updatedData: { authenticateUrls: AuthenticateUrl[] } = { authenticateUrls: [] };

  try {
    for (const url of urls) {
      console.log(`Authenticating ${email} and ${password} at URL: ${url}`);
      const fetchOptions = getFetchAuthOptions(url, email, password);

      const response = await fetch(url, {
        ...fetchOptions,
        redirect: 'manual',
      });

      console.log('Response Status:', response.status);

      if (!response.ok && response.status !== 302) {
        console.error(`Request failed with status ${response.status} for URL: ${url}`);
        console.error('Response body:', await response.text());
        continue;
      }

      const contentType = response.headers.get('Content-Type') || '';
      const isJsonResponse = contentType.includes('application/json');

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + config.token.expirationDays);

      if (isJsonResponse) {
        const responseData: unknown = await response.json();

        if (typeof responseData === 'object' && responseData !== null && ('token' in responseData || 'cookie' in responseData)) {

            const data: AuthResponse = responseData as AuthResponse;

            if (data.token) {
                

                updatedData.authenticateUrls.push({
                url,
                token: data.token,
                expiresAt: expiresAt.toISOString(),
                });

                console.log(`Successfully authenticated ${url} with token for ${email}`);
            }

            if (data.cookie) {
                updatedData.authenticateUrls.push({
                url,
                cookie: data.cookie,
                expiresAt: expiresAt.toISOString(),
                });

                console.log(`Successfully authenticated ${url} with cookie for ${email}`);
            }
        } else {
          console.error(`Invalid response from ${url}:`, responseData);
          throw new Error('No token or cookie received or invalid response format.');
        }
      } else {
        const setCookieHeader = response.headers.get('set-cookie');
        if (setCookieHeader) {
          const cookies = getValidCookies([setCookieHeader]);
          updatedData.authenticateUrls.push({
            url,
            cookie: JSON.stringify(cookies),
            expiresAt: expiresAt.toISOString(),
          });

          console.log(`Successfully authenticated ${url} with cookies for ${email}`);
        } else {
          console.error(`No cookie received from ${url}.`);
        }
      }
    }
  } catch (error) {
    console.error('Error during authentication:', error);
    throw error;
  }

  return updatedData;
}
