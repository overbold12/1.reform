import { AgreementCheck } from "./agreement-check";
import {
  optionalChildId,
  type OptionalAgreementGroup,
} from "./optional-agreement-data";
import styles from "./loan-prototype.module.css";

type OptionalAgreementSectionProps = {
  group: OptionalAgreementGroup;
  agreements: Record<string, boolean>;
  expanded: boolean;
  onCheck: () => void;
  onChildCheck: (child: string) => void;
  onToggle: () => void;
  onDocumentOpen: (title: string) => void;
};

export function OptionalAgreementSection({
  group,
  agreements,
  expanded,
  onCheck,
  onChildCheck,
  onToggle,
  onDocumentOpen,
}: OptionalAgreementSectionProps) {
  return (
    <div className={styles.agreementSection}>
      <div className={styles.agreementHeadingRow}>
        <AgreementCheck
          checked={Boolean(agreements[group.id])}
          label={`${group.title} ${agreements[group.id] ? "동의 해제" : "동의"}`}
          onChange={onCheck}
        />
        <button
          type="button"
          className={styles.accordionButton}
          aria-expanded={expanded}
          onClick={onToggle}
        >
          <span>{group.title}</span>
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
          {group.children.map((child) =>
            group.kind === "channels" ? (
              <button
                type="button"
                role="checkbox"
                aria-checked={Boolean(agreements[optionalChildId(group.id, child)])}
                className={`${styles.channelRow} ${
                  agreements[optionalChildId(group.id, child)]
                    ? styles.channelChecked
                    : ""
                }`}
                key={child}
                onClick={() => onChildCheck(child)}
              >
                <svg viewBox="0 0 18 18" aria-hidden="true">
                  <path d="m4.6 9.1 2.8 2.8 6-6.2" />
                </svg>
                <span>{child}</span>
              </button>
            ) : (
              <button
                type="button"
                className={styles.documentRow}
                key={child}
                onClick={() => onDocumentOpen(child)}
              >
                <span>·&nbsp; {child}</span>
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path d="m6 3.5 4.5 4.5L6 12.5" />
                </svg>
              </button>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
