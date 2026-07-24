"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// 라이트/다크/시스템 테마 전환 토글.
// 아이콘 전환은 next-themes의 클라이언트 상태가 아니라 `.dark` 클래스에 반응하는
// CSS(dark:hidden / dark:block)로 처리해 하이드레이션 시 깜빡임을 피한다.
export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="테마 전환" />
        }
      >
        <span className="relative flex size-4 items-center justify-center">
          <Sun className="absolute size-4 scale-100 transition-transform dark:scale-0" />
          <Moon className="absolute size-4 scale-0 transition-transform dark:scale-100" />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          라이트
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          다크
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          시스템
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
