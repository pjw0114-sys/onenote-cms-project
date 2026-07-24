"use client";

import type { ComponentProps } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// next-themes를 래핑해 앱 전역에 라이트/다크/시스템 테마 전환을 제공한다.
// Tailwind v4의 `.dark` 클래스 전략(globals.css의 @custom-variant dark)과
// attribute="class" 설정이 그대로 연동된다.
export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
