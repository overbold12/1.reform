import type { ReactNode } from "react";
import { MobileStatusBar } from "./mobile-status-bar";
import styles from "./loan-prototype.module.css";

type FlowScreenProps = {
  children: ReactNode;
  onBack: () => void;
  backLabel: string;
};

export function FlowScreen({ children, onBack, backLabel }: FlowScreenProps) {
  return (
    <div className={`${styles.appScreen} ${styles.flowScreen}`}>
      <MobileStatusBar />
      <div className={styles.appNav}>
        <button
          type="button"
          className={styles.backButton}
          onClick={onBack}
          aria-label={backLabel}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m15 4-8 8 8 8" />
          </svg>
        </button>
      </div>
      {children}
      <div className={styles.homeIndicator} aria-hidden="true" />
    </div>
  );
}

type InlineNextButtonProps = {
  label: string;
  disabled?: boolean;
  onClick: () => void;
};

export function InlineNextButton({
  label,
  disabled = false,
  onClick,
}: InlineNextButtonProps) {
  return (
    <button
      type="button"
      className={styles.inlineNextButton}
      disabled={disabled}
      onClick={onClick}
    >
      <span>{label}</span>
      <span className={styles.arrowCircle}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12h13M13 6l6 6-6 6" />
        </svg>
      </span>
    </button>
  );
}
