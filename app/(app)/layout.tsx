import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { TopBar } from "@/components/layout/TopBar";
import { ToastProvider } from "@/components/ui/Toast";
import { PremiumProvider } from "@/lib/hooks/use-premium";
import { LanguageProvider } from "@/lib/i18n/use-language";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const hearts = 3;
  const streak = 0;
  const xp = 0;

  return (
    <LanguageProvider>
    <PremiumProvider>
      <ToastProvider>
        <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-background">
          <Sidebar />
          <TopBar hearts={hearts} streak={streak} xp={xp} />
          <main className="w-full pb-20 pt-14 md:pb-0 md:pl-56">
            <div className="mx-auto w-full max-w-4xl px-4 py-4 md:px-6 md:py-6">{children}</div>
          </main>
          <BottomNav />
        </div>
      </ToastProvider>
    </PremiumProvider>
    </LanguageProvider>
  );
}
