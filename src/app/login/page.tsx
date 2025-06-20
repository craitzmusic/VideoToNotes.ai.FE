"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Spinner from "../components/Spinner";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google");
      // Normalmente aqui o next-auth redireciona automaticamente,
      // então não precisa setar isLoading=false, mas caso não redirecione:
      // setIsLoading(false);
    } catch (error) {
      console.error("Error during sign in:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign in</h1>

        <button
          onClick={handleSignIn}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded flex justify-center items-center disabled:opacity-50"
        >
          {isLoading ? <Spinner /> : "Sign in with Google"}
        </button>
      </div>
    </div>
  );
}