"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: displayName },
        emailRedirectTo: `${window.location.origin}/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/assessment");
      router.refresh();
    }
  }

  async function handleGitHubLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: `${window.location.origin}/callback` },
    });
  }

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/callback` },
    });
  }

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold">
          <span className="text-terminal-green">{">"}</span> Sign up
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Start your engineering journey
        </p>
      </div>

      <div className="space-y-3">
        <Button
          variant="secondary"
          className="w-full"
          onClick={handleGitHubLogin}
        >
          Continue with GitHub
        </Button>
        <Button
          variant="secondary"
          className="w-full"
          onClick={handleGoogleLogin}
        >
          Continue with Google
        </Button>
      </div>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">
            Display Name
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-foreground outline-none focus:border-terminal-green"
            placeholder="Your name"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-foreground outline-none focus:border-terminal-green"
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-foreground outline-none focus:border-terminal-green"
            placeholder="Min 6 characters"
            minLength={6}
            required
          />
        </div>

        {error && (
          <p className="text-sm text-terminal-red">{error}</p>
        )}

        <Button type="submit" className="w-full" loading={loading}>
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-terminal-green hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
