"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { useT } from "@/lib/i18n/use-language";
import { IconHome, IconBook, IconHammer, IconUser, IconSettings, IconSearch } from "@/components/ui/Icons";

const NAV_ITEMS = [
  { key: "nav.home", href: "/dashboard", icon: "home" },
  { key: "nav.build", href: "/projects", icon: "hammer" },
  { key: "nav.library", href: "/courses", icon: "book" },
  { key: "nav.glossary", href: "/glossary", icon: "search" },
  { key: "nav.profile", href: "/profile", icon: "user" },
];

const iconMap: Record<string, (props: { size?: number }) => React.ReactElement> = {
  home: IconHome,
  hammer: IconHammer,
  book: IconBook,
  search: IconSearch,
  user: IconUser,
};

export function Sidebar() {
  const pathname = usePathname();
  const t = useT();

  return (
    <aside className="hidden md:flex md:w-56 md:flex-col md:fixed md:inset-y-0 border-r border-border bg-surface" role="navigation" aria-label="Main navigation">
      <div className="flex h-14 items-center px-4 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2">
          <img src="/icons/icon-192.svg" alt="Bugproof" width={28} height={28} className="rounded" />
          <span className="text-lg font-bold">bug<span className="text-terminal-green">proof</span></span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-4">
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-terminal-green-bg text-terminal-green"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-2"
              )}
            >
              {Icon && <Icon size={18} />}
              {t(item.key)}
              {isActive && <span className="sr-only">(current page)</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border px-2 py-4">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
            pathname === "/settings"
              ? "bg-terminal-green-bg text-terminal-green"
              : "text-muted-foreground hover:text-foreground hover:bg-surface-2"
          )}
        >
          <IconSettings size={18} />
          {t("nav.settings")}
        </Link>
      </div>
    </aside>
  );
}
