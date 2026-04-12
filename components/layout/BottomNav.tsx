"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { useT } from "@/lib/i18n/use-language";
import { IconHome, IconBook, IconHammer, IconUser, IconSearch } from "@/components/ui/Icons";

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

export function BottomNav() {
  const pathname = usePathname();
  const t = useT();

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
              {t(item.key)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
