export interface AuthResponse {
    token?: string;
    cookie?: string;
    message?: string;
  }
  
  export interface AuthenticateUrl {
    url: string;
    token?: string;
    cookie?: string;
    expiresAt?: string;
  }
  
  export interface FetchOptions {
    headers: Record<string, string>;
    body: any;
    method: 'POST';
  }
  