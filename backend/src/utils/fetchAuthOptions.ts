import { FetchOptions } from '../types/auth.d';

export function getFetchAuthOptions(url: string, email: string, password: string): FetchOptions {
  if (url === 'https://en.ereferer.com/login_check') {
    const formData = new URLSearchParams();
    formData.append('login_form[_username]', email);
    formData.append('login_form[_password]', password);
    formData.append('_submit', 'Log in');

    return {
      method: 'POST',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'max-age=0',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': 'https://en.ereferer.com/login',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
        'Cookie': '_locale=en',
      },
      body: formData,
    };
  }

  if (url === 'https://app.paper.club/api/authenticate') {
    return {
      method: 'POST',
      headers: {
        'Accept': 'application/ld+json',
        'Accept-Language': 'en',
        'Content-Type': 'application/ld+json',
        'Priority': 'u=1, i',
        'Sec-CH-UA': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
        'Sec-CH-UA-Mobile': '?0',
        'Sec-CH-UA-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'X-Powered-By': 'PaperClub',
        'X-Requested-With': 'PaperClub',
        'Cookie': '_gcl_au=1.1.316702908.1734720857; intercom-device-id-u27t7v5h=96957ba0-3765-4e08-b2a1-5fd683725134',
        'Referer': 'https://app.paper.club/',
      },
      body: JSON.stringify({ email, password }),
    };
  }

  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  };
}
