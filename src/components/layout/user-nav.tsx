"use client";

import { LogOut, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton } from "@/components/ui/sidebar";

// 사이드바 하단의 사용자 메뉴 데모(실제 인증 없이 정적 프로필 표시).
export function UserNav() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <SidebarMenuButton size="lg" className="data-open:bg-sidebar-accent" />
        }
      >
        <Avatar size="sm">
          <AvatarFallback>사용</AvatarFallback>
        </Avatar>
        <div className="flex flex-col text-left leading-tight">
          <span className="text-sm font-medium">사용자</span>
          <span className="text-xs text-muted-foreground">user@example.com</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="top">
        <DropdownMenuLabel>내 계정</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User />
          프로필
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings />
          설정
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <LogOut />
          로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
