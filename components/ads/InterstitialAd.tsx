"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useT } from "@/lib/i18n/use-language";

interface InterstitialAdProps {
  onClose: () => void;
}

export function InterstitialAd({ onClose }: InterstitialAdProps) {
  const t = useT();
  const [countdown, setCountdown] = useState(5);
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanClose(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Try to load AdSense ad
  useEffect(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {
      // AdSense not loaded (ad blocker or not configured)
      setCanClose(true);
    }
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm"
      >
        {/* Ad container */}
        <div className="w-full max-w-md px-4">
          <div className="mb-4 text-center text-[10px] uppercase tracking-wider text-muted-foreground">
            {t("ad.advertisement")}
          </div>

          {/* AdSense slot */}
          <div className="flex min-h-[250px] items-center justify-center rounded-lg border border-border bg-surface">
            <ins
              className="adsbygoogle"
              style={{ display: "block", width: "100%", height: "250px" }}
              data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-XXXXXXXXXXXXXXXX"}
              data-ad-slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID || "XXXXXXXXXX"}
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </div>

          {/* Countdown / Continue */}
          <div className="mt-6 flex flex-col items-center gap-3">
            {canClose ? (
              <button
                onClick={onClose}
                className="w-full rounded-lg bg-terminal-green px-6 py-3 font-mono font-bold text-background text-sm transition-all hover:brightness-110"
              >
                {t("ad.continue")}
              </button>
            ) : (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-xs font-bold">
                  {countdown}
                </div>
                <span>{t("ad.seconds")}</span>
              </div>
            )}

            <Link
              href="/upgrade"
              className="text-[10px] text-terminal-green hover:underline"
            >
              {t("ad.removAds")} &rarr;
            </Link>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
