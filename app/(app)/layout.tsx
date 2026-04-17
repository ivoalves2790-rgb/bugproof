import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { TopBar } from "@/components/layout/TopBar";
import { ToastProvider } from "@/components/ui/Toast";
import { PremiumProvider } from "@/lib/hooks/use-premium";
import { LanguageProvider } from "@/lib/i18n/use-language";
import { GlobalMotivationBanner } from "@/components/motivation/GlobalMotivationBanner";
import { SkipToContent } from "@/components/layout/SkipToContent";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
    <PremiumProvider>
      <ToastProvider>
        <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-background">
          {/* Skip to content link for accessibility */}
          <SkipToContent />
          <Sidebar />
          <TopBar hearts={3} streak={0} xp={0} />
          <main id="main-content" className="w-full pb-20 pt-14 md:pb-0 md:pl-56" role="main">
            <div className="mx-auto w-full max-w-4xl px-4 py-4 md:px-6 md:py-6">
              <GlobalMotivationBanner />
              {children}
            </div>
          </main>
          <BottomNav />
        </div>
      </ToastProvider>
    </PremiumProvider>
    </LanguageProvider>
  );
}
