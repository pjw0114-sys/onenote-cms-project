# 작업 계획: OneNote CMS 블로그 (ROADMAP 기반)

> `docs/ROADMAP.md`의 Phase 순서(1 → 2 → 3 → 4 → 5)를 그대로 따른다. 각 Phase는 이전 Phase가 끝나야 시작할 수 있다. `shrimp-task-manager` MCP 태스크 저장이 환경 설정 문제(`.mcp.json`의 `DATA_DIR` 경로 이슈, 수정 완료 — MCP 재연결 후 재사용 가능)로 막혀 있어, 대신 이 문서로 계획을 관리한다.

현황(직접 확인한 사실): `package.json`에 Graph API 패키지(`@microsoft/microsoft-graph-client`, `@azure/msal-node`) 없음. `src/lib`에는 `utils.ts`만 존재. `src/app`에 `posts`/`categories` 라우트 없음. `.env*` 파일 없음. 즉 Phase 1이 전혀 착수되지 않은 상태.

공통 규칙(모든 태스크 공통, `shrimp-rules.md`/`CLAUDE.md`/`AGENTS.md` 근거):
- 비표준 메이저(`next@^16.2.11`/`react@^19.2.4`/`tailwindcss@^4`/`zod@^4`) 새 API는 구현 전 `/breaking-check`로 확인한다.
- 새 페이지는 `/new-page`, 새 폼은 `/new-form` 커맨드를 우선 사용한다.
- 네비게이션/메타데이터는 `src/config/nav.ts`/`site.ts`에만 추가한다.
- Base UI는 `asChild`가 아닌 `render` prop 패턴을 쓴다.
- 서버 상태는 TanStack Query, 순수 UI 상태는 Zustand로 분리한다.
- `Status = 초안` 페이지는 반드시 서버 사이드에서 필터링한다(PRD 10절 최우선 보안 규칙).
- 테스트 러너가 없으므로 `npm run lint && npm run build`로 검증한다.
- 코드 변경을 마친 태스크는 완료 처리 전 `code-reviewer` 서브에이전트 리뷰를 거친다.

재사용 대상(신규 구현 금지): `src/lib/utils.ts`, `src/components/common/empty-state.tsx`, `src/components/providers/*`, `src/config/nav.ts`/`site.ts`, `src/components/ui/*`, `(marketing)` 라우트 셸.

---

## Phase 1. 프로젝트 초기 설정 (골격) — dependency 없음

| # | 태스크 | 완료 기준 |
| --- | --- | --- |
| 1-1 | Graph API 패키지(`@microsoft/microsoft-graph-client`, `@azure/msal-node`) 설치 및 next16 호환성 확인. 설치 전 `/breaking-check`로 Next 16 서버 전용 모듈 사용법 확인 | `package.json`에 두 패키지 추가, `npm run build` 통과 |
| 1-2 | 환경 변수 정의 및 `.env.local`/`.env.example` 작성 (`AZURE_AD_CLIENT_ID`/`SECRET`/`TENANT_ID`, `ONENOTE_NOTEBOOK_ID` 등) | `.env.example` 커밋됨, `.env.local`은 git 추적 안 됨 |
| 1-3 | Azure AD 앱 등록 + `Notes.Read` 권한 부여, OneNote 노트북/섹션 생성, PRD 5절 필드(Title/Category/Tags/Published/Status) 규칙 확정 및 테스트 페이지 작성 *(사용자 수동 작업 포함)* | Graph API 토큰 발급 성공, 필드를 가진 테스트 페이지 1개 이상 존재 |
| 1-4 | `src/lib/graph-client.ts`에 인증 토큰 발급/캐싱 구조 스캐폴딩(조회 로직은 Phase2/3에서) | 서버 사이드 호출 시 토큰 정상 발급, `npm run build` 통과 |
| 1-5 | `src/config/site.ts` 블로그 메타데이터(name/description/url) 갱신 | 헤더/푸터에 새 사이트명 표시, `npm run lint`/`build` 통과 |
| 1-6 | `(marketing)` 그룹에 `/posts/[id]`, `/categories/[category]` 빈 라우트 생성(`/new-page` 우선 사용) + 필요 시 `nav.ts` 등록 | 임시 경로 접근 시 렌더링 오류 없음, `npm run build` 통과 |

의존성 체인: 1-2 → 1-3 → 1-4 (1-1과 합류) / 1-5 → 1-6. Phase 2는 1-4와 1-6 모두 완료 후 시작.

---

## Phase 2. 공통 모듈/컴포넌트 개발 — dependency: Phase 1 전체

| # | 태스크 | 완료 기준 |
| --- | --- | --- |
| 2-1 | OneNote 응답 → 도메인 타입/DTO 매퍼 정의 (zod v4 스키마, `/breaking-check` 선행) | `Status=초안` 페이지가 매핑 결과에서 제외됨을 확인 |
| 2-2 | `Status=발행됨` 서버사이드 필터 공통 함수 (PRD 10절 보안 리스크 대응, 반드시 서버에서 실행) | 초안 페이지가 API 응답에 절대 포함되지 않음을 테스트로 확인 |
| 2-3 | `PostCard`/`PostList` 컴포넌트 (`src/components/common/`, Base UI render prop 패턴) | 임시 목데이터로 정상 렌더링 |
| 2-4 | 카테고리 뱃지/태그 컴포넌트 개발 | 임시 목데이터로 정상 렌더링 |
| 2-5 | OneNote HTML 콘텐츠 sanitize + 렌더링 공통 컴포넌트 | XSS 위험 태그 제거 확인, 정상 렌더링 |
| 2-6 | TanStack Query 데이터 페칭 훅 (`src/hooks/`, 캐싱/재검증 옵션 포함) | 캐시/재검증 옵션과 함께 정상 동작 |
| 2-7 | 로딩/에러/빈 상태를 기존 `EmptyState` 등으로 연결 | 콘솔 에러 없이 각 상태 표시 |

의존성 체인: 2-1 → 2-2 → (2-3, 2-4 병렬 가능) → 2-5 → 2-6 → 2-7. Phase 3은 2-7 완료 후 시작.

---

## Phase 3. 핵심 기능 개발 (MVP) — dependency: Phase 2 전체

| # | 태스크 | 완료 기준 |
| --- | --- | --- |
| 3-1 | 글 목록 페이지(`/`): `Status=발행됨` 필터 + `Published` 내림차순 정렬 + `PostCard` 연동 | 실제 발행 글이 최신순으로 노출 |
| 3-2 | 글 상세 페이지(`/posts/[id]`): 콘텐츠 렌더링 + 메타데이터 표시 | 실제 OneNote 콘텐츠(이미지 포함) 정상 렌더링 |
| 3-3 | 카테고리 페이지(`/categories/[category]`): Category 필터 | 카테고리 클릭 시 해당 글만 필터링 |
| 3-4 | 반응형 스타일 적용 (모바일/태블릿/데스크톱) | 3개 뷰포트에서 레이아웃 깨짐 없음 |
| 3-5 | ISR/캐싱 재검증 주기 설정 (Rate Limit 대응) | 발행 후 캐시 주기 내 블로그에 반영 확인 |

의존성 체인: (3-1, 3-2, 3-3 병렬 가능, 모두 2-7에 의존) → 3-4 → 3-5. Phase 4는 3-5 완료 후 시작.

---

## Phase 4. 추가 기능 개발 — dependency: Phase 3 전체

| # | 태스크 | 완료 기준 |
| --- | --- | --- |
| 4-1 | 제목/태그 검색 기능 (클라이언트 또는 서버 사이드) | 키워드 입력 시 관련 글만 결과 노출 |
| 4-2 | 백로그 선택 구현 (페이지네이션/다크모드 토글 - `next-themes` 이미 연동/RSS 중 선택) | 구현한 항목이 기존 목록/상세 동작을 깨지 않음 |

의존성 체인: 4-1 → 4-2. Phase 5는 4-2 완료 후 시작.

---

## Phase 5. 최적화 및 배포 — dependency: Phase 4 전체

| # | 태스크 | 완료 기준 |
| --- | --- | --- |
| 5-1 | 이미지 최적화 적용 (`/breaking-check`로 Next16 이미지 API 확인) | `next/image` 정상 적용 |
| 5-2 | SEO 최적화 (sitemap, OG 이미지) | 실제 sitemap/OG 태그 생성 확인 |
| 5-3 | 캐싱/재검증 최종 튜닝 (Rate Limit 리스크 재확인) | 재검증 주기 내 반영, Rate Limit 오류 없음 |
| 5-4 | Lighthouse 성능/접근성 점검 및 개선 | 개인 기준치 충족 |
| 5-5 | Vercel 배포 설정 및 프로덕션 환경 변수(Azure AD 자격 증명) 등록 | 프로덕션 URL에서 실제 OneNote 데이터 정상 표시 |
| 5-6 | 최종 `npm run build`/`lint` 통과 및 `Status=초안` 미노출 최종 확인 | 빌드/린트 오류 없음, 프로덕션에서 초안 미노출 확인 |

의존성 체인: 5-1 → 5-2 → 5-3 → 5-4 → 5-5 → 5-6.

---

## 참고

- `shrimp-task-manager`의 `DATA_DIR` 경로 문제(`.mcp.json`)는 Windows 경로(`C:\\dev\\onenote-cms-project\\shrimp_data`)로 수정했다. MCP 서버를 재연결하면 `plan_task`/`split_tasks`로 이 계획을 동일하게 재등록할 수 있다.
- 각 Phase 완료 시 `docs/ROADMAP.md`의 해당 Phase "완료 기준" 체크리스트를 함께 갱신한다.
