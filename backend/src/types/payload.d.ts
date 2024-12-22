import type { PayloadRequest } from 'payload/types';

// Extend the default Payload User type to include a `role` property
declare module 'payload/types' {
  
  export interface User {
    role?: 'admin' | 'user';
  }



  // Backlink interface definition
  export interface Backlink {
    domain: string;
    RD: number;   // Referring Domains
    TF: number;   // Trust Flow
    CF: number;   // Citation Flow
    price: number;
    source: 'paper_club' | 'press_whizz' | 'bulldoz';
    dateFetched: string;
  }
}
