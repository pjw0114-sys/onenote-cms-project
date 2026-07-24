"use client";

import { useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { useCopyToClipboard, useDebounceValue } from "usehooks-ts";
import { BarChart3, Bell, Copy, Search } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/common/empty-state";
import { ProfileForm } from "@/components/common/profile-form";
import { useUiStore } from "@/stores/use-ui-store";

// 정적 데모 데이터. 실제 API 연동은 스코프 밖(하드코딩 데모 데이터 사용).
const recentActivity = [
  { id: 1, title: "새 팀원 초대", at: new Date("2026-07-22T08:30:00") },
  { id: 2, title: "결제 정보 업데이트", at: new Date("2026-07-21T15:10:00") },
  { id: 3, title: "API 키 재발급", at: new Date("2026-07-19T10:00:00") },
];

const quickLinks = ["문서", "설정", "결제", "팀 관리", "API 키", "알림 설정"];

export function DashboardTabs() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useDebounceValue("", 300);
  const [, copyToClipboard] = useCopyToClipboard();
  const isCompact = useUiStore((state) => state.isCompact);
  const toggleCompact = useUiStore((state) => state.toggleCompact);

  const filteredLinks = useMemo(
    () =>
      quickLinks.filter((link) =>
        link.toLowerCase().includes(debouncedQuery.toLowerCase())
      ),
    [debouncedQuery]
  );

  function handleCopyApiKey() {
    copyToClipboard("sk_demo_1234567890").then((success) => {
      if (success) {
        toast.success("API 키가 클립보드에 복사되었습니다.");
      } else {
        toast.error("복사에 실패했습니다.");
      }
    });
  }

  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">개요</TabsTrigger>
        <TabsTrigger value="analytics">분석</TabsTrigger>
        <TabsTrigger value="settings">설정</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6 pt-4">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>빠른 실행 검색</CardTitle>
              <CardDescription>
                usehooks-ts의 useDebounceValue로 입력을 디바운스합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="relative">
                <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="검색..."
                  className="pl-8"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setDebouncedQuery(event.target.value);
                  }}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {filteredLinks.length > 0 ? (
                  filteredLinks.map((link) => (
                    <Button key={link} variant="secondary" size="sm">
                      {link}
                    </Button>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    일치하는 항목이 없습니다.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>최근 활동</CardTitle>
              <CardDescription>date-fns로 상대 시간을 표시합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="space-y-2">
                {recentActivity.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>{item.title}</span>
                    <span className="text-muted-foreground">
                      {formatDistanceToNow(item.at, {
                        addSuffix: true,
                        locale: ko,
                      })}
                    </span>
                  </li>
                ))}
              </ul>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.success("새 알림을 보냈습니다.")}
              >
                <Bell />
                테스트 알림 보내기
              </Button>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="analytics" className="pt-4">
        <EmptyState
          icon={BarChart3}
          title="아직 분석 데이터가 없습니다"
          description="이 스타터킷은 데모 데이터만 제공합니다. 실제 분석 연동 시 이 자리에 차트를 배치하세요."
        />
      </TabsContent>

      <TabsContent value="settings" className="space-y-8 pt-4">
        <Card>
          <CardHeader>
            <CardTitle>환경설정</CardTitle>
            <CardDescription>
              Zustand 전역 스토어(useUiStore)와 연동된 예제 토글입니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">컴팩트 모드</p>
                <p className="text-sm text-muted-foreground">
                  현재 상태: {isCompact ? "켜짐" : "꺼짐"}
                </p>
              </div>
              <Switch checked={isCompact} onCheckedChange={toggleCompact} />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">API 키</p>
                <p className="text-sm text-muted-foreground">sk_demo_••••••7890</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleCopyApiKey}>
                <Copy />
                복사
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>프로필</CardTitle>
            <CardDescription>
              react-hook-form + zod 검증 데모입니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
