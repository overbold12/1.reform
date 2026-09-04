"use client";

import { useState } from "react";
import { comparisonServices, type ServiceId } from "./comparison-data";
import {
  ComparisonSection,
  ComparisonSummary,
  FlowComparison,
  InteractiveComparison,
} from "./comparison-sections";
import { ServiceComparisonTabs } from "./service-comparison-tabs";
import styles from "./comparison.module.css";

const services = Object.values(comparisonServices);

export function ComparisonPage() {
  const [activeServiceId, setActiveServiceId] = useState<ServiceId>("partnerLoan");
  const activeService = comparisonServices[activeServiceId];

  return (
    <section className={`workspace-card ${styles.comparisonWorkspace}`}>
      <div className={styles.pageHeader}>
        <div>
          <span className="workspace-kicker">SERVICE COMPARISON</span>
          <h2>AS-IS / TO-BE 비교</h2>
        </div>
        <span className={styles.skeletonBadge}>CONTENT SKELETON</span>
      </div>

      <ServiceComparisonTabs
        services={services}
        activeService={activeServiceId}
        onServiceChange={setActiveServiceId}
      />

      <div
        className={styles.servicePanel}
        role="tabpanel"
        id={`service-panel-${activeService.id}`}
        aria-labelledby={`service-tab-${activeService.id}`}
        key={activeService.id}
      >
        <div className={styles.serviceHeading}>
          <span>선택 서비스</span>
          <h2>{activeService.title}</h2>
        </div>

        <ComparisonSection
          number="01"
          title="개선 요약"
          description="핵심 개선 메시지와 주요 지표를 배치하는 영역입니다."
        >
          <ComparisonSummary summary={activeService.summary} />
        </ComparisonSection>

        <ComparisonSection
          number="02"
          title="주요 절차 비교"
          description="서비스의 주요 절차를 AS-IS와 TO-BE로 나누어 비교합니다."
        >
          <FlowComparison asIsFlow={activeService.asIsFlow} toBeFlow={activeService.toBeFlow} />
        </ComparisonSection>

        <ComparisonSection
          number="03"
          title="인터랙션 비교"
          description="여러 AS-IS 화면이 하나의 TO-BE 화면으로 통합되는 과정을 비교합니다."
        >
          <InteractiveComparison items={activeService.comparisonItems} />
        </ComparisonSection>
      </div>
    </section>
  );
}
