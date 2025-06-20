// src/components/AuthButton.tsx
'use client';

import { signIn, signOut, useSession } from "next-auth/react";
import { FC } from "react";

const AuthButton: FC = () => {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

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

  return (
    <div className="flex items-center space-x-4">
      <img
        src={session.user?.image || ""}
        alt="User avatar"
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