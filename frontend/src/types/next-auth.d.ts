// types/next-auth.d.ts
import "next-auth";
declare module "next-auth" {
  interface Session {
    user: User;
  }

  interface User extends NextAuthUser {
    id?: string; // Add 'id' to the user
  }
}