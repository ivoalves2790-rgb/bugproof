"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";

interface PremiumContextValue {
  isPremium: boolean;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

const PremiumContext = createContext<PremiumContextValue>({
  isPremium: false,
  isLoading: true,
  refresh: async () => {},
});

export function PremiumProvider({ children }: { children: ReactNode }) {
  const [isPremium, setIsPremium] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("bugproof:isPremium") === "true";
  });
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setIsPremium(false);
      setIsLoading(false);
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("is_premium")
      .eq("id", user.id)
      .single();

    const premium = data?.is_premium ?? false;
    setIsPremium(premium);
    localStorage.setItem("bugproof:isPremium", String(premium));
    setIsLoading(false);

    // Manage service worker based on premium status
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      if (premium) {
        navigator.serviceWorker.register("/sw.js").catch(() => {});
      } else {
        navigator.serviceWorker.getRegistrations().then((regs) => {
          regs.forEach((r) => r.unregister());
        });
      }
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <PremiumContext.Provider value={{ isPremium, isLoading, refresh }}>
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium() {
  return useContext(PremiumContext);
}
