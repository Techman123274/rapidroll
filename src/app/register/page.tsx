"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Registration failed");
      setLoading(false);
      return;
    }

    const signInRes = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (signInRes?.error) {
      setError("Account created. Please log in.");
      return;
    }

    router.push("/play");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070707] p-4">
      <div className="w-full max-w-md rounded-2xl border border-[#1a1a1a] bg-[#121212] p-8">
        <h1 className="mb-6 text-2xl font-bold text-white">Sign Up</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-danger/20 p-3 text-sm text-danger">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm text-gray-400">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              pattern="[a-zA-Z0-9_-]+"
              className="w-full rounded-lg border border-[#333] bg-[#0a0a0a] px-4 py-2 text-white outline-none focus:border-primary"
            />
            <p className="mt-1 text-xs text-gray-500">
              Letters, numbers, underscore, hyphen only
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm text-gray-400">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-[#333] bg-[#0a0a0a] px-4 py-2 text-white outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-gray-400">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-lg border border-[#333] bg-[#0a0a0a] px-4 py-2 text-white outline-none focus:border-primary"
            />
            <p className="mt-1 text-xs text-gray-500">At least 6 characters</p>
          </div>

          <div>
            <label className="mb-1 block text-sm text-gray-400">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-[#333] bg-[#0a0a0a] px-4 py-2 text-white outline-none focus:border-primary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-primary py-3 font-bold text-black disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
