"use client";

import Image, { type StaticImageData } from "next/image";
import { useState } from "react";
import annualIncomeSheet from "../../../references/to-be/바텀시트(연간소득).png";
import debtSheet from "../../../references/to-be/바텀시트(부채).png";
import assetsSheet from "../../../references/to-be/바텀시트(보유자산).png";
import fixedExpenseSheet from "../../../references/to-be/바텀시트(고정지출).png";
import incomeTypeSheet from "../../../references/to-be/바텀시트(소득유형).png";
import vulnerableSheet from "../../../references/to-be/바텀시트(취약금융소비자 확인).png";
import loanPurposeSheet from "../../../references/to-be/바텀시트(대출목적).png";
import beneficialOwnerSheet from "../../../references/to-be/바텀시트(실소유자).png";
import beneficialOwnerHelpSheet from "../../../references/to-be/바텀시트(실소유자 설명).png";
import guardianSheet from "../../../references/to-be/바텀시트(피후견인).png";
import { MobileStatusBar } from "./mobile-status-bar";
import styles from "./loan-prototype.module.css";

export type CustomerInfoValues = {
  annualIncome: string;
  debt: string;
  assets: string;
  fixedExpense: string;
  incomeType: string;
  payday: string;
  vulnerableCustomer: string;
  loanPurpose: string;
  beneficialOwner: string;
  guardianStatus: string;
};

export const INITIAL_CUSTOMER_INFO: CustomerInfoValues = {
  annualIncome: "2천만원 이상 ~ 1억원 이하",
  debt: "1천만원 미만",
  assets: "5천만원 미만",
  fixedExpense: "월 2백만원 미만",
  incomeType: "근로소득",
  payday: "21일",
  vulnerableCustomer: "해당사항 없음",
  loanPurpose: "",
  beneficialOwner: "",
  guardianStatus: "아니오",
};

type ChoiceSheetKey =
  | "annualIncome"
  | "debt"
  | "assets"
  | "fixedExpense"
  | "incomeType"
  | "vulnerableCustomer"
  | "loanPurpose"
  | "beneficialOwner"
  | "guardianStatus";

type ActiveSheet = ChoiceSheetKey | "beneficialOwnerHelp" | null;

const SHEET_CONFIG: Record<ChoiceSheetKey, { image: StaticImageData; options: string[]; label: string }> = {
  annualIncome: {
    image: annualIncomeSheet,
    label: "연간 소득",
    options: ["2천만원 미만", "2천만원 이상 ~ 1억원 이하", "1억원 초과"],
  },
  debt: {
    image: debtSheet,
    label: "부채",
    options: ["1천만원 미만", "1천만원 이상 ~ 1억원 이하", "1억원 초과"],
  },
  assets: {
    image: assetsSheet,
    label: "보유 자산",
    options: ["5천만원 미만", "5천만원 이상 ~ 5억원 이하", "5억원 초과"],
  },
  fixedExpense: {
    image: fixedExpenseSheet,
    label: "고정 지출",
    options: ["월 2백만원 미만", "월 2백만원 이상 ~ 7백만원 이하", "월 7백만원 초과"],
  },
  incomeType: {
    image: incomeTypeSheet,
    label: "소득 유형",
    options: ["근로소득", "사업소득", "부동산임대소득", "연금소득", "기타소득"],
  },
  vulnerableCustomer: {
    image: vulnerableSheet,
    label: "취약금융소비자 확인",
    options: ["해당사항 없음", "65세 이상의 고령자", "은퇴자", "주부"],
  },
  loanPurpose: {
    image: loanPurposeSheet,
    label: "대출 목적",
    options: ["가계자금", "주택자금", "타기관 대출금 상환", "사업자금", "경조자금", "교육비", "의료비", "자동차구입자금", "투자자금", "기타"],
  },
  beneficialOwner: {
    image: beneficialOwnerSheet,
    label: "실소유자 여부",
    options: ["예", "아니오"],
  },
  guardianStatus: {
    image: guardianSheet,
    label: "피성년·피한정 후견인 여부",
    options: ["아니오", "네"],
  },
};

function Chevron() {
  return <svg viewBox="0 0 12 20" aria-hidden="true"><path d="m2 2 7 8-7 8" /></svg>;
}

function CustomerRow({
  label,
  value,
  required = false,
  onClick,
  onHelp,
}: {
  label: string;
  value: string;
  required?: boolean;
  onClick: () => void;
  onHelp?: () => void;
}) {
  return (
    <div className={styles.customerInfoRowWrap}>
      <button type="button" className={styles.customerInfoRow} onClick={onClick}>
        <span className={styles.customerInfoLabel}>
          {label}
          {required && !onHelp ? <i aria-hidden="true">•</i> : null}
        </span>
        <strong className={value ? "" : styles.customerInfoPlaceholder}>
          {value || "항목을 선택해 주세요"}
        </strong>
        <Chevron />
      </button>
      {onHelp ? (
        <>
          <button type="button" className={styles.customerInfoHelp} aria-label="실소유자 설명 보기" onClick={onHelp}>?</button>
          {required ? <i className={styles.customerInfoHelpRequired} aria-hidden="true">•</i> : null}
        </>
      ) : null}
    </div>
  );
}

function ChoiceImageSheet({
  sheetKey,
  value,
  onSelect,
}: {
  sheetKey: ChoiceSheetKey;
  value: string;
  onSelect: (value: string) => void;
}) {
  const config = SHEET_CONFIG[sheetKey];

  return (
    <div className={styles.customerSheetLayer}>
      <div className={styles.customerSheetDim} aria-hidden="true" />
      <div className={styles.customerChoiceSheet} role="dialog" aria-modal="true" aria-label={`${config.label} 선택`}>
        <Image src={config.image} alt={`${config.label} 선택 항목`} priority />
        <div className={styles.customerChoiceHitArea}>
          {config.options.map((option) => (
            <button
              type="button"
              key={option}
              aria-label={option}
              aria-pressed={value === option}
              onClick={() => onSelect(option)}
            >
              {value === option ? <span aria-hidden="true">✓</span> : null}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function BeneficialOwnerHelpSheet({ onClose }: { onClose: () => void }) {
  return (
    <div className={styles.customerSheetLayer}>
      <div className={styles.customerSheetDim} aria-hidden="true" />
      <div className={`${styles.customerChoiceSheet} ${styles.customerHelpSheet}`} role="dialog" aria-modal="true" aria-label="실소유자 설명">
        <Image src={beneficialOwnerHelpSheet} alt="실소유자 설명" priority />
        <button type="button" onClick={onClose} aria-label="실소유자 설명 확인" />
      </div>
    </div>
  );
}

export function CustomerInfoScreen({
  values,
  onChange,
  onBack,
}: {
  values: CustomerInfoValues;
  onChange: (key: keyof CustomerInfoValues, value: string) => void;
  onBack: () => void;
}) {
  const [activeSheet, setActiveSheet] = useState<ActiveSheet>(null);
  const rows: Array<{ key: ChoiceSheetKey; label: string; required?: boolean; help?: boolean }> = [
    { key: "annualIncome", label: "연간 소득" },
    { key: "debt", label: "부채" },
    { key: "assets", label: "보유 자산" },
    { key: "fixedExpense", label: "고정 지출" },
    { key: "incomeType", label: "소득 유형" },
    { key: "vulnerableCustomer", label: "취약금융소비자 확인" },
    { key: "loanPurpose", label: "대출 목적" },
    { key: "beneficialOwner", label: "실소유자 여부", required: true, help: true },
    { key: "guardianStatus", label: "피성년·피한정 후견인 여부", required: true },
  ];

  return (
    <div className={`${styles.appScreen} ${styles.customerInfoScreen}`}>
      <header className={styles.customerInfoHeader}>
        <MobileStatusBar inverse />
        <div className={styles.paymentNav}>
          <button type="button" className={styles.paymentCloseButton} onClick={onBack} aria-label="고객 정보 확인 닫기"><span /><span /></button>
          <div className={styles.customerInfoStep} aria-label="대출 신청 5단계 중 3단계 약관동의">
            <i aria-hidden="true" /><i aria-hidden="true" /><b>3</b><strong>약관동의</strong><span>4</span><span>5</span>
          </div>
        </div>
      </header>

      <main className={styles.customerInfoPanel}>
        <div className={styles.customerInfoScroll}>
          <h1>정보를 확인해주세요</h1>
          <p>변동내역이 있을 경우 항목을 다시 고를 수 있어요.</p>
          <p>변동내역이 있을 경우 항목을 다시 고를 수 있어요.</p>

          <div className={styles.customerInfoRows}>
            {rows.slice(0, 5).map((row) => (
              <CustomerRow key={row.key} label={row.label} value={values[row.key]} onClick={() => setActiveSheet(row.key)} />
            ))}

            <div className={`${styles.customerInfoRow} ${styles.customerInfoStaticRow}`}>
              <span className={styles.customerInfoLabel}>급여일</span>
              <strong>{values.payday}</strong>
              <Chevron />
            </div>

            {rows.slice(5).map((row) => (
              <CustomerRow
                key={row.key}
                label={row.label}
                value={values[row.key]}
                required={row.required}
                onClick={() => setActiveSheet(row.key)}
                onHelp={row.help ? () => setActiveSheet("beneficialOwnerHelp") : undefined}
              />
            ))}
          </div>
        </div>
      </main>
      <div className={styles.homeIndicator} aria-hidden="true" />

      {activeSheet && activeSheet !== "beneficialOwnerHelp" ? (
        <ChoiceImageSheet
          sheetKey={activeSheet}
          value={values[activeSheet]}
          onSelect={(value) => {
            onChange(activeSheet, value);
            setActiveSheet(null);
          }}
        />
      ) : null}
      {activeSheet === "beneficialOwnerHelp" ? <BeneficialOwnerHelpSheet onClose={() => setActiveSheet(null)} /> : null}
    </div>
  );
}
