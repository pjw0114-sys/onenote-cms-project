// 인증(로그인/회원가입) 영역 공통 셸: 헤더/사이드바 없이 화면 전체를 중앙 정렬한다.
// 라우트 그룹이라 URL에는 영향을 주지 않는다.
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
