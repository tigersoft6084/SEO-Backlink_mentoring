import * as cookie from 'cookie';

export function getValidCookies(setCookieHeaders: string[]): Record<string, string> {
  const validCookies: Record<string, string> = {};

  setCookieHeaders.forEach((setCookie) => {
    try {
      const parsedCookie = cookie.parse(setCookie);
      Object.entries(parsedCookie).forEach(([key, value]) => {
        if (value) validCookies[key] = value;
      });
    } catch (error) {
      console.error('Error parsing Set-Cookie header:', error);
    }
  });

  return validCookies;
}
