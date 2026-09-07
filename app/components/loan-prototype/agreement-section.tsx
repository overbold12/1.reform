import type { AgreementGroup } from "./agreement-data";
import { AgreementCheck } from "./agreement-check";
import styles from "./loan-prototype.module.css";

type AgreementSectionProps = {
  group: AgreementGroup;
  checked: boolean;
  expanded: boolean;
  onCheck: () => void;
  onToggle: () => void;
  onDocumentOpen: (documentTitle: string) => void;
};

export function AgreementSection({
  group,
  checked,
  expanded,
  onCheck,
  onToggle,
  onDocumentOpen,
}: AgreementSectionProps) {
  return (
    <div className={styles.agreementSection}>
      <div className={styles.agreementHeadingRow}>
        <AgreementCheck
          checked={checked}
          label={`${group.title} ${checked ? "동의 해제" : "동의"}`}
          onChange={onCheck}
          visibleLabel={group.title}
        />
        <button
          type="button"
          className={styles.chevronButton}
          aria-expanded={expanded}
          aria-label={`${group.title} ${expanded ? "동의서 닫기" : "동의서 열기"}`}
          onClick={onToggle}
        >
          <svg
            className={expanded ? styles.chevronOpen : ""}
            viewBox="0 0 16 16"
            aria-hidden="true"
          >
            <path d="m4 6 4 4 4-4" />
          </svg>
        </button>
      </div>

      <div
        className={`${styles.documentList} ${expanded ? styles.documentListOpen : ""}`}
      >
        <div>
          {group.documents.map((documentTitle) => (
            <div className={styles.documentRow} key={documentTitle}>
              <span>·&nbsp; {documentTitle}</span>
              <button
                type="button"
                className={styles.detailChevronButton}
                aria-label={`${documentTitle} 상세보기`}
                onClick={() => onDocumentOpen(documentTitle)}
              >
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path d="m6 3.5 4.5 4.5L6 12.5" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
