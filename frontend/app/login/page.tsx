"use client";

import { useState } from "react";
import Link from "next/link";

import { login, register } from "@/lib/api";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">(
    "login",
  );

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const data =
        mode === "login"
          ? await login(username, password)
          : await register(username, password);

      localStorage.setItem(
        "oracle_access_token",
        data.access,
      );

      localStorage.setItem(
        "oracle_refresh_token",
        data.refresh,
      );

      localStorage.setItem(
        "oracle_username",
        data.user.username,
      );

      window.location.href = "/events";
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-md items-center px-6">
        <div className="w-full">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight"
          >
            The Oracle
          </Link>

          <div className="mt-12">
            <h1 className="text-3xl font-bold">
              {mode === "login"
                ? "Welcome back"
                : "Create your account"}
            </h1>

            <p className="mt-3 text-slate-500">
              {mode === "login"
                ? "Continue making better forecasts."
                : "Start building your forecasting record."}
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
            <div>
              <label className="text-sm text-slate-400">
                Username
              </label>

              <input
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value)
                }
                required
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 outline-none transition focus:border-white/30"
              />
            </div>

            <div>
              <label className="text-sm text-slate-400">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                required
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 outline-none transition focus:border-white/30"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-white py-3.5 font-semibold text-slate-950 disabled:opacity-50"
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                  ? "Sign in"
                  : "Create account"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setMode(
                mode === "login"
                  ? "register"
                  : "login",
              );
              setError("");
            }}
            className="mt-6 text-sm text-slate-500 transition hover:text-white"
          >
            {mode === "login"
              ? "Don't have an account? Create one"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </main>
  );
}