"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useT } from "@/lib/i18n/use-language";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();
  const t = useT();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
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
          <span className="text-terminal-green">{">"}</span> {t("login.title")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("login.subtitle")}
        </p>
      </div>

      <Button
        variant="secondary"
        className="w-full"
        onClick={handleGoogleLogin}
      >
        {t("login.google")}
      </Button>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">{t("login.or")}</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">
            {t("login.email")}
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
            {t("login.password")}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-foreground outline-none focus:border-terminal-green"
            placeholder="********"
            required
          />
        </div>

        {error && (
          <p className="text-sm text-terminal-red">{error}</p>
        )}

        <Button type="submit" className="w-full" loading={loading}>
          {t("login.submit")}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {t("login.newHere")}{" "}
        <Link href="/signup" className="text-terminal-green hover:underline">
          {t("login.createAccount")}
        </Link>
      </p>
    </div>
  );
}
