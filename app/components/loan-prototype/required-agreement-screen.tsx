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
  onContinue: () => void;
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
  onContinue,
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

        <div className={styles.requiredScrollSpacer} aria-hidden="true" />
      </div>

      {allRequiredChecked ? (
        <div className={styles.floatingNextArea}>
          <button type="button" className={styles.floatingNextButton} onClick={onContinue}>
            <span>다음</span>
            <span className={styles.arrowCircle}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
