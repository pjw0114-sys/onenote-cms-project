import type { Metadata } from "next";
import Link from "next/link";
import { Construction } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/common/empty-state";

export const metadata: Metadata = {
  title: "회원가입",
};

export default function SignupPage() {
  return (
    <EmptyState
      icon={Construction}
      title="회원가입 기능은 준비 중입니다"
      description="빠른 시일 내에 회원가입 기능을 제공할 예정입니다. 잠시만 기다려 주세요."
      action={
        <Link href="/login" className={buttonVariants({ variant: "outline", size: "sm" })}>
          로그인으로 돌아가기
        </Link>
      }
    />
  );
}
