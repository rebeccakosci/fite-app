"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    // TEMP: fake signup
    console.log("Signup:", email, password);

    // Later we connect real auth (Supabase/Firebase)

    router.push("/checkout");
  };

  return (
    <main className="min-h-screen bg-[#F7F4EF] flex flex-col items-center justify-center p-6">

      <div className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-sm">

        <h1 className="text-3xl font-serif text-center mb-2">
          Create Your Profile
        </h1>

        <p className="text-sm text-gray-500 text-center mb-6">
          Save your nail sizes and order anytime.
        </p>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-xl border border-[#E5D6CF] focus:outline-none"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-3 rounded-xl border border-[#E5D6CF] focus:outline-none"
        />

        <button
          onClick={handleSignup}
          className="w-full py-3 rounded-full bg-[#C8B1A6] text-white"
        >
          Create Account
        </button>

        <p className="text-xs text-gray-400 text-center mt-4">
          By continuing you agree to our Terms.
        </p>

      </div>

    </main>
  );
}