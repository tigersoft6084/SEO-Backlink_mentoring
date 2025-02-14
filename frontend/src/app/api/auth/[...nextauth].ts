// // pages/api/auth/[...nextauth].ts

// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import { Session } from "next-auth"; // Import types
// import { JWT } from "next-auth/jwt"; // Import JWT type
// import { NextApiRequest, NextApiResponse } from "next"; // Import types for req and res

// // Define the AuthOptions with correct types
// export const authOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
//       clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || '',
//     }),
//   ],
//   session: {
//     strategy: "jwt" as const, // Ensure this is a valid "jwt" strategy type
//   },
//   callbacks: {
//     // Type the session and token parameters explicitly
//     async session({ session, token }: { session: Session; token: JWT }) {
//       if (session.user) {
//         session.user.id = token.sub as string; // Ensure the session has the `id` field
//       }
//       return session;
//     },
//   },
// };

// // Assign the function to a variable before exporting it (fixes ESLint rule)
// const handler = (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, authOptions);

// // Export the handler
// export default handler;
