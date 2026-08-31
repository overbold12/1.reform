import type { RefObject } from "react";
import {
  loanAgreementGroups,
  publicDataAgreementGroups,
} from "./agreement-data";
import { AgreementCheck } from "./agreement-check";
import { AgreementSection } from "./agreement-section";
import { MobileStatusBar } from "./mobile-status-bar";
import styles from "./loan-prototype.module.css";

type RequiredAgreementScreenProps = {
  agreements: Record<string, boolean>;
  expandedGroups: Set<string>;
  allLoanAgreementsChecked: boolean;
  allRequiredChecked: boolean;
  scrollRef: RefObject<HTMLDivElement | null>;
  onBack: () => void;
  onToggleLoanAll: () => void;
  onToggleAgreement: (id: string) => void;
  onToggleExpanded: (id: string) => void;
  onDocumentOpen: (title: string) => void;
};

export function RequiredAgreementScreen({
  agreements,
  expandedGroups,
  allLoanAgreementsChecked,
  allRequiredChecked,
  scrollRef,
  onBack,
  onToggleLoanAll,
  onToggleAgreement,
  onToggleExpanded,
  onDocumentOpen,
}: RequiredAgreementScreenProps) {
  return (
    <div className={styles.appScreen}>
      <MobileStatusBar />
      <div className={styles.appNav}>
        <button type="button" className={styles.backButton} onClick={onBack} aria-label="동의서 종류 선택으로 돌아가기">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m15 4-8 8 8 8" />
          </svg>
        </button>
      </div>

      <div className={styles.agreementScroll} ref={scrollRef}>
        <header className={styles.loanTitle}>
          <span>필수동의</span>
          <h2>
            대출 신청에 필요한
            <br />필수 동의예요
          </h2>
        </header>

        <section className={styles.agreementBlock}>
          <div className={styles.masterAgreementRow}>
            <AgreementCheck
              checked={allLoanAgreementsChecked}
              label={`대출조회 필수 동의 ${allLoanAgreementsChecked ? "해제" : "선택"}`}
              onChange={onToggleLoanAll}
              prominent
            />
            <strong>대출조회 필수 동의</strong>
          </div>

          <div className={styles.agreementGroupList}>
            {loanAgreementGroups.map((group) => (
              <AgreementSection
                key={group.id}
                group={group}
                checked={Boolean(agreements[group.id])}
                expanded={expandedGroups.has(group.id)}
                onCheck={() => onToggleAgreement(group.id)}
                onToggle={() => onToggleExpanded(group.id)}
                onDocumentOpen={onDocumentOpen}
              />
            ))}
          </div>
        </section>

        <section className={`${styles.agreementBlock} ${styles.publicDataBlock}`}>
          <h3>공공마이데이터 활용 필수 동의</h3>
          <p>안전한 서류 확인을 위해 항목별 동의가 필요합니다</p>

          <div className={styles.agreementGroupList}>
            {publicDataAgreementGroups.map((group) => (
              <AgreementSection
                key={group.id}
                group={group}
                checked={Boolean(agreements[group.id])}
                expanded={expandedGroups.has(group.id)}
                onCheck={() => onToggleAgreement(group.id)}
                onToggle={() => onToggleExpanded(group.id)}
                onDocumentOpen={onDocumentOpen}
              />
            ))}
          </div>
        </section>

        <div className={styles.scopeEnd}>
          <span>PROTOTYPE STEP 02</span>
          <strong>필수동의 단계까지 구현되었습니다</strong>
          <p>다음 신청 단계는 아직 연결되지 않았습니다.</p>
        </div>
      </div>

      {allRequiredChecked ? (
        <div className={styles.completionToast} role="status">
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="m5.2 10.1 3.1 3.1 6.5-7" />
          </svg>
          <span>
            <strong>필수 동의가 완료되었습니다</strong>
            <small>현재 프로토타입은 여기까지입니다.</small>
          </span>
        </div>
      ) : null}
    </div>
  );
}
