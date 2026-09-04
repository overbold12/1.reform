"use client";

import { useRef, useState } from "react";
import {
  allAgreementGroups,
  loanAgreementGroups,
} from "../loan-prototype/agreement-data";
import { AgreementCheck } from "../loan-prototype/agreement-check";
import { AgreementDetail } from "../loan-prototype/agreement-detail";
import { MobileStatusBar } from "../loan-prototype/mobile-status-bar";
import { RequiredAgreementScreen } from "../loan-prototype/required-agreement-screen";
import loanStyles from "../loan-prototype/loan-prototype.module.css";
import styles from "./consent-comparison.module.css";

type AsIsStep = "required" | "identity" | "terms-one" | "terms-two";

const asIsSteps: Array<{ id: AsIsStep; label: string }> = [
  { id: "required", label: "필수 동의" },
  { id: "identity", label: "본인인증 동의" },
  { id: "terms-one", label: "약관동의 (1)" },
  { id: "terms-two", label: "약관동의 (2)" },
];

const requiredConsentItems = [
  {
    id: "credit",
    title: "개인(신용)정보 필수적 동의서",
    documents: [
      "개인(신용)정보 수집 · 이용 동의",
      "개인(신용)정보 조회 동의",
      "개인(신용)정보 제공 동의",
    ],
  },
  {
    id: "public-collect",
    title: "공공마이데이터 개인(신용)정보 수집 · 이용 동의",
    documents: [
      "개인(신용) 필수적 정보 수집 · 이용 동의",
      "고유식별정보 수집 · 이용 동의",
    ],
  },
  {
    id: "public-provide",
    title: "공공마이데이터 개인(신용)정보 제공 동의",
    documents: [
      "개인(신용) 필수적 정보 제공 동의",
      "고유식별정보 제공 동의",
    ],
  },
  {
    id: "public-request",
    title: "본인 행정정보 제공요구신청",
    documents: [
      "본인정보 제공 · 이용에 관한 사항",
      "본인정보 제공 · 이용 항목에 관한 사항",
    ],
  },
];

const identityConsentItems = [
  "휴대폰 본인확인 서비스 동의",
  "모바일안심플러스 서비스 동의",
];

const termsOneItems = [
  "대출약관 안내 및 동의",
  "여신거래기본약관",
  "전자금융거래기본약관",
  "자동이체약관",
];

const termsTwoItems = [
  "장단기 연체정보 등록에 대한 안내",
  "고액 신용대출의 사후 용도관리 강화 관련 추가약정",
  "국토교통부 주택소유확인 시스템 등 이용 관련 동의",
];

function emptySelection(ids: string[]) {
  return Object.fromEntries(ids.map((id) => [id, false]));
}

export function PartnerLoanConsentComparison() {
  return (
    <div className={styles.comparisonGrid}>
      <AsIsConsentPrototype />
      <div className={styles.comparisonDirection} aria-hidden="true">
        <span>4 PAGES</span>
        <svg viewBox="0 0 32 24">
          <path d="M3 12h24M20 5l7 7-7 7" />
        </svg>
        <span>1 PAGE</span>
      </div>
      <ToBeRequiredAgreementPrototype />
    </div>
  );
}

function AsIsConsentPrototype() {
  const [step, setStep] = useState<AsIsStep>("required");
  const [completed, setCompleted] = useState(false);
  const [detailTitle, setDetailTitle] = useState<string | null>(null);
  const [requiredChecks, setRequiredChecks] = useState<Record<string, boolean>>(
    emptySelection(requiredConsentItems.map((item) => item.id)),
  );
  const [phoneNumber, setPhoneNumber] = useState("");
  const [identityChecks, setIdentityChecks] = useState<Record<string, boolean>>(
    emptySelection(identityConsentItems),
  );
  const [termsOneChecks, setTermsOneChecks] = useState<Record<string, boolean>>(
    emptySelection(termsOneItems),
  );
  const [termsTwoChecks, setTermsTwoChecks] = useState<Record<string, boolean>>(
    emptySelection(termsTwoItems),
  );

  const stepIndex = asIsSteps.findIndex((item) => item.id === step);

  function reset() {
    setStep("required");
    setCompleted(false);
    setDetailTitle(null);
    setRequiredChecks(emptySelection(requiredConsentItems.map((item) => item.id)));
    setPhoneNumber("");
    setIdentityChecks(emptySelection(identityConsentItems));
    setTermsOneChecks(emptySelection(termsOneItems));
    setTermsTwoChecks(emptySelection(termsTwoItems));
  }

  function moveBack() {
    if (stepIndex > 0) setStep(asIsSteps[stepIndex - 1].id);
  }

  function moveNext() {
    if (stepIndex < asIsSteps.length - 1) {
      setStep(asIsSteps[stepIndex + 1].id);
      return;
    }
    setCompleted(true);
  }

  return (
    <PrototypeColumn
      label="AS-IS"
      meta={`Step ${stepIndex + 1} / ${asIsSteps.length}`}
      onReset={reset}
    >
      <div className={loanStyles.phoneFrame}>
        {step === "required" ? (
          <RequiredConsentAsIsScreen
            checks={requiredChecks}
            onBack={moveBack}
            onChange={setRequiredChecks}
            onDetail={setDetailTitle}
            onNext={moveNext}
          />
        ) : null}
        {step === "identity" ? (
          <IdentityConsentAsIsScreen
            checks={identityChecks}
            phoneNumber={phoneNumber}
            onBack={moveBack}
            onChange={setIdentityChecks}
            onDetail={setDetailTitle}
            onNext={moveNext}
            onPhoneNumberChange={setPhoneNumber}
          />
        ) : null}
        {step === "terms-one" ? (
          <TermsConsentAsIsScreen
            checks={termsOneChecks}
            items={termsOneItems}
            step="3"
            onBack={moveBack}
            onChange={setTermsOneChecks}
            onDetail={setDetailTitle}
            onNext={moveNext}
          />
        ) : null}
        {step === "terms-two" ? (
          <TermsConsentAsIsScreen
            checks={termsTwoChecks}
            items={termsTwoItems}
            step="4"
            onBack={moveBack}
            onChange={setTermsTwoChecks}
            onDetail={setDetailTitle}
            onNext={moveNext}
          />
        ) : null}
        {detailTitle ? (
          <AgreementDetail title={detailTitle} onClose={() => setDetailTitle(null)} />
        ) : null}
        {completed ? <CompletionToast text="AS-IS 필수 동의 절차를 완료했습니다." /> : null}
      </div>
      <StepNavigation currentStep={step} onChange={setStep} />
    </PrototypeColumn>
  );
}

function RequiredConsentAsIsScreen({
  checks,
  onChange,
  onDetail,
  onBack,
  onNext,
}: {
  checks: Record<string, boolean>;
  onChange: (checks: Record<string, boolean>) => void;
  onDetail: (title: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const allChecked = requiredConsentItems.every((item) => checks[item.id]);

  return (
    <AsIsScreen>
      <SimpleNav onBack={onBack} />
      <div className={styles.screenScroll}>
        <header className={styles.screenTitle}>
          <span>필수동의</span>
          <h3>대출 신청을 위한<br />동의를 진행해 주세요.</h3>
        </header>
        <div className={styles.consentSections}>
          {requiredConsentItems.map((item) => (
            <section className={styles.consentGroup} key={item.id}>
              <div className={styles.groupTitle}>
                <AgreementCheck
                  checked={Boolean(checks[item.id])}
                  label={`${item.title} ${checks[item.id] ? "동의 해제" : "동의"}`}
                  onChange={() => onChange({ ...checks, [item.id]: !checks[item.id] })}
                  prominent
                />
                <strong>{item.title}</strong>
              </div>
              {item.documents.map((document) => (
                <DocumentButton title={document} key={document} onClick={() => onDetail(document)} />
              ))}
            </section>
          ))}
        </div>
        <div className={styles.scrollSpace} />
      </div>
      {allChecked ? <FloatingNext onClick={onNext} /> : null}
    </AsIsScreen>
  );
}

function IdentityConsentAsIsScreen({
  phoneNumber,
  checks,
  onPhoneNumberChange,
  onChange,
  onDetail,
  onBack,
  onNext,
}: {
  phoneNumber: string;
  checks: Record<string, boolean>;
  onPhoneNumberChange: (value: string) => void;
  onChange: (checks: Record<string, boolean>) => void;
  onDetail: (title: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const allChecked = identityConsentItems.every((item) => checks[item]);
  const canContinue = phoneNumber.length >= 10 && allChecked;

  function toggleAll() {
    onChange(Object.fromEntries(identityConsentItems.map((item) => [item, !allChecked])));
  }

  return (
    <AsIsScreen>
      <SimpleNav onBack={onBack} />
      <main className={styles.identityContent}>
        <label htmlFor="as-is-phone">휴대폰번호를 입력해 주세요</label>
        <input
          id="as-is-phone"
          inputMode="numeric"
          value={phoneNumber}
          placeholder="숫자만 입력"
          onChange={(event) =>
            onPhoneNumberChange(event.target.value.replace(/\D/g, "").slice(0, 11))
          }
        />
        <div className={styles.identityMaster}>
          <AgreementCheck
            checked={allChecked}
            label="필수약관 전체 동의"
            onChange={toggleAll}
            prominent
          />
          <strong>필수약관 전체 동의</strong>
        </div>
        {identityConsentItems.map((item) => (
          <ConsentDocumentRow
            checked={Boolean(checks[item])}
            title={item}
            key={item}
            onCheck={() => onChange({ ...checks, [item]: !checks[item] })}
            onDetail={() => onDetail(item)}
          />
        ))}
      </main>
      {canContinue ? <FloatingNext onClick={onNext} /> : null}
    </AsIsScreen>
  );
}

function TermsConsentAsIsScreen({
  step,
  items,
  checks,
  onChange,
  onDetail,
  onBack,
  onNext,
}: {
  step: "3" | "4";
  items: string[];
  checks: Record<string, boolean>;
  onChange: (checks: Record<string, boolean>) => void;
  onDetail: (title: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const allChecked = items.every((item) => checks[item]);

  function toggleAll() {
    onChange(Object.fromEntries(items.map((item) => [item, !allChecked])));
  }

  return (
    <AsIsScreen inverse>
      <div className={styles.termsNav}>
        <button type="button" onClick={onBack} aria-label="이전 화면으로 돌아가기">×</button>
        <span>•• <b>3</b> 약관동의 <i>4</i><i>5</i></span>
      </div>
      <div className={styles.termsSheet}>
        <span className={styles.sheetHandle} aria-hidden="true" />
        {step === "3" ? (
          <>
            <h3>대출신청을 위해 필수 약관에<br />동의해 주세요</h3>
            <div className={styles.termsMaster}>
              <AgreementCheck
                checked={allChecked}
                label="서비스 이용약관 전체 동의"
                onChange={toggleAll}
                prominent
              />
              <strong>서비스 이용약관</strong>
            </div>
          </>
        ) : null}
        <div className={styles.termsRows}>
          {items.map((item) => (
            <ConsentDocumentRow
              checked={Boolean(checks[item])}
              title={item}
              key={item}
              onCheck={() => onChange({ ...checks, [item]: !checks[item] })}
              onDetail={() => onDetail(item)}
            />
          ))}
        </div>
        {allChecked ? <FloatingNext label={step === "4" ? "완료" : "다음"} onClick={onNext} /> : null}
      </div>
    </AsIsScreen>
  );
}

function ToBeRequiredAgreementPrototype() {
  const [agreements, setAgreements] = useState<Record<string, boolean>>(
    emptySelection(allAgreementGroups.map((group) => group.id)),
  );
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [detailTitle, setDetailTitle] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const allLoanChecked = loanAgreementGroups.every((group) => agreements[group.id]);
  const allRequiredChecked = allAgreementGroups.every((group) => agreements[group.id]);

  function reset() {
    setAgreements(emptySelection(allAgreementGroups.map((group) => group.id)));
    setExpandedGroups(new Set());
    setDetailTitle(null);
    setCompleted(false);
    scrollRef.current?.scrollTo({ top: 0 });
  }

  function toggleLoanAll() {
    setAgreements((current) => {
      const next = { ...current };
      loanAgreementGroups.forEach((group) => {
        next[group.id] = !allLoanChecked;
      });
      return next;
    });
  }

  function toggleExpanded(id: string) {
    setExpandedGroups((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <PrototypeColumn label="TO-BE" meta="통합 필수동의" onReset={reset}>
      <div className={loanStyles.phoneFrame}>
        <RequiredAgreementScreen
          agreements={agreements}
          expandedGroups={expandedGroups}
          allLoanAgreementsChecked={allLoanChecked}
          allRequiredChecked={allRequiredChecked}
          scrollRef={scrollRef}
          onBack={reset}
          onContinue={() => setCompleted(true)}
          onToggleLoanAll={toggleLoanAll}
          onToggleAgreement={(id) =>
            setAgreements((current) => ({ ...current, [id]: !current[id] }))
          }
          onToggleExpanded={toggleExpanded}
          onDocumentOpen={setDetailTitle}
        />
        {detailTitle ? (
          <AgreementDetail title={detailTitle} onClose={() => setDetailTitle(null)} />
        ) : null}
        {completed ? <CompletionToast text="TO-BE 필수 동의를 완료했습니다." /> : null}
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
  children: React.ReactNode;
}) {
  return (
    <section className={styles.prototypeColumn}>
      <header className={styles.prototypeHeader}>
        <div>
          <span className={label === "TO-BE" ? styles.toBeLabel : styles.asIsLabel}>{label}</span>
          <strong>{meta}</strong>
        </div>
        <button type="button" onClick={onReset}>다시 시작</button>
      </header>
      <div className={styles.phoneStage}>{children}</div>
    </section>
  );
}

function AsIsScreen({
  inverse = false,
  children,
}: {
  inverse?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`${styles.appScreen} ${inverse ? styles.inverseScreen : ""}`}>
      <MobileStatusBar inverse={inverse} />
      {children}
    </div>
  );
}

function SimpleNav({ onBack }: { onBack: () => void }) {
  return (
    <div className={styles.simpleNav}>
      <button type="button" onClick={onBack} aria-label="이전 화면으로 돌아가기">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 4-8 8 8 8" /></svg>
      </button>
    </div>
  );
}

function DocumentButton({ title, onClick }: { title: string; onClick: () => void }) {
  return (
    <button type="button" className={styles.documentButton} onClick={onClick}>
      <span>✓</span><span>{title}</span><b>⌄</b>
    </button>
  );
}

function ConsentDocumentRow({
  title,
  checked,
  onCheck,
  onDetail,
}: {
  title: string;
  checked: boolean;
  onCheck: () => void;
  onDetail: () => void;
}) {
  return (
    <div className={styles.consentDocumentRow}>
      <AgreementCheck checked={checked} label={`${title} 동의`} onChange={onCheck} />
      <button type="button" onClick={onDetail}><span>{title}</span><b>›</b></button>
    </div>
  );
}

function FloatingNext({ label = "다음", onClick }: { label?: string; onClick: () => void }) {
  return (
    <div className={styles.floatingNext}>
      <button type="button" onClick={onClick}>
        <span>{label}</span>
        <i><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg></i>
      </button>
    </div>
  );
}

function StepNavigation({
  currentStep,
  onChange,
}: {
  currentStep: AsIsStep;
  onChange: (step: AsIsStep) => void;
}) {
  return (
    <div className={styles.stepNavigation} aria-label="AS-IS 화면 바로가기">
      {asIsSteps.map((item, index) => (
        <button
          type="button"
          className={currentStep === item.id ? styles.stepActive : ""}
          aria-current={currentStep === item.id ? "step" : undefined}
          key={item.id}
          onClick={() => onChange(item.id)}
        >
          <span>{index + 1}</span>{item.label}
        </button>
      ))}
    </div>
  );
}

function CompletionToast({ text }: { text: string }) {
  return <div className={styles.completionToast} role="status">✓ {text}</div>;
}
