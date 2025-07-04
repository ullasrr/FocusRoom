// ✅ /src/types/next-auth.d.ts

import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      plan?: string;
      provider?: string;
    };
  }

  interface User {
    plan?: string;
    provider?: string;
  }

  interface JWT {
    plan?: string;
    provider?: string;
  }
}

export {}; // ✅ Required!
