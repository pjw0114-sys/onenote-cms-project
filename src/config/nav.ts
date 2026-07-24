import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, Home } from "lucide-react";

// 마케팅 헤더용 네비게이션 (데스크톱/모바일 공용 단일 소스)
export type NavItem = {
  title: string;
  href: string;
};

export const mainNav: NavItem[] = [
  { title: "홈", href: "/" },
  { title: "대시보드", href: "/dashboard" },
  { title: "로그인", href: "/login" },
];

// 대시보드 사이드바용 네비게이션
// 설정 화면은 별도 라우트가 아니라 대시보드 내 "설정" 탭으로 제공된다.
export type SidebarNavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export const sidebarNav: SidebarNavItem[] = [
  { title: "개요", href: "/dashboard", icon: LayoutDashboard },
  { title: "홈으로", href: "/", icon: Home },
];
