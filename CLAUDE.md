# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## 이 저장소에서 반드시 지켜야 할 것

이 프로젝트는 `package.json`에 명시된 대로 `next@^16.2.11`, `react@^19.2.4`, `tailwindcss@^4`, `zod@^4` 등 최신/비표준 메이저 버전을 사용한다. 학습 데이터의 관례와 실제 API가 다를 수 있으므로, 코드를 작성하기 전에 반드시 `node_modules/next/dist/docs/`(App Router 문서) 및 해당 패키지의 타입 선언을 확인한다. 이 확인 절차는 `/breaking-check [확인할 API 또는 작업 설명]` 커맨드로 실행할 수 있다 — 새 API를 쓰기 전에 먼저 호출한다.

## 명령어

```bash
npm run dev     # 개발 서버 (http://localhost:3000)
npm run build   # 프로덕션 빌드
npm run start   # 프로덕션 서버 실행
npm run lint    # ESLint 검사 (eslint-config-next core-web-vitals + typescript)
```

- 테스트 러너는 구성되어 있지 않다.
- shadcn 컴포넌트 추가/갱신 시 `shadcn` CLI(`components.json` 설정 참고: style `base-nova`, baseColor `neutral`, iconLibrary `lucide`)를 사용한다.

## 커스텀 커맨드

`.claude/commands/`에 정의된 프로젝트 전용 커맨드. 아래 상황에서는 직접 코드를 작성하기 전에 우선 사용한다.

- `/new-page [marketing|app] [route-path] [페이지 제목]`: 라우트 그룹에 맞춰 `page.tsx`를 생성하고 `src/config/nav.ts`(`mainNav`/`sidebarNav`)에 등록까지 처리한다.
- `/new-form [폼 이름] [필드 설명]`: `profile-form.tsx`를 참조 구현으로 react-hook-form + zod + shadcn `Form` 배선을 생성한다.
- `/breaking-check [확인할 API 또는 작업 설명]`: 위 "반드시 지켜야 할 것" 확인 절차를 실행한다.

## 코드 리뷰 워크플로우

기능 구현, 버그 수정, 리팩토링 등 코드 변경 작업을 마치면 반드시 `code-reviewer` 서브에이전트(`.claude/agents/code-reviewer.md`)를 실행해 변경사항을 검토한다. 사용자가 별도로 요청하지 않아도 구현이 끝나는 시점에 먼저 호출한다.

## 아키텍처

### 라우트 구조 (App Router, route groups)

`src/app/`은 두 개의 라우트 그룹으로 나뉘며, 둘 다 URL 세그먼트에는 영향을 주지 않는다.

- `(marketing)`: 공개 영역. `SiteHeader` + `main` + `SiteFooter` 셸 (`src/app/(marketing)/layout.tsx`). 현재 랜딩 페이지(`/`)가 포함된다.
- `(app)`: 인증/대시보드 영역. `SidebarProvider` + `AppSidebar` + 상단바(트리거, 테마 토글) 셸 (`src/app/(app)/layout.tsx`). `/dashboard`가 포함된다.

새 공개 페이지는 `(marketing)` 아래에, 새 대시보드/내부 페이지는 `(app)` 아래에 추가한다. `/new-page` 커맨드로 스캐폴딩과 `nav.ts` 등록을 한 번에 처리할 수 있다.

### 전역 설정의 단일 소스

- `src/config/site.ts`: 사이트 이름/설명/URL 등 메타데이터(SEO, OpenGraph 등에서 재사용).
- `src/config/nav.ts`: 마케팅 헤더 네비게이션(`mainNav`)과 대시보드 사이드바 네비게이션(`sidebarNav`)을 각각 배열로 정의. 새 메뉴 항목은 컴포넌트에 직접 하드코딩하지 않고 여기에 추가한다.

### Provider 합성

`src/components/providers/index.tsx`의 `Providers`가 `ThemeProvider`(next-themes) → `QueryProvider`(TanStack Query) → `TooltipProvider` 순으로 감싸며, `RootLayout`(`src/app/layout.tsx`)은 이 컴포넌트 하나만 사용한다. 전역 Provider를 추가/교체할 때는 이 파일만 수정하면 된다. `QueryProvider`는 `QueryClient`를 `useState`로 컴포넌트 생애주기 동안 한 번만 생성하고, 개발 중 `ReactQueryDevtools`를 함께 마운트한다.

### 상태 관리: 서버 상태 vs 클라이언트 상태

- 서버 상태(fetching/caching/재검증)는 TanStack Query(`@tanstack/react-query`)로 관리한다.
- 서버와 무관한 순수 UI 상태는 Zustand(`src/stores/`)로 관리한다(예: `use-ui-store.ts`).
- 두 상태를 섞지 않는다 — 서버에서 오는 데이터를 Zustand 스토어에 복제하지 않는다.

### UI 컴포넌트 레이어

- `src/components/ui/`: shadcn이 생성한 프리미티브(건드릴 때는 CLI 재생성 또는 신중한 직접 수정).
- `src/components/common/`: 도메인에 종속되지 않는 재사용 조합 컴포넌트(`PageHeader`, `StatCard`, `EmptyState`, `ProfileForm` 등).
- `src/components/layout/`: 헤더/푸터/사이드바/네비게이션 등 레이아웃 전용 컴포넌트.
- `src/components/theme/`, `src/components/providers/`: 각각 테마 토글, 전역 Provider 전용.
- 경로 별칭은 `@/*` → `src/*` (`tsconfig.json`), shadcn 별칭은 `components.json`에 정의(`@/components`, `@/components/ui`, `@/lib`, `@/hooks`).

**중요 — Radix가 아닌 Base UI 기반**: shadcn 스타일이 `base-nova`이며 `@base-ui/react`를 사용한다(Radix UI 아님). 합성(composition) API가 다르다 — 예: `SidebarMenuButton`은 `asChild`가 아니라 `render={<Link href={...} />}` prop을 사용한다(`src/components/layout/app-sidebar.tsx` 참고). 다른 Radix 기반 shadcn 예제 코드를 그대로 가져오면 동작하지 않을 수 있다.

### 폼 패턴

`react-hook-form` + `zod`(`@hookform/resolvers/zod`) + shadcn `Form`/`FormField` 배선을 표준 패턴으로 사용한다. `src/components/common/profile-form.tsx`가 참조 구현이다: zod 스키마로 검증 규칙과 에러 메시지(한국어)를 정의하고, 제출 성공 시 `sonner`의 `toast`로 피드백을 준다. `/new-form` 커맨드로 이 패턴을 바로 생성할 수 있다.

### 스타일링

Tailwind CSS v4를 `@import` 기반으로 사용하며(`postcss.config.mjs`, 별도 `tailwind.config` 파일 없음), 디자인 토큰은 `src/app/globals.css`의 `@theme inline`과 `:root`/`.dark` CSS 커스텀 프로퍼티(OKLCH 색상)로 정의한다. 클래스 병합에는 `cn()`(`src/lib/utils.ts`, `clsx` + `tailwind-merge`)을 사용한다.
