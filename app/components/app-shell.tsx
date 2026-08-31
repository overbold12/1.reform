"use client";

import { useState } from "react";
import { ComparisonPanel } from "./comparison-panel";
import { ContentHeader } from "./content-header";
import { Sidebar } from "./sidebar";
import { ToBePanel } from "./to-be-panel";

export type MenuId = "to-be" | "comparison";

const pageInformation: Record<
  MenuId,
  { eyebrow: string; title: string; description: string }
> = {
  "to-be": {
    eyebrow: "PROTOTYPE WORKSPACE",
    title: "TO-BE",
    description: "개선된 모바일 앱 서비스의 목표 화면을 구성하는 영역입니다.",
  },
  comparison: {
    eyebrow: "COMPARISON VIEW",
    title: "비교",
    description: "기존 화면과 개선안을 나란히 검토하는 영역입니다.",
  },
};

export function AppShell() {
  const [activeMenu, setActiveMenu] = useState<MenuId>("to-be");
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
            {activeMenu === "to-be" ? <ToBePanel /> : <ComparisonPanel />}
          </div>
        </div>
      </main>
    </div>
  );
}
