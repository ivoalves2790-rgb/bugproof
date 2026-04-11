"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { NAV_ITEMS } from "@/lib/utils/constants";
import { IconHome, IconBook, IconSearch, IconUser, IconSettings } from "@/components/ui/Icons";

const iconMap: Record<string, (props: { size?: number }) => React.ReactElement> = {
  home: IconHome,
  book: IconBook,
  search: IconSearch,
  user: IconUser,
};

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-56 md:flex-col md:fixed md:inset-y-0 border-r border-border bg-surface">
      {/* Logo */}
      <div className="flex h-14 items-center px-4 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-1">
          <span className="text-xl font-bold text-terminal-green glow-green">{">"}</span>
          <span className="text-lg font-bold">bug</span>
          <span className="text-lg font-bold text-terminal-green">proof</span>
        </Link>
      </div>

      {/* Nav links */}
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
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Settings at bottom */}
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
          Settings
        </Link>
      </div>
    </aside>
  );
}
