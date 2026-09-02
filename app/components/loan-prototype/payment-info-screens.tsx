"use client";

import Image from "next/image";
import { type ReactNode } from "react";
import stopImage from "../../../references/to-be/Stop-4.png";
import { MobileStatusBar } from "./mobile-status-bar";
import styles from "./loan-prototype.module.css";

export type PrepaymentBenefit = "interest" | "late-fee";

export type BankId =
  | "kdb" | "ibk" | "kb" | "shinhan" | "keb" | "suhyup"
  | "nh" | "nh-local" | "woori" | "sc" | "post" | "citi"
  | "im" | "busan" | "gwangju" | "jeju" | "jeonbuk" | "gyeongnam"
  | "saemaeul" | "shinhyup" | "hsbc" | "kbank" | "kakao" | "toss";

const BANKS: Array<{ id: BankId; name: string; mark: string; color: string; wordmark?: boolean }> = [
  { id: "kdb", name: "산업은행", mark: "◆", color: "#0066a7" },
  { id: "ibk", name: "기업은행", mark: "IBK", color: "#0067b1", wordmark: true },
  { id: "kb", name: "국민은행", mark: "✳", color: "#e6b900" },
  { id: "shinhan", name: "신한은행", mark: "◉", color: "#0572b9" },
  { id: "keb", name: "KEB하나은행", mark: "1Q", color: "#009490", wordmark: true },
  { id: "suhyup", name: "수협", mark: "≋", color: "#1574b8" },
  { id: "nh", name: "NH농협은행", mark: "NH", color: "#e9b900", wordmark: true },
  { id: "nh-local", name: "농협(단위조합)", mark: "NH", color: "#d7a800", wordmark: true },
  { id: "woori", name: "우리은행", mark: "◒", color: "#0087ce" },
  { id: "sc", name: "SC제일은행", mark: "≋", color: "#00a784" },
  { id: "post", name: "우체국", mark: "우", color: "#ef4738" },
  { id: "citi", name: "한국씨티", mark: "citi", color: "#003b70", wordmark: true },
  { id: "im", name: "iM뱅크(대구)", mark: "iM", color: "#00ad8d", wordmark: true },
  { id: "busan", name: "부산은행", mark: "BNK", color: "#e4232d", wordmark: true },
  { id: "gwangju", name: "광주은행", mark: "◆", color: "#1668ad" },
  { id: "jeju", name: "제주은행", mark: "◉", color: "#0572b9" },
  { id: "jeonbuk", name: "전북은행", mark: "◆", color: "#23659b" },
  { id: "gyeongnam", name: "경남은행", mark: "BNK", color: "#e4232d", wordmark: true },
  { id: "saemaeul", name: "새마을금고", mark: "♣", color: "#007eb9" },
  { id: "shinhyup", name: "신협", mark: "신협", color: "#1d65a8", wordmark: true },
  { id: "hsbc", name: "HSBC", mark: "◆", color: "#db0011" },
  { id: "kbank", name: "케이뱅크", mark: "K", color: "#5834a5" },
  { id: "kakao", name: "카카오뱅크", mark: "B", color: "#171717" },
  { id: "toss", name: "토스뱅크", mark: "◒", color: "#315efb" },
];

function PaymentScreenShell({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <div className={`${styles.appScreen} ${styles.paymentScreen}`}>
      <header className={styles.paymentHeader}>
        <MobileStatusBar inverse />
        <div className={styles.paymentNav}>
          <button type="button" className={styles.paymentCloseButton} onClick={onClose} aria-label="결제정보 입력 닫기">
            <span /><span />
          </button>
          <div className={styles.paymentStep} aria-label="대출 신청 5단계 중 2단계 결제정보">
            <i aria-hidden="true" /><b>2</b><strong>결제정보</strong>
            <span>3</span><span>4</span><span>5</span>
          </div>
        </div>
      </header>
      <main className={styles.paymentPanel}>
        <div className={styles.paymentHandle} aria-hidden="true" />
        {children}
      </main>
      <div className={styles.homeIndicator} aria-hidden="true" />
    </div>
  );
}

export function PrepaymentBenefitScreen({
  selectedBenefit, onBenefitChange, onBack, onNext,
}: {
  selectedBenefit: PrepaymentBenefit | null;
  onBenefitChange: (benefit: PrepaymentBenefit) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <PaymentScreenShell onClose={onBack}>
      <section className={styles.prepaymentContent}>
        <h1>자동이체 결제일은 매달 1일입니다</h1>
        <p>대출상세보기 - 대출관리에서 결제일보다 미리<br />입금하실 날짜를 지정 할 수 있습니다.</p>
        <h2>결제일보다 미리 입금하실 경우<br />받으실 혜택을 선택해주세요</h2>
        <div className={styles.prepaymentOptions} role="radiogroup" aria-label="선납 혜택 선택">
          <button type="button" role="radio" aria-checked={selectedBenefit === "interest"}
            className={selectedBenefit === "interest" ? styles.prepaymentSelected : ""}
            onClick={() => onBenefitChange("interest")}>
            <span className={styles.prepaymentCheck} aria-hidden="true">✓</span>
            <span><strong>선납적립</strong><small>결제일보다 미리 입금 하신 금액에 대해 소정의 이자를<br />더하여 다음 회차 원리금 상환 금액에서 차감하여 청구<br />합니다.</small></span>
          </button>
          <button type="button" role="radio" aria-checked={selectedBenefit === "late-fee"}
            className={selectedBenefit === "late-fee" ? styles.prepaymentSelected : ""}
            onClick={() => onBenefitChange("late-fee")}>
            <span className={styles.prepaymentCheck} aria-hidden="true">✓</span>
            <span><strong>연체이자면제</strong><small>결제일보다 미리 입금하신 일 수 만큼 연체 발생시<br />연체이자를 면제해드립니다.</small></span>
          </button>
        </div>
        {selectedBenefit ? (
          <button type="button" className={styles.paymentNextButton} onClick={onNext}>
            <span>다음</span><span className={styles.paymentArrow} aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6" /></svg></span>
          </button>
        ) : null}
      </section>
    </PaymentScreenShell>
  );
}

export function BankSelectionScreen({ selectedBank, onBankChange, onBack, onNext }: {
  selectedBank: BankId | null;
  onBankChange: (bank: BankId) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <PaymentScreenShell onClose={onBack}>
      <section className={styles.bankSelectionContent}>
        <h1>결제할 계좌의<br />은행을 선택해주세요</h1>
        <div className={styles.bankGrid} role="radiogroup" aria-label="자동이체 은행 선택">
          {BANKS.map((bank) => (
            <button type="button" key={bank.id}
              className={selectedBank === bank.id ? styles.bankSelected : ""}
              role="radio" aria-checked={selectedBank === bank.id}
              onClick={() => onBankChange(bank.id)}>
              <span
                className={`${styles.bankLogo} ${bank.wordmark ? styles.bankWordmark : ""}`}
                style={{ color: bank.color }}
                aria-hidden="true"
              >
                {bank.mark}
              </span>
              <span className={styles.bankName}>{bank.name}</span>
              {selectedBank === bank.id ? <i className={styles.bankBullet} aria-hidden="true" /> : null}
            </button>
          ))}
        </div>
        {selectedBank ? (
          <button type="button" className={styles.paymentNextButton} onClick={onNext}>
            <span>다음</span><span className={styles.paymentArrow} aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6" /></svg></span>
          </button>
        ) : null}
      </section>
    </PaymentScreenShell>
  );
}

export function AccountNumberScreen({ accountNumber, agreed, onAccountNumberChange, onAgreementChange, onBack }: {
  accountNumber: string;
  agreed: boolean;
  onAccountNumberChange: (value: string) => void;
  onAgreementChange: (agreed: boolean) => void;
  onBack: () => void;
}) {
  const canShowNext = accountNumber.length > 0 && agreed;

  return (
    <PaymentScreenShell onClose={onBack}>
      <section className={styles.accountContent}>
        <label htmlFor="payment-account-number">계좌번호를 입력해주세요</label>
        <input id="payment-account-number" type="text" inputMode="numeric" autoComplete="off"
          value={accountNumber} maxLength={16}
          onChange={(event) => onAccountNumberChange(event.target.value.replace(/\D/g, "").slice(0, 16))} />
        <button type="button" role="checkbox" aria-checked={agreed} className={styles.accountAgreement}
          onClick={() => onAgreementChange(!agreed)}>
          <span className={agreed ? styles.accountAgreementChecked : ""} aria-hidden="true">✓</span>
          <strong>자동이체 신청 약관 동의</strong>
          <svg viewBox="0 0 12 20" aria-hidden="true"><path d="m2 2 7 8-7 8" /></svg>
        </button>
        <Image className={styles.accountStopImage} src={stopImage}
          alt="로또 피해 및 코인 손실 보상, 검사 및 금감원 재산 보호 등을 주장하는 대출 전화는 보이스피싱입니다." priority />
        {canShowNext ? (
          <button type="button" className={styles.paymentNextButton}
            aria-label="다음 단계는 프로토타입 범위에 포함되지 않습니다">
            <span>다음</span><span className={styles.paymentArrow} aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6" /></svg></span>
          </button>
        ) : null}
      </section>
    </PaymentScreenShell>
  );
}
