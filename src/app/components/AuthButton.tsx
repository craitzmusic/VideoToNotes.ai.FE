// src/components/AuthButton.tsx
'use client';

import { signIn, signOut, useSession } from "next-auth/react";
import { FC } from "react";
import Image from "next/image";

// AuthButton component: handles user authentication UI (sign in/out)
// Shows a sign-in button if the user is not authenticated,
// or the user's avatar, name, and a sign-out button if authenticated.
const AuthButton: FC = () => {
  // useSession provides session data and authentication status
  const { data: session, status } = useSession();

  // While authentication status is loading, render nothing
  if (status === "loading") return null;

  // If user is not authenticated, show the sign-in button
  if (!session) {
    return (
      <button
        onClick={() => signIn("google", { redirect: false })}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Sign in with Google
      </button>
    );
  }

  // If user is authenticated, show avatar, name, and sign-out button
  return (
    <div className="flex items-center space-x-4">
      <Image
        src={session.user?.image || "/default-avatar.png"}
        alt="User avatar"
        width={32}
        height={32}
        className="w-8 h-8 rounded-full"
      />
      <span className="text-sm text-gray-800">{session.user?.name}</span>
      <button
        onClick={() => signOut()}
        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm"
      >
        Sign out
      </button>
    </div>
  );
};

export default AuthButton;