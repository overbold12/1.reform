"use client";

import { useState, type ReactNode } from "react";
import {
  CustomerInfoScreen,
  INITIAL_CUSTOMER_INFO,
  type CustomerInfoValues,
} from "../loan-prototype/customer-info-screen";
import { MobileStatusBar } from "../loan-prototype/mobile-status-bar";
import loanStyles from "../loan-prototype/loan-prototype.module.css";
import layoutStyles from "./consent-comparison.module.css";
import styles from "./information-comparison.module.css";

type InformationStep = "payday" | "income" | "purpose" | "owner" | "suitability";

const informationSteps: Array<{ id: InformationStep; label: string }> = [
  { id: "payday", label: "급여일 입력" },
  { id: "income", label: "소득유형 선택" },
  { id: "purpose", label: "자금용도 선택" },
  { id: "owner", label: "실소유자 확인" },
  { id: "suitability", label: "적합성 원칙 확인" },
];

const incomeOptions = ["근로소득", "사업소득", "부동산임대소득", "연금소득", "기타소득"];
const purposeOptions = [
  "가계자금",
  "주택자금",
  "타기관 대출금 상환",
  "사업자금",
  "경조자금",
  "교육비",
  "의료비",
  "자동차구입자금",
  "기타",
];

const suitabilityGroups = [
  {
    id: "annualIncome",
    title: "연간 소득",
    options: ["2천만원 미만", "2천만원 이상 ~ 1억원 이하", "1억원 초과"],
  },
  {
    id: "debt",
    title: "부채",
    options: ["1천만원 미만", "1천만원 이상 ~ 1억원 이하", "1억원 초과"],
  },
  {
    id: "assets",
    title: "보유자산",
    options: ["5천만원 미만", "5천만원 이상 ~ 5억원 이하", "5억원 초과"],
  },
  {
    id: "fixedExpense",
    title: "고정지출",
    options: ["월 2백만원 미만", "월 2백만원 이상 ~ 7백만원 이하", "월 7백만원 초과"],
  },
] as const;

type SuitabilityId = (typeof suitabilityGroups)[number]["id"];
type SuitabilityAnswers = Record<SuitabilityId, string>;

const emptySuitabilityAnswers: SuitabilityAnswers = {
  annualIncome: "",
  debt: "",
  assets: "",
  fixedExpense: "",
};

const baseBuildUp = [
  "선납적립",
  "🔵 롯데뱅크",
  "10023571492",
  "받지 않음",
  "서울 강남구 테헤란로 142",
  "8층",
  "자택 전화번호 없음",
  "서울 강남구 테헤란로 142",
  "8층",
  "직장 전화번호 없음",
];

export function PartnerLoanInformationComparison() {
  return (
    <div className={layoutStyles.comparisonGrid}>
      <AsIsInformationPrototype />
      <div className={layoutStyles.comparisonDirection} aria-hidden="true">
        <span>5 PAGES</span>
        <svg viewBox="0 0 32 24">
          <path d="M3 12h24M20 5l7 7-7 7" />
        </svg>
        <span>1 PAGE</span>
      </div>
      <ToBeInformationPrototype />
    </div>
  );
}

function AsIsInformationPrototype() {
  const [step, setStep] = useState<InformationStep>("payday");
  const [payday, setPayday] = useState("");
  const [incomeType, setIncomeType] = useState("");
  const [purpose, setPurpose] = useState("");
  const [owner, setOwner] = useState("");
  const [answers, setAnswers] = useState<SuitabilityAnswers>({ ...emptySuitabilityAnswers });
  const stepIndex = informationSteps.findIndex((item) => item.id === step);

  function reset() {
    setStep("payday");
    setPayday("");
    setIncomeType("");
    setPurpose("");
    setOwner("");
    setAnswers({ ...emptySuitabilityAnswers });
  }

  function moveBack() {
    if (stepIndex > 0) setStep(informationSteps[stepIndex - 1].id);
  }

  function moveNext() {
    if (stepIndex < informationSteps.length - 1) {
      setStep(informationSteps[stepIndex + 1].id);
    }
  }

  return (
    <PrototypeColumn label="AS-IS" meta={`Step ${stepIndex + 1} / ${informationSteps.length}`} onReset={reset}>
      <div className={loanStyles.phoneFrame}>
        {step === "payday" ? (
          <BuildUpScreen onBack={moveBack} buildUp={baseBuildUp}>
            <div className={styles.paydaySection}>
              <label htmlFor="comparison-payday">급여일을 입력해주세요</label>
              <div className={styles.paydayField}>
                <input
                  id="comparison-payday"
                  inputMode="numeric"
                  maxLength={2}
                  placeholder="31"
                  value={payday}
                  onChange={(event) =>
                    setPayday(event.target.value.replace(/\D/g, "").slice(0, 2))
                  }
                  aria-label="급여일"
                />
                <strong aria-hidden="true">일</strong>
              </div>
              {payday ? <NextButton onClick={moveNext} /> : null}
            </div>
          </BuildUpScreen>
        ) : null}

        {step === "income" ? (
          <BuildUpScreen
            onBack={moveBack}
            buildUp={[...baseBuildUp, `${payday || "21"}일`, "123@lotte.net", "가계자금"]}
          >
            <ChoiceSection
              title="소득유형을 선택하세요"
              options={incomeOptions}
              value={incomeType}
              onChange={setIncomeType}
            />
            {incomeType ? <NextButton onClick={moveNext} /> : null}
          </BuildUpScreen>
        ) : null}

        {step === "purpose" ? (
          <BuildUpScreen
            onBack={moveBack}
            buildUp={[...baseBuildUp, `${payday || "21"}일`, "123@lotte.net"]}
          >
            <ChoiceSection
              title="자금용도를 선택하세요"
              options={purposeOptions}
              value={purpose}
              onChange={setPurpose}
            />
            {purpose ? <NextButton onClick={moveNext} /> : null}
          </BuildUpScreen>
        ) : null}

        {step === "owner" ? (
          <OwnerScreen value={owner} onBack={moveBack} onChange={setOwner} onNext={moveNext} />
        ) : null}

        {step === "suitability" ? (
          <SuitabilityScreen answers={answers} onBack={moveBack} onChange={setAnswers} />
        ) : null}
      </div>
    </PrototypeColumn>
  );
}

function BuildUpScreen({
  buildUp,
  children,
  onBack,
}: {
  buildUp: string[];
  children: ReactNode;
  onBack: () => void;
}) {
  return (
    <div className={`${styles.appScreen} ${styles.darkScreen}`}>
      <MobileStatusBar inverse />
      <LegacyNav step="2" title="결제정보" onBack={onBack} />
      <main className={styles.legacyPanel}>
        <span className={styles.sheetHandle} aria-hidden="true" />
        <div className={styles.buildUp} aria-label="이전 입력 정보">
          {buildUp.map((item, index) => <span key={`${item}-${index}`}>{item}</span>)}
        </div>
        {children}
      </main>
      <HomeIndicator />
    </div>
  );
}

function OwnerScreen({
  value,
  onBack,
  onChange,
  onNext,
}: {
  value: string;
  onBack: () => void;
  onChange: (value: string) => void;
  onNext: () => void;
}) {
  return (
    <div className={`${styles.appScreen} ${styles.darkScreen}`}>
      <MobileStatusBar inverse />
      <LegacyNav step="3" title="약관동의" onBack={onBack} />
      <main className={`${styles.legacyPanel} ${styles.ownerPanel}`}>
        <span className={styles.sheetHandle} aria-hidden="true" />
        <h2>실제 소유자에 대하여 아래와 같이<br />확인합니다</h2>
        <p>본 확인서는 「특정금융거래 정보 보고 및 이용 등에 대한 법률」 제 5조의2 및 「특정금융거래정보의 보고 및 이용 등에 관한 법률 시행령」 제 10조의5에 의하여 실제 소유자 확인을 위하여 작성하는 서식입니다.</p>
        <p>금융회사와 실제 소유자 확인을 거부하여 고객 확인을 할 수 없을 때에는 동 법 제 5조의2에 따라 거래가 거절되거나 중단될 수 있습니다.</p>
        <small>ⓘ 실소유자 : 해당 금융거래의 궁극적 혜택을 보는 개인</small>
        <ChoiceSection options={["예", "아니오"]} value={value} onChange={onChange} large />
        {value ? <NextButton label="확인했습니다" onClick={onNext} /> : null}
      </main>
      <HomeIndicator />
    </div>
  );
}

function SuitabilityScreen({
  answers,
  onBack,
  onChange,
}: {
  answers: SuitabilityAnswers;
  onBack: () => void;
  onChange: (answers: SuitabilityAnswers) => void;
}) {
  const allAnswered = suitabilityGroups.every((group) => Boolean(answers[group.id]));

  return (
    <div className={`${styles.appScreen} ${styles.darkScreen}`}>
      <MobileStatusBar inverse />
      <LegacyNav step="3" title="약관동의" onBack={onBack} />
      <main className={`${styles.legacyPanel} ${styles.suitabilityPanel}`}>
        <span className={styles.sheetHandle} aria-hidden="true" />
        <div className={styles.suitabilityScroll}>
          <h2>금융소비자 보호에 관한 법률에<br />따라 아래 항목에 대한 확인이<br />필요합니다.</h2>
          <p>고객님의 상황에 가장 가까운 항목을 선택해 주세요</p>
          <p>선택하신 정보들은 대출상품이 고객님의 상황에 적합한지 여부를 확인하기 위해 활용 됩니다.</p>
          <div className={styles.suitabilityGroups}>
            {suitabilityGroups.map((group) => (
              <ChoiceSection
                key={group.id}
                title={group.title}
                options={[...group.options]}
                value={answers[group.id]}
                onChange={(value) => onChange({ ...answers, [group.id]: value })}
                large
                toggleable
              />
            ))}
          </div>
          {allAnswered ? <NextButton onClick={() => undefined} /> : null}
        </div>
      </main>
      <HomeIndicator />
    </div>
  );
}

function LegacyNav({ step, title, onBack }: { step: "2" | "3"; title: string; onBack: () => void }) {
  return (
    <div className={styles.legacyNav}>
      <button type="button" onClick={onBack} aria-label="이전 화면으로 돌아가기">×</button>
      <div aria-label={`5단계 중 ${step}단계 ${title}`}>
        <i aria-hidden="true" />{step === "3" ? <i aria-hidden="true" /> : null}
        <b>{step}</b><strong>{title}</strong>
        {step === "2" ? <span>3</span> : null}<span>4</span><span>5</span>
      </div>
    </div>
  );
}

function ChoiceSection({
  title,
  options,
  value,
  onChange,
  large = false,
  toggleable = false,
}: {
  title?: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  large?: boolean;
  toggleable?: boolean;
}) {
  return (
    <section className={`${styles.choiceSection} ${large ? styles.choiceSectionLarge : ""}`}>
      {title ? <h3>{title}</h3> : null}
      <div role="radiogroup" aria-label={title ?? "선택 항목"}>
        {options.map((option) => {
          const selected = option === value;
          return (
            <button
              type="button"
              role="radio"
              aria-checked={selected}
              className={selected ? styles.choiceSelected : ""}
              key={option}
              onClick={() => onChange(toggleable && selected ? "" : option)}
            >
              <i aria-hidden="true">
                <svg viewBox="0 0 18 18"><path d="m4.5 9.2 2.8 2.8 6.1-6.4" /></svg>
              </i>
              <span>{option}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function NextButton({ label = "다음", onClick }: { label?: string; onClick: () => void }) {
  return (
    <div className={styles.nextButtonWrap}>
      <button type="button" onClick={onClick}>
        <span>{label}</span>
        <i aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6" /></svg></i>
      </button>
    </div>
  );
}

function HomeIndicator() {
  return <span className={styles.homeIndicator} aria-hidden="true" />;
}

function ToBeInformationPrototype() {
  const [values, setValues] = useState<CustomerInfoValues>({ ...INITIAL_CUSTOMER_INFO });
  const [resetKey, setResetKey] = useState(0);

  function reset() {
    setValues({ ...INITIAL_CUSTOMER_INFO });
    setResetKey((current) => current + 1);
  }

  return (
    <PrototypeColumn label="TO-BE" meta="통합 정보 확인" onReset={reset}>
      <div className={loanStyles.phoneFrame}>
        <CustomerInfoScreen
          key={resetKey}
          values={values}
          onChange={(key, value) => setValues((current) => ({ ...current, [key]: value }))}
          onBack={reset}
          onNext={() => undefined}
        />
      </div>
    </PrototypeColumn>
  );
}

function PrototypeColumn({
  label,
  meta,
  onReset,
  children,
}: {
  label: "AS-IS" | "TO-BE";
  meta: string;
  onReset: () => void;
  children: ReactNode;
}) {
  return (
    <section className={layoutStyles.prototypeColumn}>
      <header className={layoutStyles.prototypeHeader}>
        <div>
          <span className={label === "TO-BE" ? layoutStyles.toBeLabel : layoutStyles.asIsLabel}>{label}</span>
          <strong>{meta}</strong>
        </div>
        <button type="button" onClick={onReset}>다시 시작</button>
      </header>
      <div className={layoutStyles.phoneStage}>{children}</div>
    </section>
  );
}
