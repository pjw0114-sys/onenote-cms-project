import type { Metadata } from "next";
import { Activity, CreditCard, DollarSign, Users } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { DashboardTabs } from "./dashboard-tabs";

export const metadata: Metadata = {
  title: "대시보드",
};

// 대시보드 예제 페이지. StatCard/Tabs/Form 등 컴포넌트 데모용 하드코딩 데이터를 사용한다.
export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="대시보드"
        description="컴포넌트 조합과 유틸리티 배선을 보여주는 데모 페이지입니다."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="총 매출"
          value="₩12,450,000"
          change={{ value: "12.4%", trend: "up" }}
          icon={DollarSign}
        />
        <StatCard
          title="활성 사용자"
          value="1,284"
          change={{ value: "4.1%", trend: "up" }}
          icon={Users}
        />
        <StatCard
          title="구독"
          value="342"
          change={{ value: "1.8%", trend: "down" }}
          icon={CreditCard}
        />
        <StatCard title="평균 응답시간" value="184ms" icon={Activity} />
      </div>

      <div className="mt-8">
        <DashboardTabs />
      </div>
    </div>
  );
}
