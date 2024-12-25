interface DataForCreate_CredentialsForMarketplaces {
  email: string;
  password: string;
  secretKey?: string;
  websiteTarget?: [];
}

interface DataForFetch_CredentialsForMarketplaces {
  email: string;
  password: string;
  secretKey: string;
  websiteTarget: Array<{ value: string; id: string }>; // Assuming websiteTarget is an array of strings
}

interface UserCredential {
  email: string;
  password: string | null; // Password can be null if not decryptable
  websiteTarget: Array<{ value: string; id: string }>; // Adding the websiteTarget field
}

interface AuthResponse_Link_Builders {
  token: string;
}

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
