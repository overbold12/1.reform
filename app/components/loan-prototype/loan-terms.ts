export const ANNUAL_RATE = 16.98;
export const MIN_AMOUNT_MANWON = 100;
export const MAX_AMOUNT_MANWON = 3000;
export const AMOUNT_STEP_MANWON = 10;

export const PERIOD_OPTIONS = [
  12, 24, 36, 48, 60, 72, 84, 96, 108, 120,
] as const;

export function getMaximumPeriod(amountManwon: number) {
  return amountManwon < 1000 ? 60 : 72;
}

export function getAvailablePeriods(amountManwon: number) {
  const maximumPeriod = getMaximumPeriod(amountManwon);
  return PERIOD_OPTIONS.filter((period) => period <= maximumPeriod);
}

export function calculateMonthlyPayment(
  amountManwon: number,
  periodMonths: number,
) {
  const principal = amountManwon * 10_000;
  const monthlyRate = ANNUAL_RATE / 100 / 12;
  const compoundRate = Math.pow(1 + monthlyRate, periodMonths);

  return Math.round(
    (principal * monthlyRate * compoundRate) / (compoundRate - 1),
  );
}

export function calculateEqualPrincipalFirstPayment(
  amountManwon: number,
  periodMonths: number,
) {
  const principal = amountManwon * 10_000;
  const monthlyRate = ANNUAL_RATE / 100 / 12;
  return Math.round(principal / periodMonths + principal * monthlyRate);
}

export function validateAmountInput(value: string) {
  if (!value) return "금액을 입력해 주세요.";

  const amount = Number(value);
  if (amount < MIN_AMOUNT_MANWON || amount > MAX_AMOUNT_MANWON) {
    return "100만원부터 3,000만원까지 입력할 수 있어요.";
  }

  if (amount % AMOUNT_STEP_MANWON !== 0) {
    return "10만원 단위로 입력해 주세요.";
  }

  return null;
}

export function normalizeAmount(value: string) {
  const amount = Number(value);
  return Math.min(
    MAX_AMOUNT_MANWON,
    Math.max(
      MIN_AMOUNT_MANWON,
      Math.round(amount / AMOUNT_STEP_MANWON) * AMOUNT_STEP_MANWON,
    ),
  );
}
