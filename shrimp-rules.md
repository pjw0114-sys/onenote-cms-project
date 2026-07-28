# Development Guidelines

이 문서는 AI Agent가 이 저장소(`onenote-cms-project`)에서 코드를 수정/추가할 때 즉시 참조하는 행동 규칙이다. 일반적인 Next.js/React/Tailwind 지식은 포함하지 않는다. 세부 아키텍처 설명은 `CLAUDE.md`, 세부 API 검증 절차는 `AGENTS.md`, 제품 요구사항은 `docs/PRD.md`, 단계별 작업 순서는 `docs/ROADMAP.md`를 따른다.

## 프로젝트 개요

- OneNote(Microsoft Graph API)를 CMS로 쓰는 개인 블로그. 현재 저장소는 Next.js UI 스타터 골격 단계이며, OneNote 연동(`src/lib`의 Graph API 클라이언트, `.env`/`.env.example`)은 **아직 구현되어 있지 않다**.
- 스택: `next@^16.2.11`, `react@^19.2.4`, `tailwindcss@^4`, `zod@^4.4.3`, `@base-ui/react@^1.6.0`, `@tanstack/react-query@^5`, `zustand@^5`. 모두 최신/비표준 메이저이므로 학습 데이터의 관례를 그대로 적용하지 않는다.

## Phase 순서 강제 (`docs/ROADMAP.md` 기준)

- 개발 순서는 `docs/ROADMAP.md`의 Phase 1(프로젝트 초기 설정) → Phase 2(공통 모듈) → Phase 3(핵심 기능 MVP) → Phase 4(추가 기능) → Phase 5(최적화/배포)를 반드시 따른다.
- 현재 저장소 상태(2026-07-28 기준)는 Phase 1 착수 전이다: `package.json`에 Graph API 패키지 없음, `src/lib`에 `utils.ts`만 존재, `src/app`에 `posts`/`categories` 라우트 없음, `.env*` 파일 없음.
- **금지**: Phase 1(OneNote 인증/환경변수/라우트 골격)이 끝나지 않은 상태에서 Phase 2(공통 매퍼/컴포넌트)나 Phase 3(글 목록/상세/카테고리 실제 기능) 작업을 먼저 구현하는 것. 이전 Phase의 완료 기준(각 Phase 문서의 체크리스트)을 먼저 충족한다.
- 세부 태스크 분할은 `docs/TASKS.md`(Phase별 표, 의존성 체인 포함)를 우선 참조한다. `shrimp-task-manager`(`plan_task`/`split_tasks`)로 태스크를 등록/갱신하면 `docs/TASKS.md`의 해당 Phase 표도 함께 갱신해 두 문서가 어긋나지 않게 한다.

## 새 API 사용 전 필수 확인 절차

- `next`, `react`, `tailwindcss`, `zod` 관련 새 API(특히 `next/image`, 라우팅 핸들러, 캐싱/재검증, App Router 컨벤션)를 쓰기 전에 반드시 `/breaking-check [확인할 API 또는 작업 설명]`를 먼저 호출한다.
- 학습 데이터 기억만으로 API를 사용하지 말고 `node_modules/next/dist/docs/`(App Router 문서, 423개 이상 파일 존재) 및 해당 패키지의 `.d.ts` 타입 선언을 대조한다.
- **금지**: `/breaking-check` 없이 Next 15 이하 관례(예: 구버전 `next/image` props, 구버전 라우트 핸들러 시그니처)를 그대로 적용하는 것.

## 라우트 그룹 배치 규칙 (`src/app/`)

현재 라우트 그룹은 3개이며 각각 URL 세그먼트에 영향을 주지 않는다.

| 그룹 | 셸 | 용도 | 예시 |
| --- | --- | --- | --- |
| `(marketing)` | `SiteHeader` + `main` + `SiteFooter` (`src/app/(marketing)/layout.tsx`) | 공개 페이지 | `/` |
| `(app)` | `SidebarProvider` + `AppSidebar` + 상단바 (`src/app/(app)/layout.tsx`) | 인증 후 대시보드 | `/dashboard` |
| `(auth)` | 헤더/사이드바 없이 중앙 정렬 (`src/app/(auth)/layout.tsx`) | 로그인/회원가입 | `/login`, `/signup` |

- 새 공개 페이지 → `(marketing)`, 새 대시보드/내부 페이지 → `(app)`, 새 인증 관련 페이지(로그인/회원가입/비밀번호 재설정 등) → `(auth)` 아래에 배치한다.
- 새 페이지를 만들 때는 직접 `page.tsx`를 작성하기 전에 `/new-page [marketing|app|auth 중 적절한 그룹] [route-path] [페이지 제목]`을 우선 사용한다. `/new-page` 커맨드가 `auth` 그룹을 지원하지 않으면 스캐폴딩 후 `src/config/nav.ts` 등록을 수동으로 맞춘다.
- **금지**: 세 그룹에 속하지 않는 새로운 최상위 라우트 그룹을 임의로 만드는 것. 기존 3개 그룹 중 하나에 맞춰 배치한다.

## 전역 설정 단일 소스 — 동시 수정 필수

- `src/config/nav.ts`: `mainNav`(마케팅 헤더 네비게이션), `sidebarNav`(대시보드 사이드바 네비게이션)를 정의한다. 새 메뉴 항목은 이 배열에만 추가한다.
  - **금지**: `SiteHeader`, `AppSidebar` 등 컴포넌트 안에 네비게이션 링크를 하드코딩하는 것.
  - 새 대시보드 라우트를 추가하면 반드시 `sidebarNav`에도 항목을 추가한다. 새 공개 라우트를 헤더에 노출해야 하면 `mainNav`에도 추가한다. 둘 중 하나만 갱신하고 끝내지 않는다.
- `src/config/site.ts`: 사이트명/설명/URL 등 메타데이터의 단일 소스. SEO/OpenGraph 관련 코드를 추가할 때 이 값을 재사용하고, 별도로 문자열을 하드코딩하지 않는다.

## Provider 합성 순서 (`src/components/providers/index.tsx`)

- 현재 순서: `ThemeProvider`(next-themes) → `QueryProvider`(TanStack Query) → `TooltipProvider`. `RootLayout`(`src/app/layout.tsx`)은 `Providers` 컴포넌트 하나만 사용한다.
- 새 전역 Provider를 추가/교체할 때는 `src/components/providers/index.tsx` 한 파일만 수정한다. `RootLayout`이나 개별 페이지에 Provider를 직접 추가하지 않는다.
- 기존 순서를 바꿔야 한다면(예: 새 Provider가 Query 캐시에 의존) 그 이유를 코드 주석으로 남긴다. 근거 없이 순서를 바꾸지 않는다.

## 상태 관리 분리 (서버 상태 vs 클라이언트 상태)

- 서버에서 오는 데이터(fetching/caching/재검증)는 TanStack Query로만 관리한다.
- 서버와 무관한 순수 UI 상태(사이드바 열림/닫힘 등)는 Zustand(`src/stores/`, 예: `use-ui-store.ts`)로 관리한다.
- **금지**: TanStack Query가 반환한 서버 데이터를 Zustand 스토어에 복제해서 저장하는 것. 두 상태를 섞지 않는다.

## UI 컴포넌트 레이어 배치

- `src/components/ui/`: shadcn 생성 프리미티브. CLI로 재생성하거나 신중하게 직접 수정한다.
- `src/components/common/`: 도메인 비종속 재사용 조합 컴포넌트(`PageHeader`, `StatCard`, `EmptyState`, `ProfileForm`, `LoginForm` 등).
- `src/components/layout/`: 헤더/푸터/사이드바/네비게이션 등 레이아웃 전용 컴포넌트.
- `src/components/theme/`, `src/components/providers/`: 각각 테마 토글, 전역 Provider 전용.
- 새 컴포넌트를 만들 때 위 네 레이어 중 어디에 속하는지 먼저 판단하고, 해당 디렉터리에만 배치한다.

## Base UI 합성 패턴 — Radix 아님 (필수 주의)

- `components.json`의 shadcn `style`은 `base-nova`이며 `@base-ui/react`(Radix UI 아님)를 사용한다.
- 합성(composition) API가 Radix와 다르다: `asChild` prop 대신 `render` prop을 사용한다.
  - 예시(`src/components/layout/app-sidebar.tsx`): `<SidebarMenuButton render={<Link href={item.href} />} isActive={...} tooltip={...}>`
- **금지**: 웹/학습 데이터에서 가져온 Radix 기반 shadcn 예제 코드(`asChild` 사용)를 그대로 붙여넣는 것. 반드시 `render` prop 패턴으로 변환하거나 기존 컴포넌트(`app-sidebar.tsx`, `sidebar.tsx`)에서 실제 사용 예를 확인한다.
- 새 shadcn 컴포넌트가 필요하면 직접 작성하지 말고 `shadcn` CLI로 추가/갱신한다(`components.json` 설정: style `base-nova`, baseColor `neutral`, iconLibrary `lucide`).

## 폼 패턴

- 표준 조합: `react-hook-form` + `zod`(`@hookform/resolvers/zod`) + shadcn `Form`/`FormField`.
- 참조 구현: `src/components/common/profile-form.tsx`. zod 스키마로 검증 규칙/에러 메시지(한국어)를 정의하고, 제출 성공 시 `sonner`의 `toast`로 피드백을 준다.
- 새 폼을 작성하기 전에 직접 코드를 짜지 말고 `/new-form [폼 이름] [필드 설명]`을 먼저 사용한다.
- zod v4는 비표준 메이저이므로 스키마 API(에러 메시지 커스터마이징 등) 사용 전 `/breaking-check`로 타입 선언을 확인한다.

## 스타일링

- Tailwind CSS v4를 `@import` 기반으로 사용하며 별도 `tailwind.config` 파일이 없다(`postcss.config.mjs` 기준). 디자인 토큰은 `src/app/globals.css`의 `@theme inline`과 `:root`/`.dark` CSS 커스텀 프로퍼티(OKLCH)로 정의한다.
- **금지**: 새 `tailwind.config.{js,ts}` 파일을 생성하는 것, `globals.css` 밖에 별도 토큰 파일을 만드는 것.
- 클래스 병합은 항상 `cn()`(`src/lib/utils.ts`)을 사용한다. `clsx`/`tailwind-merge`를 직접 개별 호출하지 않는다.

## OneNote 연동 관련 보안 규칙 (PRD 10절 기준, 최우선)

- OneNote 페이지 조회/매핑 로직을 구현할 때 `Status = 초안`인 페이지는 **서버 사이드에서** 반드시 제외한다. 클라이언트 사이드 필터링만으로 대체하지 않는다.
- Graph API 자격 증명(클라이언트 ID/시크릿/테넌트)은 `.env`/`.env.local`에만 두고, 코드나 커밋에 하드코딩하지 않는다. 새 환경 변수를 추가하면 `.env.example`에도 키 이름을 추가한다(값은 비워둠).
- OneNote 페이지 HTML 콘텐츠를 렌더링하기 전에 sanitize 처리를 거친다(아직 구현 전이면, 구현 시 sanitize 단계를 생략하지 않는다).

## 코드 리뷰 워크플로우 (필수, 자동)

- 기능 구현/버그 수정/리팩토링 등 코드 변경 작업을 마치면, 사용자가 요청하지 않아도 **반드시** `code-reviewer` 서브에이전트(`.claude/agents/code-reviewer.md`)를 호출해 변경사항을 검토한다.
- 코드 변경 후 이 호출을 건너뛰고 작업을 완료 처리하지 않는다.

## 테스트/검증

- 이 저장소에는 테스트 러너가 구성되어 있지 않다. 테스트 프레임워크(Jest/Vitest 등)를 임의로 추가하거나 테스트 코드를 작성하지 않는다.
- 코드 변경 검증은 `npm run lint`(ESLint: `eslint-config-next` core-web-vitals + typescript)와 `npm run build`로 수행한다.

## 금지 행위 요약

- `/breaking-check` 없이 Next 16/React 19/Tailwind v4/Zod v4의 새 API를 학습 데이터 관례대로 사용하는 것.
- `(marketing)`/`(app)`/`(auth)` 3개 라우트 그룹 외에 새 그룹을 임의로 만드는 것.
- 네비게이션 링크를 `src/config/nav.ts` 대신 컴포넌트에 하드코딩하는 것.
- TanStack Query로 가져온 서버 데이터를 Zustand 스토어에 복제하는 것.
- Radix 기반 `asChild` shadcn 예제를 변환 없이 그대로 사용하는 것(`render` prop으로 바꿔야 함).
- `tailwind.config.{js,ts}` 파일을 새로 생성하는 것.
- OneNote `Status=초안` 페이지를 서버 필터링 없이 노출 가능한 경로로 두는 것.
- 코드 변경 후 `code-reviewer` 서브에이전트 호출을 생략하는 것.
- 테스트 프레임워크를 임의로 도입하는 것.
- `docs/ROADMAP.md`의 Phase 순서를 건너뛰고 이전 Phase 완료 기준을 충족하지 않은 채 상위 Phase 기능(예: Phase 1 미완료 상태에서 Phase 3 핵심 기능)을 먼저 구현하는 것.
