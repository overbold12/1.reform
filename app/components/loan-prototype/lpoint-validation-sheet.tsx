import styles from "./loan-prototype.module.css";

type LpointValidationSheetProps = {
  onClose: () => void;
};

export function LpointValidationSheet({ onClose }: LpointValidationSheetProps) {
  return (
    <div
      className={styles.sheetLayer}
      role="dialog"
      aria-modal="true"
      aria-describedby="lpoint-sheet-message"
    >
      <button
        type="button"
        className={styles.dismissibleDim}
        onClick={onClose}
        aria-label="안내 닫기"
      />
      <section className={`${styles.bottomSheet} ${styles.validationSheet}`}>
        <div className={styles.sheetHandle} aria-hidden="true" />
        <p id="lpoint-sheet-message">
          L.POINT 적립 혜택을 받기 위해선 ‘롯데멤버스 제공
          동의(L.POINT)’와 ‘개인정보 수집·이용·제공 동의(L.POINT)’ 항목
          동의가 필요해요
        </p>
        <button type="button" className={styles.confirmButton} onClick={onClose}>
          확인
        </button>
      </section>
    </div>
  );
}
