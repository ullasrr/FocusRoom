'use client';

import { signIn,signOut } from 'next-auth/react';
import { useState } from 'react';

export default function SignInPage() {
  const [email, setEmail] = useState("");



  const handleGoogle = async () => {
  const res = await signIn('google', { callbackUrl: '/dashboard', redirect: false });
  console.log(res); // See what is returned
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Welcome to StudyWithMe 🚀</h1>

        <button
          onClick={handleGoogle}
          className="w-full py-2 px-4 rounded bg-red-500 hover:bg-red-600 text-white font-semibold shadow"
        >
          Sign in with Google
        </button>

        <button
         onClick={() => signOut({ callbackUrl: '/' })}
 >
          Signout
        </button>

        
      </div>
    </div>
  );
}
