"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          <span className="text-terminal-green">{">"}</span> Settings
        </h1>
      </div>

      <div className="space-y-4">
        <Card>
          <h3 className="font-semibold">Account</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your account settings and preferences.
          </p>
          <div className="mt-4">
            <Button variant="danger" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold">App Info</h3>
          <div className="mt-2 space-y-1 text-sm text-muted-foreground">
            <p>
              <span className="text-terminal-amber">version:</span> 1.0.0
            </p>
            <p>
              <span className="text-terminal-amber">build:</span> Next.js PWA
            </p>
            <p>
              <span className="text-terminal-amber">offline:</span> supported
            </p>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold">Install App</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            VibeCode is a Progressive Web App. You can install it on your device
            for the best experience.
          </p>
          <div className="mt-3 rounded-lg bg-surface-2 p-3 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">How to install:</p>
            <ul className="mt-1 space-y-1">
              <li>
                <span className="text-terminal-green">iOS:</span> Tap the share
                button, then &quot;Add to Home Screen&quot;
              </li>
              <li>
                <span className="text-terminal-green">Android:</span> Tap the
                menu, then &quot;Install app&quot;
              </li>
              <li>
                <span className="text-terminal-green">Desktop:</span> Click the
                install icon in the address bar
              </li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
