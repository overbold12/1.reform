"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import simsaImage from "../../../references/to-be(platform)/simasa.png";
import { LoadingSpinner } from "./loading-spinner";
import {
  ANNUAL_RATE,
  calculateMonthlyPayment,
  getMaximumPeriod,
  MAX_AMOUNT_MANWON,
  MIN_AMOUNT_MANWON,
  PERIOD_OPTIONS,
} from "./loan-terms";
import { MobileStatusBar } from "./mobile-status-bar";
import styles from "./loan-prototype.module.css";

type LoanResultScreenProps = {
  amountManwon: number;
  periodMonths: number;
  onClose: () => void;
  onNext: () => void;
  onAmountChange: (amount: number) => void;
  onPeriodChange: (period: number) => void;
};

export function LoanResultScreen({
  amountManwon,
  periodMonths,
  onClose,
  onNext,
  onAmountChange,
  onPeriodChange,
}: LoanResultScreenProps) {
  const [amountInput, setAmountInput] = useState(String(amountManwon));
  const [amountError, setAmountError] = useState<string | null>(null);
  const initialPayment = useMemo(
    () => calculateMonthlyPayment(amountManwon, periodMonths),
    [amountManwon, periodMonths],
  );
  const [monthlyPayment, setMonthlyPayment] = useState(initialPayment);
  const [isCalculating, setIsCalculating] = useState(false);
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    setIsCalculating(true);
    const calculationTimer = setTimeout(() => {
      setMonthlyPayment(
        calculateMonthlyPayment(amountManwon, periodMonths),
      );
      setIsCalculating(false);
    }, 650);

    return () => clearTimeout(calculationTimer);
  }, [amountManwon, periodMonths]);

  function commitAmount(nextAmount: number) {
    onAmountChange(nextAmount);
    setAmountError(null);
    const maximumPeriod = getMaximumPeriod(nextAmount);
    if (periodMonths > maximumPeriod) {
      onPeriodChange(maximumPeriod);
    }
  }

  function handleAmountInput(nextValue: string) {
    const digits = nextValue.replace(/\D/g, "").slice(0, 4);
    setAmountInput(digits);

    if (!digits) {
      setAmountError("금액을 입력해주세요.");
      return;
    }

    const nextAmount = Number(digits);
    if (nextAmount < MIN_AMOUNT_MANWON || nextAmount > MAX_AMOUNT_MANWON) {
      setAmountError("100만원부터 3,000만원까지 입력할 수 있어요.");
      return;
    }

    if (nextAmount % 10 !== 0) {
      setAmountError("10만원 단위로 입력해주세요.");
      return;
    }

    commitAmount(nextAmount);
  }

  function normalizeAmountInput() {
    if (!amountInput) {
      setAmountInput(String(amountManwon));
      setAmountError(null);
      return;
    }

    const parsedAmount = Number(amountInput);
    const normalizedAmount = Math.min(
      MAX_AMOUNT_MANWON,
      Math.max(
        MIN_AMOUNT_MANWON,
        Math.round(parsedAmount / 10) * 10,
      ),
    );
    setAmountInput(String(normalizedAmount));
    commitAmount(normalizedAmount);
  }

  return (
    <div className={`${styles.appScreen} ${styles.resultScreen}`}>
      <div className={styles.resultScroll}>
        <section className={styles.resultHero}>
          <MobileStatusBar inverse />
          <button
            type="button"
            className={styles.resultCloseButton}
            onClick={onClose}
            aria-label="심사 결과 닫기"
          >
            <span />
            <span />
          </button>

          <h2>
            김롯데님, 신용조회 결과
            <br />대출기간이 <mark>{periodMonths}개월</mark> 일 때
            <br />최대 <mark>{amountManwon.toLocaleString()}만원</mark>을
            <br /><mark>{ANNUAL_RATE}%</mark> 금리로
            <br />대출이 가능해요
          </h2>

          <Image
            className={styles.resultCoachImage}
            src={simsaImage}
            alt="조건을 입력해서 대출 계획을 세워보세요"
          />
        </section>

        <section className={styles.resultConditionPanel}>
          <div className={styles.resultField}>
            <label htmlFor="loan-amount">금액</label>
            <div className={`${styles.resultAmountValue} ${amountError ? styles.resultAmountInvalid : ""}`}>
              <input
                id="loan-amount"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={amountInput ? Number(amountInput).toLocaleString() : ""}
                onChange={(event) => handleAmountInput(event.target.value)}
                onBlur={normalizeAmountInput}
                onFocus={(event) => event.currentTarget.select()}
                aria-describedby="loan-amount-help loan-amount-error"
                aria-invalid={Boolean(amountError)}
              />
              <span>만원</span>
            </div>
            <p
              id="loan-amount-error"
              className={styles.amountValidationMessage}
              aria-live="polite"
            >
              {amountError ?? "100만~3,000만원, 10만원 단위로 입력"}
            </p>
            <p id="loan-amount-help" className={styles.loanResultNotice}>
              대출기간이 {periodMonths}개월 일 때
              <br />대출 가능한 최대금액은 3,000만원이에요.
            </p>
          </div>

          <fieldset className={styles.periodFieldset}>
            <legend>기간(개월)</legend>
            <div className={styles.periodOptions}>
              {PERIOD_OPTIONS.map((period) => {
                const maximumPeriod = getMaximumPeriod(amountManwon);
                const disabled = period > maximumPeriod;
                const selected = periodMonths === period;

                return (
                  <button
                    type="button"
                    key={period}
                    className={selected ? styles.periodSelected : ""}
                    disabled={disabled}
                    aria-pressed={selected}
                    onClick={() => onPeriodChange(period)}
                  >
                    {period}
                  </button>
                );
              })}
            </div>
            <p className={styles.periodHelp}>
              <span aria-hidden="true">i</span>
              {amountManwon < 1000
                ? "신청금액이 1,000만원 미만이면 최대 60개월까지 선택할 수 있어요."
                : "신청금액이 1,000만원 이상이면 최대 72개월까지 선택할 수 있어요."}
            </p>
          </fieldset>

          <dl className={styles.resultSummary}>
            <div>
              <dt>금리</dt>
              <dd>{ANNUAL_RATE}%</dd>
            </div>
            <div>
              <dt>첫달 예상 납입금액</dt>
              <dd className={isCalculating ? styles.paymentCalculating : ""}>
                약 {monthlyPayment.toLocaleString()}원
              </dd>
            </div>
          </dl>

          <button type="button" className={styles.resultDetailButton} onClick={onNext}>
            더 자세한 조건 알아보기
          </button>
        </section>
      </div>
      {isCalculating ? (
        <div className={styles.calculationOverlay}>
          <LoadingSpinner label="첫달 예상 납입금액 계산 중" />
        </div>
      ) : null}
      <div className={styles.homeIndicator} aria-hidden="true" />
    </div>
  );
}
