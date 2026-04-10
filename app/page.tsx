import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="max-w-2xl text-center">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold tracking-tight">
            <span className="text-terminal-green glow-green">{">"}</span>
            <span className="text-foreground">vibe</span>
            <span className="text-terminal-green">code</span>
          </h1>
          <div className="mt-2 font-mono text-sm text-muted-foreground">
            <span className="text-terminal-green">$</span> learn software
            engineering the fun way
            <span className="cursor-blink text-terminal-green">_</span>
          </div>
        </div>

        {/* Tagline */}
        <p className="mb-8 text-lg text-muted-foreground">
          You build with AI. Now learn the engineering behind it.
          <br />
          Interactive lessons in git, debugging, security, architecture, and
          more.
        </p>

        {/* Features */}
        <div className="mb-10 grid grid-cols-2 gap-4 text-left text-sm md:grid-cols-4">
          {[
            { label: "10 Courses", sub: "Full curriculum" },
            { label: "4 Exercise Types", sub: "Bug hunts, swipe & more" },
            { label: "300+ Lessons", sub: "2-5 min each" },
            { label: "Works Offline", sub: "Learn anywhere" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-border bg-surface p-3"
            >
              <div className="font-semibold text-terminal-green">
                {item.label}
              </div>
              <div className="text-xs text-muted-foreground">{item.sub}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-4">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-lg bg-terminal-green px-8 py-3 font-mono font-bold text-background transition-all hover:bg-terminal-green-dim glow-green"
          >
            Start Learning
          </Link>
          <Link
            href="/login"
            className="text-sm text-muted-foreground hover:text-terminal-green"
          >
            Already have an account? Log in
          </Link>
        </div>

        {/* Terminal decoration */}
        <div className="mt-16 rounded-lg border border-border bg-surface p-4 text-left text-xs">
          <div className="mb-2 flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-terminal-red/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-terminal-amber/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-terminal-green/60" />
          </div>
          <div className="text-muted-foreground">
            <span className="text-terminal-green">$</span> vibecode --status
            <br />
            <span className="text-terminal-amber">courses:</span> 10 loaded
            <br />
            <span className="text-terminal-amber">lessons:</span> 300+
            available
            <br />
            <span className="text-terminal-amber">mode:</span> interactive
            <br />
            <span className="text-terminal-green">ready to learn_</span>
          </div>
        </div>
      </div>
    </div>
  );
}
