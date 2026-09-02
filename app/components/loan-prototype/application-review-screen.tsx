"use client";

import type { AgreementType } from "./agreement-type-sheet";
import type { RepaymentMethod } from "./loan-condition-screen";
import {
  ANNUAL_RATE,
  calculateEqualPrincipalFirstPayment,
  calculateMonthlyPayment,
} from "./loan-terms";
import { MobileStatusBar } from "./mobile-status-bar";
import {
  getBankName,
  type BankId,
  type InvoiceDestination,
  type PrepaymentBenefit,
} from "./payment-info-screens";
import styles from "./loan-prototype.module.css";

function formatWon(value: number) {
  return `${Math.round(value).toLocaleString()}원`;
}

const INVOICE_LABELS: Record<InvoiceDestination, string> = {
  home: "자택",
  office: "직장",
  none: "받지 않음",
};

const PREPAYMENT_LABELS: Record<PrepaymentBenefit, string> = {
  interest: "선납적립",
  "late-fee": "연체이자면제",
};

export function ApplicationReviewScreen({
  customerName,
  amountManwon,
  periodMonths,
  bank,
  accountNumber,
  repaymentMethod,
  prepaymentBenefit,
  invoiceDestination,
  email,
  agreementType,
  onAgreementTypeChange,
  onBack,
}: {
  customerName: string;
  amountManwon: number;
  periodMonths: number;
  bank: BankId | null;
  accountNumber: string;
  repaymentMethod: RepaymentMethod;
  prepaymentBenefit: PrepaymentBenefit | null;
  invoiceDestination: InvoiceDestination | null;
  email: string;
  agreementType: AgreementType;
  onAgreementTypeChange: (type: AgreementType) => void;
  onBack: () => void;
}) {
  const resolvedAmountManwon = amountManwon || 6000;
  const loanAmountWon = resolvedAmountManwon * 10_000;
  const stampTax = loanAmountWon < 50_000_000 ? 0 : 35_000;
  const firstPayment = repaymentMethod === "equal-principal"
    ? calculateEqualPrincipalFirstPayment(resolvedAmountManwon, periodMonths || 72)
    : calculateMonthlyPayment(resolvedAmountManwon, periodMonths || 72);
  const bankName = getBankName(bank);
  const details = [
    { label: "상품명", value: "신용대출" },
    { label: "대출금액", value: formatWon(loanAmountWon) },
    { label: "대출기간", value: `${periodMonths || 72}개월` },
    {
      label: "자동이체계좌",
      value: accountNumber || "10023574192",
      subvalue: bankName,
    },
    { label: "상환방법", value: repaymentMethod === "equal-principal" ? "원금균등" : "원리금균등" },
    { label: "대출금리", value: `${ANNUAL_RATE}%` },
    { label: "연체금리", value: "약정금리+3%", subvalue: "단, 법정최고금리 이내" },
    { label: "중도상환수수료율", value: "최대 2.0%" },
    { label: "선납혜택", value: prepaymentBenefit ? PREPAYMENT_LABELS[prepaymentBenefit] : "선납적립" },
    { label: "청구지", value: invoiceDestination ? INVOICE_LABELS[invoiceDestination] : "받지 않음" },
    { label: "이메일", value: email || "123@lotte.net" },
    { label: "첫 달 납입금액", value: formatWon(firstPayment) },
    { label: "첫회차 결제일", value: "2026년 10월 01일" },
    { label: "인지세", value: formatWon(stampTax) },
  ];

  return (
    <div className={`${styles.appScreen} ${styles.applicationReviewScreen}`}>
      <header className={styles.applicationReviewHeader}>
        <MobileStatusBar inverse />
        <div className={styles.paymentNav}>
          <button type="button" className={styles.paymentCloseButton} onClick={onBack} aria-label="신청정보 확인 닫기"><span /><span /></button>
          <div className={styles.applicationReviewStep} aria-label="대출 신청 5단계 중 4단계 신청정보 확인">
            <i aria-hidden="true" /><i aria-hidden="true" /><i aria-hidden="true" /><b>4</b><strong>신청정보 확인</strong><span>5</span>
          </div>
        </div>
      </header>

      <main className={styles.applicationReviewPanel}>
        <div className={styles.paymentHandle} aria-hidden="true" />
        <div className={styles.applicationReviewScroll}>
          <div className={styles.applicationReviewTitle}>
            <h1>{customerName || "김롯데"}님의 대출<br />신청정보 입니다</h1>
            <button type="button" aria-label="상환스케줄은 프로토타입 UI로만 제공됩니다">상환스케줄 <span>›</span></button>
          </div>

          <dl className={styles.applicationReviewDetails}>
            {details.map((detail) => (
              <div key={detail.label}>
                <dt>{detail.label}</dt>
                <dd>{detail.value}</dd>
                {detail.subvalue ? <small>{detail.subvalue}</small> : null}
              </div>
            ))}
          </dl>

          <p className={styles.applicationReviewTaxNotice}>
            대출금액에 따라 인지세가 부과되며, 채무자와 금융기관이 각 50%씩 부담합니다. 고객 부담금 공제 후 대출금액이 송금됩니다.
          </p>
          <p className={styles.applicationReviewLegalNotice}>계약서류는 법령 및 내부통제기준에 따른 절차를 거쳐 제공됩니다.</p>
          <div className={styles.applicationReviewVoiceNotice}>보이스피싱</div>

          <section className={styles.applicationAgreementChoice}>
            <h2>동의서 종류를 선택해주세요</h2>
            <p>요약동의서는 전체동의서의 핵심내용을 알기 쉽게 요약한 동의서입니다</p>
            <div role="radiogroup" aria-label="동의서 종류">
              {(["summary", "full"] as const).map((type) => {
                const selected = agreementType === type;
                return (
                  <button
                    type="button"
                    key={type}
                    role="radio"
                    aria-checked={selected}
                    className={selected ? styles.applicationAgreementSelected : ""}
                    onClick={() => onAgreementTypeChange(type)}
                  >
                    <span aria-hidden="true">✓</span>
                    <b>{type === "summary" ? "요약동의서로 받을게요" : "전체동의서로 받을게요"}</b>
                  </button>
                );
              })}
            </div>
          </section>

          <button type="button" className={styles.applicationSubmitButton} aria-label="대출 신청하기 버튼은 프로토타입 UI로만 제공됩니다">
            대출 신청하기
          </button>
        </div>
      </main>
      <div className={styles.homeIndicator} aria-hidden="true" />
    </div>
  );
}
