import NextAuth, { type AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn() {
      return true; // permite el login
    },

    async jwt({ token, user, account, profile }) {
      /*      console.log("🟡 [jwt callback]");
      console.log({ token, user, account, profile }); */

      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },

    async session({ session, token }) {
      /*       console.log("🔵 [session callback]");
      console.log({ session, token }); */

      // Añade datos al session.user
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.name = token.name as string;

      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
