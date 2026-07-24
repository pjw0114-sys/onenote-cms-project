---
argument-hint: [폼 이름] [필드 설명]
description: react-hook-form + zod + shadcn Form 배선 패턴으로 새 폼 컴포넌트 생성
model: claude-sonnet-5
---
다음 폼을 만들어주세요: $ARGUMENTS

`src/components/common/profile-form.tsx`를 참조 구현으로 삼아 동일한 패턴을 따른다:
1. 파일 최상단에 `"use client"` 지시어를 둔다.
2. `zod`로 스키마를 정의하고 필드별 한국어 에러 메시지를 작성한다. zod v4 문법(예: 에러 커스터마이징 옵션)이 v3와 다를 수 있으니 필요하면 `node_modules/zod/`의 타입 선언을 확인한다.
3. `z.infer`로 값 타입을 추출하고 `useForm` + `zodResolver`로 연결한다.
4. UI는 `src/components/ui/form.tsx`의 `Form`/`FormField`/`FormItem`/`FormLabel`/`FormControl`/`FormDescription`/`FormMessage` 조합을 사용한다. Select/Switch 등 프리미티브가 필요하면 `src/components/ui/`의 기존 컴포넌트를 사용한다(Base UI 기반이므로 Radix 전제의 `asChild`가 아니라 필요한 곳엔 `render` prop 패턴을 따른다).
5. 제출 성공 시 `sonner`의 `toast.success`로 피드백을 준다.
6. 완성된 컴포넌트는 `src/components/common/`에 kebab-case 파일명(`*-form.tsx`)으로 배치한다.
7. 사용할 페이지가 지시되지 않았다면 어디에 배치할지 먼저 확인한다.
