"use client";

export default function AssessmentResultsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-lg p-6 text-center">
      <h2 className="text-xl font-bold text-terminal-red">Something went wrong</h2>
      <pre className="mt-4 rounded-lg bg-surface-2 p-4 text-left text-xs text-muted-foreground overflow-auto max-h-60">
        {error.message}
        {"\n\n"}
        {error.stack}
      </pre>
      {error.digest && (
        <p className="mt-2 text-xs text-muted-foreground">Digest: {error.digest}</p>
      )}
      <button
        onClick={reset}
        className="mt-4 rounded-lg bg-terminal-green px-4 py-2 text-sm text-background"
      >
        Try again
      </button>
    </div>
  );
}
