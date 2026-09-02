"use client";

import { useState } from "react";
import { ComparisonPanel } from "./comparison-panel";
import { ContentHeader } from "./content-header";
import { EmptyWorkspace } from "./empty-workspace";
import { Sidebar } from "./sidebar";
import { ToBePanel } from "./to-be-panel";

export type MenuId = "affiliate-credit" | "credit-consent" | "comparison";

const pageInformation: Record<
  MenuId,
  { eyebrow: string; title: string; description: string }
> = {
  "affiliate-credit": {
    eyebrow: "PROTOTYPE WORKSPACE",
    title: "to-be(제휴대출-신용)",
    description: "제휴 신용대출 신청 프로세스의 목표 화면을 확인할 수 있어요.",
  },
  "credit-consent": {
    eyebrow: "PROTOTYPE WORKSPACE",
    title: "to-be(신용정보조회동의)",
    description: "신용정보조회동의 프로토타입을 구성할 영역입니다.",
  },
  comparison: {
    eyebrow: "COMPARISON VIEW",
    title: "비교",
    description: "프로토타입 화면을 나란히 비교할 수 있는 영역입니다.",
  },
};

export function AppShell() {
  const [activeMenu, setActiveMenu] = useState<MenuId>("affiliate-credit");
  const page = pageInformation[activeMenu];

  return (
    <div className="app-shell">
      <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />

      <main className="main-content">
        <div className="content-container">
          <ContentHeader
            eyebrow={page.eyebrow}
            title={page.title}
            description={page.description}
          />

          <div className="panel-transition" key={activeMenu}>
            {activeMenu === "affiliate-credit" ? (
              <ToBePanel />
            ) : activeMenu === "credit-consent" ? (
              <EmptyWorkspace
                label="to-be(신용정보조회동의)"
                description="아직 구현된 화면이 없습니다."
              />
            ) : (
              <ComparisonPanel />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
