import type { RefObject } from "react";
import { AgreementCheck } from "./agreement-check";
import { MobileStatusBar } from "./mobile-status-bar";
import { OptionalAgreementSection } from "./optional-agreement-section";
import { optionalAgreementGroups } from "./optional-agreement-data";
import styles from "./loan-prototype.module.css";

type OptionalAgreementScreenProps = {
  agreements: Record<string, boolean>;
  expandedGroups: Set<string>;
  allOptionalChecked: boolean;
  scrollRef: RefObject<HTMLDivElement | null>;
  onBack: () => void;
  onNext: () => void;
  onToggleAll: () => void;
  onToggleAgreement: (id: string) => void;
  onToggleChild: (id: string, child: string) => void;
  onToggleExpanded: (id: string) => void;
  onDocumentOpen: (title: string) => void;
};

export function OptionalAgreementScreen({
  agreements,
  expandedGroups,
  allOptionalChecked,
  scrollRef,
  onBack,
  onNext,
  onToggleAll,
  onToggleAgreement,
  onToggleChild,
  onToggleExpanded,
  onDocumentOpen,
}: OptionalAgreementScreenProps) {
  return (
    <div className={`${styles.appScreen} ${styles.optionalScreen}`}>
      <MobileStatusBar />
      <div className={styles.appNav}>
        <button type="button" className={styles.backButton} onClick={onBack} aria-label="필수동의로 돌아가기">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m15 4-8 8 8 8" />
          </svg>
        </button>
      </div>

      <div className={styles.agreementScroll} ref={scrollRef}>
        <header className={`${styles.loanTitle} ${styles.optionalTitle}`}>
          <span>선택동의</span>
          <h2>
            우대 혜택과 포인트를 함께
            <br />받아보세요
          </h2>
          <p>원하는 동의만 개별 선택할 수 있어요</p>
        </header>

        <aside className={styles.optionalNotice}>
          <strong>선택 약관에 동의하지 않으면?</strong>
          <p>추가대출, 금리인하 혜택 발생 시 안내받을 수 없어요.</p>
          <p>대출 상환 이자의 0.05%를 L.POINT로 적립 받을 수 없어요.</p>
        </aside>

        <section className={`${styles.agreementBlock} ${styles.optionalAgreementBlock}`}>
          <div className={styles.masterAgreementRow}>
            <AgreementCheck
              checked={allOptionalChecked}
              label={`선택 약관 모두 ${allOptionalChecked ? "동의 해제" : "동의"}`}
              onChange={onToggleAll}
              prominent
            />
            <strong>[선택]모두 동의하기</strong>
          </div>

          <div className={styles.agreementGroupList}>
            {optionalAgreementGroups.map((group) => (
              <OptionalAgreementSection
                key={group.id}
                group={group}
                agreements={agreements}
                expanded={expandedGroups.has(group.id)}
                onCheck={() => onToggleAgreement(group.id)}
                onChildCheck={(child) => onToggleChild(group.id, child)}
                onToggle={() => onToggleExpanded(group.id)}
                onDocumentOpen={onDocumentOpen}
              />
            ))}
          </div>
        </section>

        <div className={styles.optionalScrollSpacer} aria-hidden="true" />
      </div>

      <div className={styles.floatingNextArea}>
        <button type="button" className={styles.floatingNextButton} onClick={onNext}>
          <span>다음</span>
          <span className={styles.arrowCircle}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h13M13 6l6 6-6 6" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
}
