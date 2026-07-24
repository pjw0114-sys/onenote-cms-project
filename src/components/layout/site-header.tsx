import Link from "next/link";
import { MainNav } from "@/components/layout/main-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { siteConfig } from "@/config/site";

// 마케팅(랜딩) 영역 공통 헤더: 로고 + 데스크톱 네비 + 테마 토글 + 모바일 메뉴.
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
        <MobileNav />
        <Link href="/" className="font-heading font-semibold">
          {siteConfig.name}
        </Link>
        <MainNav className="hidden md:flex" />
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
