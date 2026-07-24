---
argument-hint: [확인할 API 또는 작업 설명]
description: 코드 작성 전 Next.js 16 / React 19 / Tailwind v4 / Zod v4 API를 실제 문서·타입 선언과 대조
model: claude-sonnet-5
---
다음 작업에 사용할 API를 확인해주세요: $ARGUMENTS

이 프로젝트는 `next@^16.2.11`, `react@^19.2.4`, `tailwindcss@^4`, `zod@^4` 등 최신/비표준 메이저 버전을 쓰고 있어 학습 데이터의 관례가 실제 동작과 다를 수 있다(`AGENTS.md` 참고). 코드를 작성/수정하기 전에 아래를 확인한다:

1. App Router 관련 API(라우팅, 캐싱, 메타데이터, 서버/클라이언트 컴포넌트 등)는 `node_modules/next/dist/docs/01-app/`에서 해당 주제 문서를 찾아 읽는다.
2. shadcn 컴포넌트를 다룰 때는 Radix 전제(`asChild` prop)를 그대로 가져오지 않는다 — 이 프로젝트는 `base-nova` 스타일 + Base UI(`@base-ui/react`) 기반이므로 합성 방식이 다르다(예: `render={<Link href={...} />}`, `src/components/layout/app-sidebar.tsx`의 `SidebarMenuButton` 참고).
3. zod 스키마 작성 시 v4 문법이 v3와 다를 수 있으니 `node_modules/zod/`의 타입 선언을 확인한다.
4. Tailwind는 v4 `@import` 기반이며 별도 `tailwind.config` 파일이 없다 — v3 방식(설정 파일, 구식 유틸리티 등)으로 작성하지 않는다.
5. 확인한 내용과 실제로 코드에 적용해야 할 차이점을 정리해서 보고한 뒤, 필요하면 바로 코드에 반영한다.
