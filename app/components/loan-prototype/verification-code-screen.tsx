import type { ChangeEvent } from "react";
import Image from "next/image";
import stopWarningImage from "../../../references/to-be(platform)/Stop-4.png";
import { FlowScreen, InlineNextButton } from "./flow-navigation";
import styles from "./loan-prototype.module.css";

type VerificationCodeScreenProps = {
  code: string;
  onCodeChange: (code: string) => void;
  onBack: () => void;
  onNext: () => void;
};

export function VerificationCodeScreen({
  code,
  onCodeChange,
  onBack,
  onNext,
}: VerificationCodeScreenProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onCodeChange(event.target.value.replace(/\D/g, "").slice(0, 6));
  }

  return (
    <FlowScreen onBack={onBack} backLabel="주민등록번호 입력으로 돌아가기">
      <div className={styles.verificationContent}>
        <label className={styles.inputLabel} htmlFor="verification-code">
          인증번호를 입력해주세요
        </label>
        <input
          id="verification-code"
          className={styles.identityTextInput}
          value={code}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          onChange={handleChange}
        />

        <button
          type="button"
          className={styles.resendButton}
          onClick={() => onCodeChange("")}
        >
          인증번호 재전송
        </button>

        <Image
          className={styles.fraudWarningImage}
          src={stopWarningImage}
          alt="로또 피해 및 코인 손실 보상, 검사 및 금감원 재산 보호 및 무죄 증명에 의한 대출 진행은 100% 보이스피싱입니다."
        />

        {code.length === 6 ? (
          <div className={styles.inlineActionArea}>
            <InlineNextButton label="다음" onClick={onNext} />
          </div>
        ) : null}
      </div>
    </FlowScreen>
  );
}
