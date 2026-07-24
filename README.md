# OneNote CMS 개인 개발 블로그

OneNote를 CMS로 활용하는 개인 기술 블로그입니다. OneNote 앱에서 글을 작성하고 상태(Status)를 "발행됨"으로 변경하면, 별도의 배포 작업 없이 블로그에 자동으로 반영됩니다.

자세한 요구사항은 [docs/PRD.md](./docs/PRD.md)를 참고하세요.

## 주요 기능

- OneNote 데이터베이스에서 블로그 글 목록 가져오기
- 개별 글 상세 페이지 표시
- 카테고리별 필터링
- 검색 기능
- 반응형 디자인

## 기술 스택

- **Frontend**: Next.js, TypeScript, React
- **CMS**: OneNote API (Microsoft Graph API)
- **Styling**: Tailwind CSS, shadcn/ui
- **Icons**: Lucide React
- **상태 관리**: TanStack Query(서버 상태), Zustand(클라이언트 상태)
- **폼**: react-hook-form + zod
- **Deployment**: Vercel

## 시작하기

개발 서버 실행:

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 결과를 확인할 수 있습니다.

기타 명령어:

```bash
npm run build   # 프로덕션 빌드
npm run start   # 프로덕션 서버 실행
npm run lint    # ESLint 검사
```

## 프로젝트 구조

- `src/app/(marketing)`: 공개 랜딩 페이지 영역
- `src/app/(app)`: 인증/대시보드 영역
- `src/config`: 사이트 메타데이터 및 네비게이션 정의
- `src/components`: UI 프리미티브(`ui/`), 공용 조합 컴포넌트(`common/`), 레이아웃(`layout/`) 등
- `docs/PRD.md`: 프로젝트 요구사항 정의서

## Deploy on Vercel

[Vercel Platform](https://vercel.com/new)을 통해 배포할 수 있습니다. 자세한 내용은 [Next.js 배포 문서](https://nextjs.org/docs/app/building-your-application/deploying)를 참고하세요.
