"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { NAV_ITEMS } from "@/lib/utils/constants";
import { IconHome, IconBook, IconSearch, IconUser } from "@/components/ui/Icons";

const iconMap: Record<string, (props: { size?: number }) => React.ReactElement> = {
  home: IconHome,
  book: IconBook,
  search: IconSearch,
  user: IconUser,
};

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface safe-bottom md:hidden">
      <div className="flex items-center justify-around py-2">
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] transition-colors",
                isActive
                  ? "text-terminal-green"
                  : "text-muted-foreground"
              )}
            >
              {Icon && <Icon size={20} />}
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
