import styles from "./loan-prototype.module.css";

type AgreementCheckProps = {
  checked: boolean;
  label: string;
  onChange: () => void;
  prominent?: boolean;
  visibleLabel?: string;
};

export function AgreementCheck({
  checked,
  label,
  onChange,
  prominent = false,
  visibleLabel,
}: AgreementCheckProps) {
  if (visibleLabel) {
    return (
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        aria-label={label}
        className={styles.checkTouchArea}
        onClick={onChange}
      >
        <span
          className={`${styles.checkButton} ${checked ? styles.checked : ""} ${
            prominent ? styles.prominentCheck : ""
          }`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 20 20">
            <path d="m5.2 10.1 3.1 3.1 6.5-7" />
          </svg>
        </span>
        <span>{visibleLabel}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      className={`${styles.checkButton} ${checked ? styles.checked : ""} ${
        prominent ? styles.prominentCheck : ""
      }`}
      onClick={onChange}
    >
      <svg viewBox="0 0 20 20" aria-hidden="true">
        <path d="m5.2 10.1 3.1 3.1 6.5-7" />
      </svg>
    </button>
  );
}
