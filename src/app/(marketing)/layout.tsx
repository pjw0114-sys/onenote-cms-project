import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

// 마케팅(공개) 영역 공통 셸: 헤더 + 콘텐츠 + 푸터.
// 라우트 그룹이라 URL에는 영향을 주지 않는다("/" 그대로 유지).
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
