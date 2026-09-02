"use client";

import Image, { type StaticImageData } from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
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
import guardianProgressSheet from "../../../references/to-be/바텀시트(피후견인 진행).png";
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

type ActiveSheet = ChoiceSheetKey | "payday" | "beneficialOwnerHelp" | "guardianProgress" | null;

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
  onClose,
}: {
  sheetKey: ChoiceSheetKey;
  value: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}) {
  const config = SHEET_CONFIG[sheetKey];

  return (
    <div className={styles.customerSheetLayer}>
      <button type="button" className={styles.customerSheetDim} onClick={onClose} aria-label="바텀시트 닫기" />
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
      <button type="button" className={styles.customerSheetDim} onClick={onClose} aria-label="실소유자 설명 닫기" />
      <div className={`${styles.customerChoiceSheet} ${styles.customerHelpSheet}`} role="dialog" aria-modal="true" aria-label="실소유자 설명">
        <Image src={beneficialOwnerHelpSheet} alt="실소유자 설명" priority />
        <button type="button" onClick={onClose} aria-label="실소유자 설명 확인" />
      </div>
    </div>
  );
}

function GuardianProgressSheet({ onClose }: { onClose: () => void }) {
  return (
    <div className={styles.customerSheetLayer}>
      <button type="button" className={styles.customerSheetDim} onClick={onClose} aria-label="피후견인 안내 닫기" />
      <div className={`${styles.customerChoiceSheet} ${styles.customerGuardianProgressSheet}`} role="dialog" aria-modal="true" aria-label="피후견인 대출 진행 안내">
        <Image src={guardianProgressSheet} alt="피성년·피한정 후견인은 서류 확인 후 대출 진행이 가능합니다." priority />
      </div>
    </div>
  );
}

const DATE_PICKER_ITEM_HEIGHT = 52;

function PaydayDatePicker({
  value,
  onCancel,
  onConfirm,
}: {
  value: string;
  onCancel: () => void;
  onConfirm: (value: string) => void;
}) {
  const initialDay = Math.min(31, Math.max(1, Number.parseInt(value, 10) || 21));
  const [selectedDay, setSelectedDay] = useState(initialDay);
  const [isWheelMoving, setIsWheelMoving] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollFrameRef = useRef<number | null>(null);
  const inertiaFrameRef = useRef<number | null>(null);
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isWheelMovingRef = useRef(false);
  const suppressClickRef = useRef(false);
  const suppressClickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragRef = useRef({
    active: false,
    startY: 0,
    startScrollTop: 0,
    lastY: 0,
    lastTime: 0,
    velocity: 0,
    moved: false,
  });

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        top: (initialDay - 1) * DATE_PICKER_ITEM_HEIGHT,
        behavior: "auto",
      });
    });

    return () => {
      cancelAnimationFrame(frame);
      if (scrollFrameRef.current !== null) cancelAnimationFrame(scrollFrameRef.current);
      if (inertiaFrameRef.current !== null) cancelAnimationFrame(inertiaFrameRef.current);
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
      if (suppressClickTimerRef.current) clearTimeout(suppressClickTimerRef.current);
    };
  }, [initialDay]);

  function selectNearestDay() {
    const picker = scrollRef.current;
    if (!picker) return;

    const day = Math.min(31, Math.max(1, Math.round(picker.scrollTop / DATE_PICKER_ITEM_HEIGHT) + 1));
    setSelectedDay(day);
  }

  function handleScroll() {
    if (scrollFrameRef.current !== null) cancelAnimationFrame(scrollFrameRef.current);
    scrollFrameRef.current = requestAnimationFrame(selectNearestDay);

    if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
    if (isWheelMovingRef.current) return;
    settleTimerRef.current = setTimeout(() => {
      const picker = scrollRef.current;
      if (!picker) return;
      const day = Math.min(31, Math.max(1, Math.round(picker.scrollTop / DATE_PICKER_ITEM_HEIGHT) + 1));
      picker.scrollTo({
        top: (day - 1) * DATE_PICKER_ITEM_HEIGHT,
        behavior: "smooth",
      });
    }, 110);
  }

  function stopInertia() {
    if (inertiaFrameRef.current !== null) {
      cancelAnimationFrame(inertiaFrameRef.current);
      inertiaFrameRef.current = null;
    }
  }

  function finishPointerMotion() {
    isWheelMovingRef.current = false;
    setIsWheelMoving(false);

    const picker = scrollRef.current;
    if (!picker) return;
    const day = Math.min(31, Math.max(1, Math.round(picker.scrollTop / DATE_PICKER_ITEM_HEIGHT) + 1));
    setSelectedDay(day);
    requestAnimationFrame(() => {
      picker.scrollTo({
        top: (day - 1) * DATE_PICKER_ITEM_HEIGHT,
        behavior: "smooth",
      });
    });
  }

  function startInertia(initialVelocity: number) {
    const picker = scrollRef.current;
    if (!picker) {
      finishPointerMotion();
      return;
    }

    let velocity = Math.max(-2.8, Math.min(2.8, initialVelocity));
    let previousTime = performance.now();

    const glide = (time: number) => {
      const deltaTime = Math.min(32, time - previousTime);
      previousTime = time;
      const previousTop = picker.scrollTop;
      picker.scrollTop += velocity * deltaTime;
      velocity *= Math.pow(0.935, deltaTime / 16.67);

      const reachedBoundary = Math.abs(picker.scrollTop - previousTop) < 0.1;
      if (Math.abs(velocity) > 0.018 && !reachedBoundary) {
        inertiaFrameRef.current = requestAnimationFrame(glide);
        return;
      }

      inertiaFrameRef.current = null;
      finishPointerMotion();
    };

    inertiaFrameRef.current = requestAnimationFrame(glide);
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    const picker = scrollRef.current;
    if (!picker) return;

    stopInertia();
    if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
    isWheelMovingRef.current = true;
    setIsWheelMoving(true);
    dragRef.current = {
      active: true,
      startY: event.clientY,
      startScrollTop: picker.scrollTop,
      lastY: event.clientY,
      lastTime: performance.now(),
      velocity: 0,
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    const picker = scrollRef.current;
    if (!drag.active || !picker) return;

    const now = performance.now();
    const deltaY = event.clientY - drag.startY;
    const elapsed = Math.max(1, now - drag.lastTime);
    const instantaneousVelocity = (drag.lastY - event.clientY) / elapsed;

    if (Math.abs(deltaY) > 2) drag.moved = true;
    drag.velocity = drag.velocity * 0.62 + instantaneousVelocity * 0.38;
    drag.lastY = event.clientY;
    drag.lastTime = now;
    picker.scrollTop = drag.startScrollTop - deltaY;
    event.preventDefault();
  }

  function handlePointerEnd(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag.active) return;
    drag.active = false;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (!drag.moved) {
      isWheelMovingRef.current = false;
      setIsWheelMoving(false);
      return;
    }

    suppressClickRef.current = true;
    if (suppressClickTimerRef.current) clearTimeout(suppressClickTimerRef.current);
    suppressClickTimerRef.current = setTimeout(() => {
      suppressClickRef.current = false;
      suppressClickTimerRef.current = null;
    }, 260);
    if (Math.abs(drag.velocity) > 0.035) {
      startInertia(drag.velocity);
    } else {
      finishPointerMotion();
    }
  }

  function handleWheelStart() {
    stopInertia();
    if (isWheelMovingRef.current) {
      isWheelMovingRef.current = false;
      setIsWheelMoving(false);
    }
  }

  function scrollToDay(day: number) {
    if (suppressClickRef.current) return;
    setSelectedDay(day);
    scrollRef.current?.scrollTo({
      top: (day - 1) * DATE_PICKER_ITEM_HEIGHT,
      behavior: "smooth",
    });
  }

  return (
    <div className={styles.customerSheetLayer}>
      <button type="button" className={styles.customerSheetDim} onClick={onCancel} aria-label="급여일 선택 닫기" />
      <div className={styles.paydayPickerSheet} role="dialog" aria-modal="true" aria-label="급여일 선택">
        <div className={styles.paydayPickerHeader}>
          <div>
            <strong>급여일을 선택해주세요</strong>
            <span>매월 {selectedDay}일</span>
          </div>
        </div>

        <div className={styles.paydayPickerWheel}>
          <div className={styles.paydaySelectionBand} aria-hidden="true" />
          <div
            ref={scrollRef}
            className={`${styles.paydayPickerScroll} ${isWheelMoving ? styles.paydayPickerMoving : ""}`}
            role="listbox"
            aria-label="1일부터 31일까지 급여일"
            aria-activedescendant={`payday-option-${selectedDay}`}
            onScroll={handleScroll}
            onWheel={handleWheelStart}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
          >
            <div className={styles.paydayPickerSpacer} aria-hidden="true" />
            {Array.from({ length: 31 }, (_, index) => index + 1).map((day) => (
              <button
                type="button"
                id={`payday-option-${day}`}
                key={day}
                role="option"
                aria-selected={selectedDay === day}
                className={selectedDay === day ? styles.paydayPickerSelected : ""}
                onClick={() => scrollToDay(day)}
              >
                {day}
              </button>
            ))}
            <div className={styles.paydayPickerSpacer} aria-hidden="true" />
          </div>
          <span className={styles.paydayPickerUnit} aria-hidden="true">일</span>
        </div>

        <button
          type="button"
          className={styles.paydayPickerConfirm}
          onClick={() => onConfirm(`${selectedDay}일`)}
        >
          완료
        </button>
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
  const allInformationEntered = Object.values(values).every((value) => value.trim().length > 0);
  const rows: Array<{ key: ChoiceSheetKey; label: string; required?: boolean; help?: boolean }> = [
    { key: "annualIncome", label: "연간 소득" },
    { key: "debt", label: "부채" },
    { key: "assets", label: "보유 자산" },
    { key: "fixedExpense", label: "고정 지출" },
    { key: "incomeType", label: "소득 유형" },
    { key: "vulnerableCustomer", label: "취약금융소비자 확인" },
    { key: "loanPurpose", label: "대출 목적", required: true },
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
          <p>선택한 정보들은 대출상품이 고객님의 상황에 적합한지 여부를 확인하기 위해 활용해요.</p>
          <p>변동내역이 있을 경우 항목을 다시 고를 수 있어요.</p>

          <div className={styles.customerInfoRows}>
            {rows.slice(0, 5).map((row) => (
              <CustomerRow key={row.key} label={row.label} value={values[row.key]} onClick={() => setActiveSheet(row.key)} />
            ))}

            <CustomerRow label="급여일" value={values.payday} onClick={() => setActiveSheet("payday")} />

            {rows.slice(5).map((row) => (
              <CustomerRow
                key={row.key}
                label={row.label}
                value={values[row.key]}
                required={Boolean(row.required && !values[row.key])}
                onClick={() => setActiveSheet(row.key)}
                onHelp={row.help ? () => setActiveSheet("beneficialOwnerHelp") : undefined}
              />
            ))}
          </div>

          {allInformationEntered ? (
            <button
              type="button"
              className={styles.customerInfoNextButton}
              onClick={() => {
                if (values.guardianStatus === "네") setActiveSheet("guardianProgress");
              }}
              aria-label={values.guardianStatus === "네" ? "피후견인 대출 진행 안내 확인" : "다음 버튼은 프로토타입 UI로만 제공됩니다"}
            >
              <span>다음</span>
              <span className={styles.paymentArrow} aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6" /></svg></span>
            </button>
          ) : null}
        </div>
      </main>
      <div className={styles.homeIndicator} aria-hidden="true" />

      {activeSheet && activeSheet !== "beneficialOwnerHelp" && activeSheet !== "payday" && activeSheet !== "guardianProgress" ? (
        <ChoiceImageSheet
          sheetKey={activeSheet}
          value={values[activeSheet]}
          onSelect={(value) => {
            onChange(activeSheet, value);
            setActiveSheet(null);
          }}
          onClose={() => setActiveSheet(null)}
        />
      ) : null}
      {activeSheet === "payday" ? (
        <PaydayDatePicker
          value={values.payday}
          onCancel={() => setActiveSheet(null)}
          onConfirm={(value) => {
            onChange("payday", value);
            setActiveSheet(null);
          }}
        />
      ) : null}
      {activeSheet === "beneficialOwnerHelp" ? <BeneficialOwnerHelpSheet onClose={() => setActiveSheet(null)} /> : null}
      {activeSheet === "guardianProgress" ? <GuardianProgressSheet onClose={() => setActiveSheet(null)} /> : null}
    </div>
  );
}
