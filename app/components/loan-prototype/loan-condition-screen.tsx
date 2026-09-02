"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import equalPrincipalImage from "../../../references/to-be/원금균등.png";
import equalPaymentImage from "../../../references/to-be/원리금균등.png";
import {
  ANNUAL_RATE,
  calculateEqualPrincipalFirstPayment,
  calculateMonthlyPayment,
  getAvailablePeriods,
  getMaximumPeriod,
  normalizeAmount,
  validateAmountInput,
} from "./loan-terms";
import { MobileStatusBar } from "./mobile-status-bar";
import styles from "./loan-prototype.module.css";

export type RepaymentMethod = "equal-payment" | "equal-principal";

type LoanConditionScreenProps = {
  amountManwon: number;
  periodMonths: number;
  repaymentMethod: RepaymentMethod;
  onAmountChange: (amount: number) => void;
  onPeriodChange: (period: number) => void;
  onRepaymentMethodChange: (method: RepaymentMethod) => void;
  onBack: () => void;
  onNext: () => void;
};

const REPAYMENT_OPTIONS: Array<{
  id: RepaymentMethod;
  label: string;
  description: string;
}> = [
  {
    id: "equal-payment",
    label: "원리금균등",
    description: "매달 같은 금액을 나눠 갚는 방식",
  },
  {
    id: "equal-principal",
    label: "원금균등",
    description: "이자는 줄고, 원금을 똑같이 갚는 방식",
  },
];

export function LoanConditionScreen({
  amountManwon,
  periodMonths,
  repaymentMethod,
  onAmountChange,
  onPeriodChange,
  onRepaymentMethodChange,
  onBack,
  onNext,
}: LoanConditionScreenProps) {
  const [amountInput, setAmountInput] = useState(String(amountManwon));
  const [amountError, setAmountError] = useState<string | null>(null);
  const [isPeriodOpen, setIsPeriodOpen] = useState(false);

  const availablePeriods = useMemo(
    () => getAvailablePeriods(amountManwon),
    [amountManwon],
  );
  const firstPayment = useMemo(
    () =>
      repaymentMethod === "equal-payment"
        ? calculateMonthlyPayment(amountManwon, periodMonths)
        : calculateEqualPrincipalFirstPayment(amountManwon, periodMonths),
    [amountManwon, periodMonths, repaymentMethod],
  );
  const formattedAmount = amountInput
    ? Number(amountInput).toLocaleString()
    : "";

  function handleAmountInput(nextValue: string) {
    const digits = nextValue.replace(/\D/g, "").slice(0, 4);
    setAmountInput(digits);
    const error = validateAmountInput(digits);
    setAmountError(error);

    if (!error) onAmountChange(Number(digits));
  }

  function normalizeAmountInput() {
    if (!amountInput) {
      setAmountInput(String(amountManwon));
      setAmountError(null);
      return;
    }

    const normalized = normalizeAmount(amountInput);
    setAmountInput(String(normalized));
    setAmountError(null);
    onAmountChange(normalized);
  }

  return (
    <div className={`${styles.appScreen} ${styles.loanConditionScreen}`}>
      <div className={styles.loanConditionScroll}>
        <header className={styles.loanConditionHeader}>
          <MobileStatusBar inverse />
          <div className={styles.loanConditionNav}>
            <button
              type="button"
              className={styles.conditionCloseButton}
              onClick={onBack}
              aria-label="대출조건 설정 닫기"
            >
              <span />
              <span />
            </button>
            <ol className={styles.conditionProgress} aria-label="대출 신청 5단계 중 1단계">
              {[1, 2, 3, 4, 5].map((stage) => (
                <li key={stage} className={stage === 1 ? styles.conditionProgressActive : ""}>
                  <span>{stage}</span>
                  {stage === 1 ? <strong>대출정보</strong> : null}
                </li>
              ))}
            </ol>
          </div>
        </header>

        <main className={styles.loanConditionPanel}>
          <div className={styles.conditionHandle} aria-hidden="true" />

          <section className={styles.conditionFields} aria-label="대출 금액과 기간">
            <div className={styles.conditionAmountField}>
              <label htmlFor="condition-loan-amount">금액</label>
              <div className={`${styles.conditionValueLine} ${amountError ? styles.conditionValueInvalid : ""}`}>
                <input
                  id="condition-loan-amount"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  value={formattedAmount}
                  onChange={(event) => handleAmountInput(event.target.value)}
                  onBlur={normalizeAmountInput}
                  onFocus={(event) => event.currentTarget.select()}
                  aria-invalid={Boolean(amountError)}
                  aria-describedby="condition-amount-error"
                />
                <span>만원</span>
              </div>
            </div>

            <div className={styles.conditionPeriodField}>
              <span className={styles.conditionFieldLabel}>기간</span>
              <button
                type="button"
                className={styles.conditionPeriodButton}
                aria-haspopup="listbox"
                aria-expanded={isPeriodOpen}
                onClick={() => setIsPeriodOpen((current) => !current)}
              >
                <span>{periodMonths}개월</span>
                <svg viewBox="0 0 12 8" aria-hidden="true">
                  <path d="m1 1 5 5 5-5" />
                </svg>
              </button>
              {isPeriodOpen ? (
                <div className={styles.periodDropdown} role="listbox" aria-label="대출기간 선택">
                  {availablePeriods.map((period) => (
                    <button
                      type="button"
                      key={period}
                      role="option"
                      aria-selected={period === periodMonths}
                      className={period === periodMonths ? styles.periodDropdownSelected : ""}
                      onClick={() => {
                        onPeriodChange(period);
                        setIsPeriodOpen(false);
                      }}
                    >
                      {period}개월
                      {period === periodMonths ? <span aria-hidden="true">✓</span> : null}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </section>

          <p id="condition-amount-error" className={`${styles.conditionNotice} ${amountError ? styles.conditionNoticeError : ""}`} aria-live="polite">
            <span aria-hidden="true">i</span>
            {amountError ??
              `신용조회 결과에 따라 최장 대출기간이 결정되며, 신청금액이 1,000만원 미만이면 기간을 ${getMaximumPeriod(amountManwon)}개월까지만 선택할 수 있어요.`}
          </p>

          <fieldset className={styles.repaymentFieldset}>
            <legend>월납입방식</legend>
            <div className={styles.repaymentOptions}>
              {REPAYMENT_OPTIONS.map((option) => {
                const selected = option.id === repaymentMethod;
                return (
                  <button
                    type="button"
                    key={option.id}
                    className={selected ? styles.repaymentSelected : ""}
                    aria-pressed={selected}
                    onClick={() => onRepaymentMethodChange(option.id)}
                  >
                    <span className={styles.repaymentRadio} aria-hidden="true">
                      ✓
                    </span>
                    <span>
                      <strong>{option.label}</strong>
                      <small>{option.description}</small>
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className={styles.repaymentImageFrame} aria-live="polite">
            <Image
              key={repaymentMethod}
              className={styles.repaymentImage}
              src={repaymentMethod === "equal-payment" ? equalPaymentImage : equalPrincipalImage}
              alt={`${repaymentMethod === "equal-payment" ? "원리금균등" : "원금균등"} 상환 흐름`}
              priority
            />
          </div>

          <dl className={styles.conditionSummary}>
            <div>
              <dt>금리</dt>
              <dd>{ANNUAL_RATE}%</dd>
            </div>
            <div>
              <dt>첫달 예상 납입금액</dt>
              <dd>약 {Math.round(firstPayment / 10_000).toLocaleString()}만원</dd>
            </div>
          </dl>

          <button type="button" className={styles.schedulePreviewButton} aria-disabled="true">
            <span>예상 상환스케줄</span>
            <svg viewBox="0 0 12 20" aria-hidden="true">
              <path d="m2 2 7 8-7 8" />
            </svg>
          </button>

          <button type="button" className={styles.conditionSubmitButton} onClick={onNext}>
            이 조건으로 대출 신청하기
          </button>
        </main>
      </div>
      <div className={styles.homeIndicator} aria-hidden="true" />
    </div>
  );
}
