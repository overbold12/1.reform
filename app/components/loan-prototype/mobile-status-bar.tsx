import styles from "./loan-prototype.module.css";

export function MobileStatusBar() {
  return (
    <div className={styles.statusBar} aria-label="모바일 상태 표시줄">
      <strong>9:41</strong>
      <div className={styles.statusIcons} aria-hidden="true">
        <span className={styles.signalIcon} />
        <svg className={styles.wifiIcon} viewBox="0 0 18 14">
          <path d="M1.5 4.8C5.7 1.2 12.3 1.2 16.5 4.8M4.3 7.7c2.6-2.1 6.8-2.1 9.4 0M7.2 10.5c1-.7 2.6-.7 3.6 0" />
          <circle cx="9" cy="12" r="1" />
        </svg>
        <span className={styles.batteryIcon} />
      </div>
    </div>
  );
}
