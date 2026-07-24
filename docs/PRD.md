# PRD: 개인 개발 블로그 (OneNote CMS 활용)

## 1. 개요

| 항목 | 내용 |
| --- | --- |
| 프로젝트명 | 개인 개발 블로그 |
| 목적 | OneNote를 CMS로 활용한 개인 기술 블로그 구축 |
| CMS 선택 이유 | OneNote에서 글을 작성하면 별도의 배포 작업 없이 자동으로 블로그에 반영됨 |
| 작성일 | 2026-07-24 |

### 1.1 배경 및 문제 정의

기존 블로그 플랫폼(velog, Tistory 등)은 글쓰기 경험이 파편화되어 있어, 평소 업무/학습 중 OneNote에 정리한 메모를 다시 블로그용으로 옮겨 작성해야 하는 이중 작업이 발생한다. OneNote를 CMS로 사용하면 평소 필기 습관 그대로 글을 작성하고, 별도 발행 절차 없이 상태(Status)만 "발행됨"으로 바꾸는 것으로 배포가 끝나는 워크플로우를 만들 수 있다.

### 1.2 목표

- OneNote에 작성한 노트를 정적/서버 렌더링 방식으로 블로그에 노출한다.
- 별도의 백엔드(DB, Admin) 구축 없이 OneNote를 단일 콘텐츠 소스(Single Source of Truth)로 사용한다.
- 카테고리/태그 기반 탐색과 검색이 가능한 최소 기능의 블로그를 제공한다.

### 1.3 비목표 (Out of Scope)

- 댓글, 좋아요 등 소셜 기능
- 다중 작성자 지원
- OneNote 외 CMS(예: Notion, Contentful) 지원
- 관리자 웹 UI를 통한 글 작성/수정 (글 작성은 OneNote 앱에서만 수행)

## 2. 사용자 및 사용 시나리오

- **주 사용자**: 블로그 운영자(본인) — OneNote 앱/웹에서 글을 작성하고 Status를 "발행됨"으로 변경.
- **방문자**: 블로그 웹사이트에서 글 목록을 조회하고, 카테고리/검색으로 원하는 글을 찾아 상세 내용을 읽음.

### 시나리오 예시

1. 운영자가 OneNote에서 새 페이지를 작성하고 Title, Category, Tags를 채운 뒤 Status를 "발행됨"으로 설정한다.
2. 블로그 사이트를 새로고침하면 홈 화면 최신 글 목록에 해당 글이 노출된다.
3. 방문자가 카테고리를 클릭하면 해당 카테고리의 글만 필터링되어 보인다.
4. 방문자가 검색창에 키워드를 입력하면 제목/태그 기준으로 글이 검색된다.

## 3. 주요 기능

| # | 기능 | 설명 |
| --- | --- | --- |
| 1 | 글 목록 조회 | OneNote 데이터베이스(노트북/섹션)에서 Status가 "발행됨"인 글을 최신 발행일 순으로 가져와 목록으로 표시 |
| 2 | 글 상세 페이지 | 개별 글의 Content(본문)를 렌더링하여 상세 페이지로 표시 |
| 3 | 카테고리별 필터링 | Category 속성을 기준으로 글 목록을 필터링하여 표시 |
| 4 | 검색 기능 | 제목/태그를 기준으로 클라이언트 또는 서버 사이드 검색 제공 |
| 5 | 반응형 디자인 | 모바일/태블릿/데스크톱 뷰포트에 대응하는 레이아웃 |

## 4. 기술 스택

| 구분 | 기술 |
| --- | --- |
| Frontend | Next.js 15, TypeScript |
| CMS | OneNote API (Microsoft Graph API) |
| Styling | Tailwind CSS, shadcn/ui |
| Icons | Lucide React |
| Deployment | Vercel |

> **참고**: 본 저장소의 실제 `package.json`은 `next@^16.2.11`, `react@^19.2.4`, `tailwindcss@^4`, `zod@^4` 등을 사용 중이다. PRD 상의 "Next.js 15"는 초기 요구사항 기준 표기이며, 실제 구현 시에는 `CLAUDE.md`/`AGENTS.md`에 따라 `node_modules/next/dist/docs/` 및 타입 선언을 확인하고 `/breaking-check` 절차를 거쳐 현재 설치된 메이저 버전 기준으로 진행한다.

## 5. OneNote 데이터베이스 구조

OneNote 페이지(노트)를 블로그 글 하나에 매핑하며, 아래 속성을 각 페이지의 메타데이터로 관리한다.

| 필드명 | 설명 | 타입 |
| --- | --- | --- |
| Title | 제목 | title |
| Category | 카테고리 | select |
| Tags | 태그 | multi_select |
| Published | 발행일 | date |
| Status | 상태 (초안 / 발행됨) | select |
| Content | 본문 | page content |

- 블로그 노출 대상은 `Status = 발행됨`인 페이지로 한정한다.
- `Status = 초안`인 페이지는 API 조회 시 제외한다.

## 6. 화면 구성

| 화면 | 경로(예시) | 설명 |
| --- | --- | --- |
| 홈 | `/` | 최근 발행된 글 목록 표시 |
| 글 상세 | `/posts/[id]` | 개별 글의 본문 및 메타데이터 표시 |
| 카테고리 | `/categories/[category]` | 특정 카테고리에 속한 글 목록 표시 |

## 7. MVP 범위

- OneNote API 연동 (Microsoft Graph API 인증 및 데이터 조회)
- 글 목록 및 상세 페이지
- 기본 스타일링 (Tailwind CSS + shadcn/ui)
- 반응형 디자인

MVP 이후 고려 사항(백로그): 검색 고도화(전문 검색), 페이지네이션/무한스크롤, 조회수, RSS, 다크모드, SEO 최적화(sitemap, OpenGraph 이미지 자동 생성) 등.

## 8. 구현 단계

1. **OneNote API 패키지 설치 및 환경 설정**
   - Microsoft Graph API 클라이언트 설치, 환경 변수(`.env`)에 클라이언트 ID/시크릿/테넌트 등 설정
2. **OneNote 데이터베이스 생성 및 API 키 설정**
   - 블로그용 노트북/섹션 구성, Title/Category/Tags/Published/Status 속성 정의, Azure AD 앱 등록 및 권한(Graph API `Notes.Read` 등) 부여
3. **글 목록 페이지 구현**
   - Status=발행됨 필터, Published 내림차순 정렬, 카드/리스트 UI 구성
4. **글 상세 페이지 구현**
   - 페이지 ID 기반 라우팅, OneNote 페이지 콘텐츠(HTML) 파싱 및 렌더링
5. **스타일링 및 최적화**
   - Tailwind/shadcn 기반 반응형 스타일 적용, 이미지 최적화, 로딩/에러 상태 처리

## 9. 성공 지표 (선택)

- OneNote에서 글 작성 후 블로그 반영까지 걸리는 시간(캐시/재검증 주기 이내)
- 모바일 뷰포트에서의 레이아웃 정상 동작 여부
- 카테고리 필터/검색 결과의 정확도

## 10. 리스크 및 고려사항

- **OneNote API 인증**: Microsoft Graph API는 OAuth 기반 인증이 필요하며, 개인 블로그 용도로는 토큰 갱신(refresh token) 관리 방식을 미리 설계해야 한다.
- **콘텐츠 렌더링**: OneNote 페이지 콘텐츠는 HTML로 제공되므로, 블로그 디자인 시스템과 일치하도록 스타일 재적용(sanitize 및 커스텀 스타일링)이 필요하다.
- **API 호출 제한(Rate Limit)**: 빈번한 요청 시 Graph API 제한에 걸릴 수 있으므로 캐싱/재검증(ISR 등) 전략이 필요하다.
- **비공개 정보 노출**: Status가 "초안"인 페이지나 개인적인 메모가 실수로 노출되지 않도록 서버 사이드에서 필터링을 엄격히 적용한다.
