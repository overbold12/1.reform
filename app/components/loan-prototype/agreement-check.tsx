import styles from "./loan-prototype.module.css";

type AgreementCheckProps = {
  checked: boolean;
  label: string;
  onChange: () => void;
  prominent?: boolean;
};

export function AgreementCheck({
  checked,
  label,
  onChange,
  prominent = false,
}: AgreementCheckProps) {
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
