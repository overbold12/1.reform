import Image from "next/image";
import signingStartImage from "../../../references/to-be(platform)/start.png";
import myDataImage from "../../../references/to-be(platform)/image-mydata.png";
import { AnimatedProgress } from "./animated-progress";
import { FlowScreen } from "./flow-navigation";
import { LoadingSpinner } from "./loading-spinner";
import { MobileStatusBar } from "./mobile-status-bar";
import styles from "./loan-prototype.module.css";

type PublicDataEntryScreenProps = {
  onBack: () => void;
};

export function PublicDataEntryScreen({ onBack }: PublicDataEntryScreenProps) {
  return (
    <FlowScreen onBack={onBack} backLabel="인증번호 입력으로 돌아가기">
      <div className={styles.publicDataEntryContent}>
        <h2>
          서류조회 전, 전자서명부터
          <br />진행해볼까요?
        </h2>
        <p>
          곧 전자서명이 진행됩니다.
          <br />잠시만 기다려주세요
        </p>
        <Image
          className={styles.signingIllustration}
          src={signingStartImage}
          alt=""
        />
      </div>
    </FlowScreen>
  );
}

type CertificateSelectionSheetProps = {
  onClose: () => void;
  onSelect: () => void;
};

const certificates = [
  { id: "kakao", label: "카카오 인증서" },
  { id: "toss", label: "토스 인증서" },
  {
    id: "joint",
    label: "공동인증서",
    detail: "최초 사용 시 PC에서 가져와야 해요",
  },
] as const;

function CertificateIcon({ type }: { type: (typeof certificates)[number]["id"] }) {
  if (type === "kakao") {
    return <span className={`${styles.certificateIcon} ${styles.kakaoIcon}`}>TALK</span>;
  }

  if (type === "toss") {
    return (
      <span className={`${styles.certificateIcon} ${styles.tossIcon}`} aria-hidden="true">
        <i />
        <i />
      </span>
    );
  }

  return (
    <span className={`${styles.certificateIcon} ${styles.jointIcon}`} aria-hidden="true">
      <svg viewBox="0 0 28 28">
        <path d="M7 3.5h9l5 5V23H7z" />
        <path d="M16 3.5v5h5M10 12h7M10 15h6" />
        <rect x="15" y="17" width="9" height="7" rx="1.5" />
        <path d="M17.5 17v-1.5a2 2 0 0 1 4 0V17" />
      </svg>
    </span>
  );
}

export function CertificateSelectionSheet({
  onClose,
  onSelect,
}: CertificateSelectionSheetProps) {
  return (
    <div className={styles.sheetLayer} role="dialog" aria-modal="true" aria-labelledby="certificate-title">
      <div className={styles.dimLayer} aria-hidden="true" />
      <section className={`${styles.bottomSheet} ${styles.certificateSheet}`}>
        <div className={styles.certificateHeader}>
          <h2 id="certificate-title">사용하실 인증서 종류를 선택해주세요.</h2>
          <button type="button" onClick={onClose} aria-label="인증서 선택 닫기">×</button>
        </div>
        <div className={styles.certificateList}>
          {certificates.map((certificate) => (
            <button
              type="button"
              className={styles.certificateOption}
              key={certificate.id}
              onClick={onSelect}
            >
              <CertificateIcon type={certificate.id} />
              <span>
                <strong>{certificate.label}</strong>
                {"detail" in certificate ? (
                  <small>{certificate.detail}</small>
                ) : null}
              </span>
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3.5 4.5 4.5L6 12.5" /></svg>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

type PublicDataReceiveScreenProps = {
  onComplete: () => void;
};

export function PublicDataReceiveScreen({
  onComplete,
}: PublicDataReceiveScreenProps) {
  return (
    <div className={`${styles.appScreen} ${styles.flowScreen}`}>
      <MobileStatusBar />
      <div className={styles.receiveContent}>
        <h2>
          기관에서 서류를
          <br />가져오고 있어요.
        </h2>
        <p>지금 앱을 끄면 서류 수신이 중단돼요.</p>

        <AnimatedProgress
          durationMs={3600}
          label="공공마이데이터 서류 수신 진행률"
          onComplete={onComplete}
        />

        <Image
          className={styles.myDataIllustration}
          src={myDataImage}
          alt="기관 서류로 한도는 늘리고 금리는 낮출 수 있어요"
        />
        <LoadingSpinner label="서류 수신 중" className={styles.processingSpinner} />
      </div>
      <div className={styles.homeIndicator} aria-hidden="true" />
    </div>
  );
}

type ScreeningScreenProps = {
  onComplete: () => void;
};

export function ScreeningScreen({ onComplete }: ScreeningScreenProps) {
  return (
    <div className={`${styles.appScreen} ${styles.flowScreen}`}>
      <MobileStatusBar />
      <div className={`${styles.receiveContent} ${styles.screeningContent}`}>
        <h2>
          김롯데님을 위한
          <br />최대한도와 금리를
          <br />계산하고 있어요
        </h2>
        <p>지금 앱을 끄면 처음부터 진행해야 돼요.</p>

        <AnimatedProgress
          durationMs={5200}
          label="대출 심사 진행률"
          onComplete={onComplete}
        />

        <div className={styles.limitGauge} aria-hidden="true" />
        <p className={styles.screeningNotice}>
          한도조회만으로는 신용점수에
          <br />영향을 주지 않아요.
        </p>
        <LoadingSpinner label="대출 심사 중" className={styles.processingSpinner} />
      </div>
      <div className={styles.homeIndicator} aria-hidden="true" />
    </div>
  );
}
