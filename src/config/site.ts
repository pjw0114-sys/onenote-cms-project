// 사이트 전역 메타데이터의 단일 소스 (SEO, OpenGraph, 헤더/푸터 등에서 재사용)
export const siteConfig = {
  name: "Next Starter",
  description:
    "Next.js 16 + Tailwind v4 + shadcn(base-nova)로 구성된 모던 웹 스타터킷입니다.",
  url: "https://example.com",
  ogImage: "/og.png",
  links: {
    github: "https://github.com",
  },
} as const;

export type SiteConfig = typeof siteConfig;
