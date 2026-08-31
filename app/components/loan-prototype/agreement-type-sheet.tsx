import styles from "./loan-prototype.module.css";

export type AgreementType = "summary" | "full";

type AgreementTypeSheetProps = {
  selectedType: AgreementType;
  onSelect: (type: AgreementType) => void;
  onConfirm: () => void;
};

const options: Array<{
  id: AgreementType;
  label: string;
  description?: string;
}> = [
  {
    id: "summary",
    label: "요약동의서로 볼게요",
    description: "핵심 내용을 간결하게 확인해요",
  },
  { id: "full", label: "전체동의서로 볼게요" },
];

export function AgreementTypeSheet({
  selectedType,
  onSelect,
  onConfirm,
}: AgreementTypeSheetProps) {
  return (
    <div className={styles.sheetLayer} role="dialog" aria-modal="true">
      <div className={styles.dimLayer} aria-hidden="true" />
      <section className={styles.bottomSheet} aria-labelledby="sheet-title">
        <div className={styles.sheetHandle} aria-hidden="true" />
        <h2 id="sheet-title">동의서 종류를 선택해주세요</h2>
        <p>
          요약동의서는 전체동의서의 핵심내용을
          <br />알기 쉽게 요약한 동의서입니다
        </p>

        <div className={styles.radioList} role="radiogroup" aria-label="동의서 종류">
          {options.map((option) => {
            const selected = option.id === selectedType;
            return (
              <button
                type="button"
                role="radio"
                aria-checked={selected}
                className={styles.radioOption}
                key={option.id}
                onClick={() => onSelect(option.id)}
              >
                <span className={`${styles.radioMark} ${selected ? styles.radioSelected : ""}`}>
                  <svg viewBox="0 0 20 20" aria-hidden="true">
                    <path d="m5.3 10.1 3 3 6.4-7" />
                  </svg>
                </span>
                <span>
                  <strong>{option.label}</strong>
                  {option.description ? <small>{option.description}</small> : null}
                </span>
              </button>
            );
          })}
        </div>

        <button type="button" className={styles.confirmButton} onClick={onConfirm}>
          확인
        </button>
      </section>
    </div>
  );
}
