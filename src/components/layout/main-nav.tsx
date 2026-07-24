"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { mainNav } from "@/config/nav";

// 마케팅 헤더의 데스크톱 네비게이션. 현재 경로와 일치하는 링크를 강조한다.
export function MainNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={cn("items-center gap-6 text-sm", className)}>
      {mainNav.map((item) => {
        const isActive =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "transition-colors hover:text-foreground",
              isActive ? "font-medium text-foreground" : "text-muted-foreground"
            )}
          >
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
