// types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  interface Session {
    idToken?: string; // Add the idToken property to the session
  }
}
