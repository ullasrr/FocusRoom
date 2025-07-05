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
    token.provider = account?.provider || dbUser?.provider || "google";

    if (dbUser && !dbUser.provider && token.provider) {
      await db.collection("users").updateOne(
        { email: token.email },
        { $set: { provider: token.provider, plan: token.plan} }
      );
    }

    // console.log("🔐 JWT CALLBACK", { token }); // 🔍 debug

    return token;
  },

  async session({ session, token }) {
  if (session.user) {
    session.user.plan = token.plan as string;
    session.user.provider = token.provider as string;

    // Send session user to Express backend
    try {
      await fetch("http://localhost:3001/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
          provider: session.user.provider,
          plan: session.user.plan,
        }),
      });
    } catch (error) {
      console.error("Failed to sync user with Express backend:", error);
    }
  }

  return session;
}

  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
