import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Extend the Session interface to include accessToken
declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",  // Ensure this is set in your .env file
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",  // Ensure this is set in your .env file
    }),
  ],
  pages: {
    error: '/auth/error',  // Redirect here for any authentication errors
    signIn: '/auth/signin',  // Customize the sign-in page URL if needed
  },
  session: {
    strategy: "jwt",  // Use JWT for session management (instead of database sessions)
  },
  callbacks: {
    async jwt({ token, account }) {
      // When the account (Google OAuth) is available, store the access token in the JWT
      if (account && account.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // When the session is accessed, ensure the access token is available
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
});
