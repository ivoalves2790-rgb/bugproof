"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Typewriter } from "@/components/motion/Typewriter";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="max-w-2xl text-center">
        {/* Logo */}
        <div className="mb-8">
          <motion.img
            src="/icons/icon-192.svg"
            alt="Bugproof mascot"
            width={80}
            height={80}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
            className="mx-auto mb-4 rounded-xl"
          />
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="text-5xl font-bold tracking-tight"
          >
            <span className="text-foreground">bug</span>
            <span className="text-terminal-green">proof</span>
          </motion.h1>
          <div className="mt-2 font-mono text-sm text-muted-foreground">
            <span className="text-terminal-green">$</span>{" "}
            <Typewriter
              text="learn software engineering the right way"
              speed={26}
              delay={500}
              showCursor
            />
          </div>
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.5 }}
          className="mb-8 text-lg text-muted-foreground"
        >
          You build with AI. Now learn the engineering behind it.
          <br />
          Interactive lessons in git, debugging, security, architecture, and
          more.
        </motion.p>

        {/* Features */}
        <div className="mb-10 grid grid-cols-2 gap-4 text-left text-sm md:grid-cols-4">
          {[
            { label: "10 Courses", sub: "Full curriculum" },
            { label: "4 Exercise Types", sub: "Bug hunts, swipe & more" },
            { label: "300+ Lessons", sub: "2-5 min each" },
            { label: "Works Offline", sub: "Learn anywhere" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.4 + i * 0.08, duration: 0.4 }}
              className="rounded-lg border border-border bg-surface p-3"
            >
              <div className="font-semibold text-terminal-green">
                {item.label}
              </div>
              <div className="text-xs text-muted-foreground">{item.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.8, duration: 0.4 }}
          className="flex flex-col items-center gap-4"
        >
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-lg bg-terminal-green px-8 py-3 font-mono font-bold text-background transition-all hover:bg-terminal-green-dim glow-green breathe"
          >
            Start Learning
          </Link>
          <Link
            href="/login"
            className="text-sm text-muted-foreground hover:text-terminal-green"
          >
            Already have an account? Log in
          </Link>
        </motion.div>

        {/* Terminal decoration */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.1, duration: 0.5 }}
          className="mt-16 rounded-lg border border-border bg-surface p-4 text-left text-xs"
        >
          <div className="mb-2 flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-terminal-red/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-terminal-amber/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-terminal-green/60" />
          </div>
          <div className="text-muted-foreground">
            <span className="text-terminal-green">$</span>{" "}
            <Typewriter text="bugproof --status" speed={22} delay={3300} />
            <br />
            <TerminalLine
              label="courses:"
              value="10 loaded"
              delay={3900}
            />
            <TerminalLine
              label="lessons:"
              value="300+ available"
              delay={4300}
            />
            <TerminalLine label="mode:" value="interactive" delay={4700} />
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 5.1, duration: 0.25 }}
              className="text-terminal-green"
            >
              ready to learn
              <span className="cursor-blink">_</span>
            </motion.span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function TerminalLine({
  label,
  value,
  delay,
}: {
  label: string;
  value: string;
  delay: number;
}) {
  return (
    <>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay / 1000, duration: 0.2 }}
        className="text-terminal-amber"
      >
        {label}
      </motion.span>{" "}
      <Typewriter text={value} speed={20} delay={delay + 150} />
      <br />
    </>
  );
}
