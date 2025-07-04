'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function SignInPage() {
  const [email, setEmail] = useState("");

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn("email", { email, callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Welcome to StudyWithMe 🚀</h1>

        <button
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          className="w-full py-2 px-4 rounded bg-red-500 hover:bg-red-600 text-white font-semibold shadow"
        >
          Sign in with Google
        </button>

        <div className="text-gray-400">or use email</div>

        <form onSubmit={handleMagicLink} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <button
            type="submit"
            className="w-full py-2 px-4 rounded bg-green-500 hover:bg-green-600 text-white font-semibold shadow"
          >
            Send Magic Link
          </button>
        </form>
      </div>
    </div>
  );
}
