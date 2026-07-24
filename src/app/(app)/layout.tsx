import { AppSidebar } from "@/components/layout/app-sidebar";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

// 대시보드(앱) 영역 셸: 사이드바 + 상단바(트리거/테마 토글) + 콘텐츠.
// 라우트 그룹이라 URL에는 영향을 주지 않는다("/dashboard" 그대로 유지).
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
          </div>
        </header>
        <div className="flex-1 p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
