import type { PayloadRequest } from 'payload/types';

// Extend the default Payload User type to include a `role` property
declare module 'payload/types' {
  export interface User {
    role?: 'admin' | 'user';
  }
}
