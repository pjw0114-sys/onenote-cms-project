---
argument-hint: [marketing|app] [route-path] [페이지 제목]
description: (marketing)/(app) 라우트 그룹에 맞춰 새 페이지를 스캐폴딩하고 nav.ts에 등록
model: claude-sonnet-5
---
다음 페이지를 추가해주세요: $ARGUMENTS

절차:
1. 첫 번째 인자가 `marketing`이면 `src/app/(marketing)/`, `app`이면 `src/app/(app)/` 아래에 두 번째 인자 경로로 `page.tsx`를 생성한다.
2. `(app)` 그룹 페이지는 `src/components/common/page-header.tsx`의 `PageHeader`로 시작하는 구조를 따른다. `(marketing)` 그룹 페이지는 기존 `src/app/(marketing)/page.tsx`의 섹션 구성을 참고한다.
3. `src/config/nav.ts`를 확인해 새 페이지를 `mainNav`(marketing) 또는 `sidebarNav`(app, lucide-react 아이콘 선택 포함)에 추가한다. 네비게이션 링크를 컴포넌트에 직접 하드코딩하지 않는다.
4. 경로 별칭은 `@/*`를 사용한다. 서버 데이터가 필요하면 TanStack Query, 서버와 무관한 UI 상태만 필요하면 Zustand(`src/stores/`)를 사용하고 둘을 섞지 않는다.
5. App Router 관련 API가 학습 데이터와 다를 수 있으므로(`AGENTS.md` 참고) 필요하면 `node_modules/next/dist/docs/01-app/`에서 해당 주제 문서를 확인한다.
6. 완료 후 변경/생성된 파일 목록을 간단히 보고한다.
