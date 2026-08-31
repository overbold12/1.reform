import { MobileStatusBar } from "./mobile-status-bar";
import styles from "./loan-prototype.module.css";

type AgreementDetailProps = {
  title: string;
  onClose: () => void;
};

export function AgreementDetail({ title, onClose }: AgreementDetailProps) {
  return (
    <section className={styles.detailScreen} aria-label={`${title} 상세`}>
      <MobileStatusBar />
      <div className={styles.detailNav}>
        <button type="button" className={styles.backButton} onClick={onClose} aria-label="동의서 목록으로 돌아가기">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m15 4-8 8 8 8" />
          </svg>
        </button>
        <strong>약관 상세</strong>
        <span />
      </div>

      <div className={styles.detailScroll}>
        <p className={styles.detailEyebrow}>필수 동의서</p>
        <h2>{title}</h2>
        <p className={styles.detailIntro}>
          대출 서비스 제공을 위해 아래 내용을 확인해 주세요.
        </p>

        <article className={styles.termsArticle}>
          <h3>수집 및 이용 목적</h3>
          <p>
            대출 상담, 계약 체결 및 이행, 금융거래 설정과 유지, 본인 확인을
            위해 필요한 정보를 처리합니다.
          </p>
          <h3>수집하는 정보</h3>
          <p>
            성명, 연락처, 개인식별정보 및 서비스 이용 과정에서 생성되는
            거래 관련 정보가 포함될 수 있습니다.
          </p>
          <h3>보유 및 이용 기간</h3>
          <p>
            관련 법령과 내부 기준에서 정한 기간 동안 보유하며, 목적이
            달성된 정보는 안전한 방법으로 파기합니다.
          </p>
          <div className={styles.termsNotice}>
            본 화면은 기획 시연을 위한 요약 예시이며 실제 약관 효력은 없습니다.
          </div>
        </article>
      </div>

      <div className={styles.detailFooter}>
        <button type="button" className={styles.confirmButton} onClick={onClose}>
          확인
        </button>
      </div>
    </section>
  );
}
