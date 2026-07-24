import Link from "next/link";
import { LayoutDashboard, LogIn, Moon, Palette, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { siteConfig } from "@/config/site";

const features = [
  {
    icon: Rocket,
    title: "바로 시작하는 App Router",
    description:
      "Next.js 16(Turbopack 기본) + React 19 + Tailwind v4로 설정을 끝낸 상태에서 페이지 개발만 시작하면 됩니다.",
    href: "/dashboard",
  },
  {
    icon: Palette,
    title: "실용적인 컴포넌트 세트",
    description:
      "shadcn(base-nova) 컴포넌트를 계층별로 정리해, 필요한 걸 바로 조합해 쓸 수 있습니다.",
    href: "https://ui.shadcn.com",
  },
  {
    icon: Moon,
    title: "다크모드 & 검증된 유틸",
    description:
      "next-themes, TanStack Query, react-hook-form+zod, Zustand, usehooks-ts가 이미 배선돼 있습니다.",
    href: siteConfig.links.github,
  },
];

export default function LandingPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-24 px-4 py-16 sm:py-24">
      <section className="flex flex-col items-center gap-6 text-center">
        <Badge variant="secondary">Next.js 16 · Tailwind v4 · shadcn</Badge>
        <h1 className="font-heading max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
          {siteConfig.name}
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          {siteConfig.description}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" nativeButton={false} render={<Link href="/dashboard" />}>
            <LayoutDashboard />
            대시보드 예제 보기
          </Button>
          <Button
            size="lg"
            variant="outline"
            nativeButton={false}
            render={<Link href="/login" />}
          >
            <LogIn />
            로그인
          </Button>
          <Button
            size="lg"
            variant="ghost"
            nativeButton={false}
            render={
              <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer" />
            }
          >
            GitHub
          </Button>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {features.map((feature) => {
          const isExternal = feature.href.startsWith("http");
          const card = (
            <Card className="h-full cursor-pointer transition hover:bg-accent/40 hover:ring-foreground/20">
              <CardHeader>
                <feature.icon className="mb-2 size-6 text-primary" />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          );

          const linkClassName =
            "block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

          return isExternal ? (
            <a
              key={feature.title}
              href={feature.href}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClassName}
            >
              {card}
            </a>
          ) : (
            <Link key={feature.title} href={feature.href} className={linkClassName}>
              {card}
            </Link>
          );
        })}
      </section>
    </div>
  );
}
