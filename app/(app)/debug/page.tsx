"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DebugPage() {
  const [info, setInfo] = useState<string[]>([]);
  const router = useRouter();

  const log = (msg: string) => setInfo((prev) => [...prev, msg]);

  useEffect(() => {
    async function run() {
      log("=== Bugproof Debug v2 ===");
      log(`Standalone PWA: ${window.matchMedia("(display-mode: standalone)").matches}`);
      log(`Service Workers: ${(await navigator.serviceWorker?.getRegistrations())?.length ?? "N/A"}`);

      // Test 1: Normal fetch
      log("--- Test 1: Normal fetch ---");
      try {
        const res = await fetch("/assessment/results");
        log(`Normal fetch: ${res.status} (redirected: ${res.redirected})`);
      } catch (e) {
        log(`Normal fetch FAILED: ${e}`);
      }

      // Test 2: RSC fetch (what router.push uses)
      log("--- Test 2: RSC fetch ---");
      try {
        const res = await fetch("/assessment/results", {
          headers: {
            RSC: "1",
            "Next-Router-State-Tree": encodeURIComponent(JSON.stringify([
              "", { children: ["(app)", { children: ["assessment", { children: ["results", { children: ["__PAGE__", {}] }] }] }] }
            ])),
          },
        });
        log(`RSC fetch: ${res.status} (redirected: ${res.redirected})`);
        const text = await res.text();
        log(`RSC response: ${text.length} chars`);
        if (text.length < 200) {
          log(`RSC body: ${text}`);
        }
      } catch (e) {
        log(`RSC fetch FAILED: ${e}`);
      }

      // Test 3: Direct navigation test
      log("--- Test 3: window.location test ---");
      log("Will navigate in 3 seconds...");
      log("If you see the results page (or login), navigation works.");
      log("If you see 'page couldn't load', that's the bug.");
      log("=== Screenshot NOW, then wait ===");
    }
    run();
  }, []);

  function handleTestNav() {
    const mockAnswers = [
      { questionId: "a-git-1", selectedAnswer: "b", correct: true },
      { questionId: "a-debug-1", selectedAnswer: "c", correct: true },
    ];
    const encoded = btoa(JSON.stringify(mockAnswers));
    sessionStorage.setItem("assessmentAnswers", JSON.stringify(mockAnswers));
    window.location.href = "/assessment/results#" + encoded;
  }

  function handleTestRouterPush() {
    sessionStorage.setItem(
      "assessmentAnswers",
      JSON.stringify([
        { questionId: "a-git-1", selectedAnswer: "b", correct: true },
        { questionId: "a-debug-1", selectedAnswer: "c", correct: true },
      ])
    );
    router.push("/assessment/results");
  }

  return (
    <div className="mx-auto max-w-lg p-4">
      <h1 className="text-lg font-bold text-terminal-green mb-4">Debug Info</h1>
      <pre className="rounded bg-surface-2 p-3 text-xs text-muted-foreground whitespace-pre-wrap leading-5 mb-4">
        {info.join("\n")}
      </pre>
      <div className="space-y-2">
        <button
          onClick={handleTestNav}
          className="w-full rounded bg-terminal-green px-4 py-3 text-sm font-bold text-background"
        >
          Test A: window.location.href (my fix)
        </button>
        <button
          onClick={handleTestRouterPush}
          className="w-full rounded bg-terminal-amber px-4 py-3 text-sm font-bold text-background"
        >
          Test B: router.push (original code)
        </button>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Tap each button and report which one works / fails.
      </p>
    </div>
  );
}
