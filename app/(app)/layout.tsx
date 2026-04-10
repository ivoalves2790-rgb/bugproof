import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { TopBar } from "@/components/layout/TopBar";
import { ToastProvider } from "@/components/ui/Toast";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // TODO: Fetch real user stats from Supabase once connected
  const hearts = 3;
  const streak = 0;
  const xp = 0;

  return (
    <ToastProvider>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <TopBar hearts={hearts} streak={streak} xp={xp} />
        <main className="pb-20 pt-14 md:pb-0 md:pl-56">
          <div className="mx-auto max-w-4xl p-4 md:p-6">{children}</div>
        </main>
        <BottomNav />
      </div>
    </ToastProvider>
  );
}
