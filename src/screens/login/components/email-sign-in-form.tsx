"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/src/lib/auth-client";

export function EmailSignInForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const result =
      mode === "login"
        ? await signIn.email({ email, password, callbackURL: "/" })
        : await signUp.email({ email, password, name, callbackURL: "/" });

    if (result.error) {
      setError(result.error.message ?? "Something went wrong");
      setIsLoading(false);
      return;
    }

    router.push("/");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-stack-sm w-full">
      {mode === "register" && (
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full bg-white/5 border border-white/10 rounded-lg px-gutter py-stack-sm text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary/50 transition-all"
        />
      )}

      <input
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full bg-white/5 border border-white/10 rounded-lg px-gutter py-stack-sm text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary/50 transition-all"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={8}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-gutter py-stack-sm text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary/50 transition-all"
      />

      {error && <p className="text-error font-body-md text-sm">{error}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary text-on-primary font-label-caps text-label-caps py-stack-sm rounded-lg hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
      </button>

      <p className="text-center font-body-md text-on-surface-variant text-sm">
        {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          type="button"
          onClick={() => {
            setMode(mode === "login" ? "register" : "login");
            setError(null);
          }}
          className="text-primary hover:underline"
        >
          {mode === "login" ? "Sign up" : "Sign in"}
        </button>
      </p>
    </form>
  );
}
