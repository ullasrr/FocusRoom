import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "./mongodb";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST!,
        port: Number(process.env.EMAIL_SERVER_PORT!),
        auth: {
          user: process.env.EMAIL_SERVER_USER!,
          pass: process.env.EMAIL_SERVER_PASS!,
        },
      },
      from: process.env.EMAIL_FROM!,
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) token.email = user.email;

      const db = (await clientPromise).db();
      const dbUser = await db.collection("users").findOne({ email: token.email });

      token.plan = dbUser?.plan || "free";
      token.provider = dbUser?.provider || account?.provider || "email";

      // Store provider if missing
      if (dbUser && !dbUser.provider) {
        await db.collection("users").updateOne(
          { email: token.email },
          { $set: { provider: token.provider } }
        );
      }

      return token;
    },
    async session({ session, token }) {
      session.user.plan = token.plan as string;
      session.user.provider = token.provider as string;
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
