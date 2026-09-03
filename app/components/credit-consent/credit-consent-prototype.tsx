"use client";

import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import {
  CarrierSelectionScreen,
  type Carrier,
} from "../loan-prototype/carrier-selection-screen";
import {
  NameInputScreen,
  PhoneInputScreen,
  ResidentInputScreen,
} from "../loan-prototype/identity-input-screens";
import { VerificationCodeScreen } from "../loan-prototype/verification-code-screen";
import {
  FlowScreen,
  InlineNextButton,
} from "../loan-prototype/flow-navigation";
import {
  CertificateSelectionSheet,
  PublicDataEntryScreen,
} from "../loan-prototype/public-data-screens";
import { LoadingSpinner } from "../loan-prototype/loading-spinner";
import styles from "./credit-consent.module.css";

type Step =
  | "counselor"
  | "agreement-type"
  | "required-agreement"
  | "carrier-selection"
  | "name-input"
  | "phone-input"
  | "resident-input"
  | "verification-code"
  | "vehicle-number"
  | "lpoint-choice"
  | "public-data-entry"
  | "electronic-signature";
type AgreementType = "summary" | "full";
type AgreementGroup = { id: string; title: string; documents: string[] };

const steps: Array<{ id: Step; number: string; label: string }> = [
  { id: "counselor", number: "01", label: "상담사 입력" },
  { id: "agreement-type", number: "02", label: "동의서 선택" },
  { id: "required-agreement", number: "03", label: "필수동의" },
  { id: "carrier-selection", number: "04", label: "통신사 선택" },
  { id: "name-input", number: "05", label: "이름 입력" },
  { id: "phone-input", number: "06", label: "휴대폰번호 입력" },
  { id: "resident-input", number: "07", label: "주민등록번호 입력" },
  { id: "verification-code", number: "08", label: "인증번호 입력" },
  { id: "vehicle-number", number: "09", label: "자동차번호 입력" },
  { id: "lpoint-choice", number: "10", label: "엘포인트 여부" },
  { id: "electronic-signature", number: "11", label: "전자서명" },
  { id: "public-data-entry", number: "12", label: "공공마이데이터 진입" },
];

const loanAgreementGroups: AgreementGroup[] = [
  { id: "collect", title: "개인(신용)정보 수집 · 이용 동의", documents: ["개인(신용) 필수적 정보 수집 · 이용 동의", "고유식별정보 수집 · 이용 동의", "민감정보 수집 · 이용 동의"] },
  { id: "inquiry", title: "개인(신용)정보 조회 동의", documents: ["개인(신용) 필수적 정보 조회 동의", "고유식별정보 조회 동의"] },
  { id: "provide", title: "개인(신용)정보 제공 동의", documents: ["개인(신용) 필수적 정보 제공 동의", "고유식별정보 제공 동의"] },
  { id: "sunshine", title: "[햇살론] 개인(신용)정보 수집 · 이용 · 제공 동의", documents: ["개인(신용)정보 수집 · 이용 · 제공 · 조회 동의서(신용보증 신청용)", "개인(신용)정보 수집 · 이용 · 제공 · 조회 동의서(금융 대안정보 활용 신청용)", "개인(신용)정보 이용 · 제공 동의서(비금융 대안정보 활용 신청용)"] },
  { id: "identity", title: "휴대폰 본인 확인 서비스 동의", documents: ["개인(신용) 필수적 정보 수집 · 이용 · 제공 동의", "고유식별정보 수집 · 이용 · 제공 동의", "서비스 이용약관 동의", "통신사 이용약관 동의"] },
  { id: "mobile-safe", title: "모바일안심플러스 서비스 동의", documents: ["개인(신용) 필수적 정보 수집 · 이용 · 제공 동의(롯데캐피탈)", "개인정보 제3자 제공 동의(KCB)", "개인정보 제3자 제공 동의(이동통신사)", "서비스 약관 동의(모바일안심플러스)"] },
];

const publicDataAgreementGroups: AgreementGroup[] = [
  { id: "public-collect", title: "개인(신용)정보 수집 · 이용 동의", documents: ["개인(신용) 필수적 정보 수집 · 이용 동의", "고유식별정보 수집 · 이용 동의"] },
  { id: "public-provide", title: "개인(신용)정보 제공 동의", documents: ["개인(신용) 필수적 정보 제공 동의", "고유식별정보 제공 동의"] },
  { id: "public-request", title: "본인 행정정보 제공요구신청", documents: ["본인정보 제공 · 이용에 관한 사항", "본인정보 제공 · 이용 항목에 관한 사항"] },
];
const allGroups = [...loanAgreementGroups, ...publicDataAgreementGroups];

function StatusBar() {
  return <div className={styles.statusBar} aria-label="모바일 상태 표시줄"><strong>9:41</strong><div className={styles.statusIcons} aria-hidden="true"><span className={styles.signalIcon} /><svg className={styles.wifiIcon} viewBox="0 0 18 14"><path d="M1.5 4.8C5.7 1.2 12.3 1.2 16.5 4.8M4.3 7.7c2.6-2.1 6.8-2.1 9.4 0M7.2 10.5c1-.7 2.6-.7 3.6 0" /><circle cx="9" cy="12" r="1" /></svg><span className={styles.batteryIcon} /></div></div>;
}

function BackButton({ label, onClick }: { label: string; onClick: () => void }) {
  return <button type="button" className={styles.backButton} onClick={onClick} aria-label={label}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 4-8 8 8 8" /></svg></button>;
}

function Check({ checked, label, onClick, large = false }: { checked: boolean; label: string; onClick: () => void; large?: boolean }) {
  return <button type="button" role="checkbox" aria-checked={checked} aria-label={label} className={`${styles.check} ${checked ? styles.checkSelected : ""} ${large ? styles.checkLarge : ""}`} onClick={onClick}><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5.2 10.1 3.1 3.1 6.5-7" /></svg></button>;
}

function AgreementSection({ group, checked, expanded, onCheck, onExpand, onOpen }: { group: AgreementGroup; checked: boolean; expanded: boolean; onCheck: () => void; onExpand: () => void; onOpen: (title: string) => void }) {
  return <div className={styles.agreementSection}>
    <div className={styles.agreementRow}>
      <Check checked={checked} label={`${group.title} ${checked ? "동의 해제" : "동의"}`} onClick={onCheck} />
      <button type="button" className={styles.expandButton} onClick={onExpand} aria-expanded={expanded}><span>{group.title}</span><svg className={expanded ? styles.chevronOpen : ""} viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg></button>
    </div>
    <div className={`${styles.documentList} ${expanded ? styles.documentListOpen : ""}`}><div>{group.documents.map((document) => <button type="button" className={styles.documentRow} key={document} onClick={() => onOpen(document)}><span>·&nbsp; {document}</span><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3.5 4.5 4.5L6 12.5" /></svg></button>)}</div></div>
  </div>;
}

function NextArrow() {
  return <span className={styles.nextCircle}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg></span>;
}

function CounselorScreen({ value, onChange, onNext }: { value: string; onChange: (value: string) => void; onNext: () => void }) {
  const [status, setStatus] = useState<"idle" | "checking" | "success" | "error">("idle");
  const verificationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (verificationTimerRef.current) clearTimeout(verificationTimerRef.current);
  }, []);

  function handleChange(nextValue: string) {
    if (verificationTimerRef.current) clearTimeout(verificationTimerRef.current);
    verificationTimerRef.current = null;
    setStatus("idle");
    onChange(nextValue);
  }

  function handleBlur() {
    if (!value || status === "success" || status === "checking") return;
    setStatus("checking");
    verificationTimerRef.current = setTimeout(() => {
      setStatus(/^10\d*$/.test(value) ? "success" : "error");
      verificationTimerRef.current = null;
    }, 650);
  }

  const heading = status === "success"
    ? "김롯데 상담사 입니다"
    : status === "error"
      ? "상담사 번호를 다시 확인후 입력해주세요"
      : "상담사 번호를 입력해주세요";

  return <div className={styles.appScreen}>
    <StatusBar />
    <div className={styles.appNav}><BackButton label="이전 화면으로 돌아가기" onClick={() => undefined} /></div>
    <main className={styles.counselorContent}>
      <h2 className={status === "error" ? styles.counselorErrorTitle : undefined}>{heading}</h2>
      {status === "success" ? <p className={styles.counselorSubtext}>현재 상담 진행중인 상담사가 맞으신가요?</p> : null}
      <p className={styles.inputNotice}><span>i</span> 특수문자(“-”) 없이 숫자만 입력해주세요</p>
      <label className={styles.inputWrap}><span className={styles.srOnly}>상담사 번호</span><input type="text" inputMode="numeric" autoComplete="off" value={value} placeholder="10" disabled={status === "checking"} aria-invalid={status === "error"} onChange={(event) => handleChange(event.target.value.replace(/\D/g, "").slice(0, 12))} onBlur={handleBlur} /></label>
      {status === "success" ? <button type="button" className={styles.nextButton} onClick={onNext}><span>다음</span><NextArrow /></button> : null}
    </main>
    {status === "checking" ? <div className={styles.counselorLoading}><LoadingSpinner label="상담사 정보 확인 중" /><p>상담사 정보를 확인하고 있어요</p></div> : null}
    <span className={styles.homeIndicator} aria-hidden="true" />
  </div>;
}

function AgreementTypeSheet({ selected, onSelect, onConfirm }: { selected: AgreementType; onSelect: (type: AgreementType) => void; onConfirm: () => void }) {
  const options: Array<{ id: AgreementType; label: string; description?: string }> = [
    { id: "summary", label: "요약동의서로 볼게요", description: "전체동의서의 핵심내용을 알기 쉽게 요약한 동의서입니다" },
    { id: "full", label: "전체동의서로 볼게요" },
  ];
  return <div className={styles.sheetLayer} role="dialog" aria-modal="true" aria-labelledby="agreement-sheet-title"><div className={styles.dimLayer} aria-hidden="true" /><section className={styles.bottomSheet}>
    <h2 id="agreement-sheet-title">동의서 종류를 선택해주세요</h2><p>요약동의서는 전체동의서의 핵심내용을<br />알기 쉽게 요약한 동의서입니다</p>
    <div className={styles.radioList} role="radiogroup" aria-label="동의서 종류">{options.map((option) => { const isSelected = selected === option.id; return <button type="button" role="radio" aria-checked={isSelected} className={styles.radioOption} key={option.id} onClick={() => onSelect(option.id)}><span className={`${styles.radioMark} ${isSelected ? styles.radioSelected : ""}`}><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5.3 10.1 3 3 6.4-7" /></svg></span><span><strong>{option.label}</strong>{option.description ? <small>{option.description}</small> : null}</span></button>; })}</div>
    <button type="button" className={styles.confirmButton} onClick={onConfirm}>확인</button>
  </section></div>;
}

type AgreementScreenProps = {
  agreements: Record<string, boolean>; expanded: Set<string>; scrollRef: RefObject<HTMLDivElement | null>; onBack: () => void; onContinue: () => void; onToggle: (id: string) => void; onToggleLoanAll: () => void; onExpand: (id: string) => void; onOpen: (title: string) => void; showSheet?: boolean; agreementType: AgreementType; onAgreementTypeChange: (type: AgreementType) => void; onConfirmType: () => void;
};

function RequiredAgreementScreen({ agreements, expanded, scrollRef, onBack, onContinue, onToggle, onToggleLoanAll, onExpand, onOpen, showSheet = false, agreementType, onAgreementTypeChange, onConfirmType }: AgreementScreenProps) {
  const allLoanChecked = loanAgreementGroups.every((group) => agreements[group.id]);
  const allChecked = allGroups.every((group) => agreements[group.id]);
  return <div className={styles.appScreen}>
    <StatusBar /><div className={styles.appNav}><BackButton label="이전 화면으로 돌아가기" onClick={onBack} /></div>
    <div className={styles.agreementScroll} ref={scrollRef}>
      <header className={styles.agreementTitle}><h2>대출 신청에 필요한<br />필수 동의예요</h2></header>
      <section className={styles.agreementBlock}><div className={styles.masterRow}><Check checked={allLoanChecked} label="대출조회 필수 동의 전체 선택" onClick={onToggleLoanAll} large /><strong>대출조회 필수 동의</strong></div>{loanAgreementGroups.map((group) => <AgreementSection key={group.id} group={group} checked={Boolean(agreements[group.id])} expanded={expanded.has(group.id)} onCheck={() => onToggle(group.id)} onExpand={() => onExpand(group.id)} onOpen={onOpen} />)}</section>
      <section className={`${styles.agreementBlock} ${styles.publicBlock}`}><h3>공공마이데이터 활용 필수 동의</h3><p>안전한 서류 확인을 위해 항목별 동의가 필요합니다</p>{publicDataAgreementGroups.map((group) => <AgreementSection key={group.id} group={group} checked={Boolean(agreements[group.id])} expanded={expanded.has(group.id)} onCheck={() => onToggle(group.id)} onExpand={() => onExpand(group.id)} onOpen={onOpen} />)}</section><div className={styles.scrollSpacer} />
    </div>
    {allChecked && !showSheet ? <div className={styles.floatingNext}><button type="button" onClick={onContinue}><span>다음</span><NextArrow /></button></div> : null}
    <span className={styles.homeIndicator} aria-hidden="true" />
    {showSheet ? <AgreementTypeSheet selected={agreementType} onSelect={onAgreementTypeChange} onConfirm={onConfirmType} /> : null}
  </div>;
}

function AgreementDetail({ title, onClose }: { title: string; onClose: () => void }) {
  return <section className={styles.detailLayer} aria-label={`${title} 상세`}><StatusBar /><div className={styles.detailNav}><BackButton label="필수동의로 돌아가기" onClick={onClose} /><strong>동의서 상세</strong></div><div className={styles.detailContent}><h2>{title}</h2><p>본 동의서는 신용정보 조회 및 대출 상담 진행에 필요한 필수 사항을 안내합니다.</p><h3>수집·이용 목적</h3><p>대출 상담, 신용도 판단, 본인 확인 및 관련 법령에 따른 업무 처리를 위해 이용합니다.</p><h3>보유 및 이용 기간</h3><p>거래 종료일로부터 관련 법령이 정한 기간까지 안전하게 보관하며, 목적 달성 후 파기합니다.</p></div><button type="button" className={styles.detailConfirm} onClick={onClose}>확인</button><span className={styles.homeIndicator} aria-hidden="true" /></section>;
}

function VehicleNumberScreen({
  value,
  noVehicle,
  onValueChange,
  onNoVehicleChange,
  onBack,
  onNext,
}: {
  value: string;
  noVehicle: boolean;
  onValueChange: (value: string) => void;
  onNoVehicleChange: (selected: boolean) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const composingRef = useRef(false);
  const validVehicleNumber = /^\d{2,3}[가-힣]\d{4}$/.test(value);
  const canContinue = noVehicle || validVehicleNumber;

  function normalizeVehicleNumber(input: string) {
    return input.replace(/[^0-9ㄱ-ㅎㅏ-ㅣ가-힣]/g, "").slice(0, 8);
  }

  function toggleNoVehicle() {
    onNoVehicleChange(!noVehicle);
  }

  return (
    <FlowScreen onBack={onBack} backLabel="인증번호 입력으로 돌아가기">
      <div className={styles.vehicleContent}>
        <label className={styles.vehicleLabel} htmlFor="vehicle-number">
          자동차 번호를 입력해주세요
        </label>
        <input
          id="vehicle-number"
          className={styles.vehicleInput}
          value={value}
          readOnly={noVehicle}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          lang="ko"
          placeholder="12가1234"
          maxLength={8}
          onChange={(event) => {
            const next = composingRef.current
              ? event.target.value.slice(0, 8)
              : normalizeVehicleNumber(event.target.value);
            onValueChange(next);
          }}
          onCompositionStart={() => {
            composingRef.current = true;
          }}
          onCompositionEnd={(event) => {
            composingRef.current = false;
            onValueChange(normalizeVehicleNumber(event.currentTarget.value));
          }}
        />
        <div className={styles.noVehicleRow}>
          <Check
            checked={noVehicle}
            label={noVehicle ? "자동차 없음 선택 해제" : "자동차 없음 선택"}
            onClick={toggleNoVehicle}
            large
          />
          <button type="button" onClick={toggleNoVehicle}>자동차 없음</button>
        </div>
        <p className={styles.vehicleNotice}><span>i</span> 자동차 번호가 있으면 추가적인 금리 인하가 가능해요</p>
        {canContinue ? (
          <div className={styles.vehicleAction}>
            <InlineNextButton label="다음" onClick={onNext} />
          </div>
        ) : null}
      </div>
    </FlowScreen>
  );
}

type LpointChoice = "yes" | "no";

function LpointChoiceScreen({
  value,
  onChange,
  onBack,
  onNext,
}: {
  value: LpointChoice | null;
  onChange: (value: LpointChoice) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const options: Array<{ id: LpointChoice; label: string }> = [
    { id: "yes", label: "예 동의합니다" },
    { id: "no", label: "아니요" },
  ];

  return (
    <FlowScreen onBack={onBack} backLabel="자동차번호 입력으로 돌아가기">
      <div className={styles.lpointContent}>
        <h2>
          L.POINT 이벤트 참여를 위한 회원 확인에
          <br />동의하시겠습니까?
        </h2>
        <div className={styles.lpointOptions} role="radiogroup" aria-label="L.POINT 회원 확인 동의 여부">
          {options.map((option) => {
            const selected = value === option.id;
            return (
              <button
                type="button"
                role="radio"
                aria-checked={selected}
                className={styles.lpointOption}
                key={option.id}
                onClick={() => onChange(option.id)}
              >
                <span className={selected ? styles.lpointMarkSelected : ""}>
                  <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5.2 10.1 3.1 3.1 6.5-7" /></svg>
                </span>
                <strong>{option.label}</strong>
              </button>
            );
          })}
        </div>
        {value ? (
          <div className={styles.lpointAction}>
            <InlineNextButton label="다음" onClick={onNext} />
          </div>
        ) : null}
      </div>
    </FlowScreen>
  );
}

export function CreditConsentPrototype() {
  const [step, setStep] = useState<Step>("counselor");
  const [counselorNumber, setCounselorNumber] = useState("");
  const [counselorSession, setCounselorSession] = useState(0);
  const [agreementType, setAgreementType] = useState<AgreementType>("summary");
  const [agreements, setAgreements] = useState<Record<string, boolean>>(() => Object.fromEntries(allGroups.map((group) => [group.id, false])));
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [detailTitle, setDetailTitle] = useState<string | null>(null);
  const [selectedCarrier, setSelectedCarrier] = useState<Carrier | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("01012345678");
  const [birthDate, setBirthDate] = useState("");
  const [genderDigit, setGenderDigit] = useState("");
  const [privateDigits, setPrivateDigits] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [noVehicle, setNoVehicle] = useState(false);
  const [lpointChoice, setLpointChoice] = useState<LpointChoice | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const genderInputRef = useRef<HTMLInputElement>(null);
  const privateInputRef = useRef<HTMLInputElement>(null);
  const carrierTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentIndex = steps.findIndex((item) => item.id === step);
  const current = steps[currentIndex];

  useEffect(() => () => {
    if (carrierTimerRef.current) clearTimeout(carrierTimerRef.current);
  }, []);

  function navigate(next: Step) {
    if (carrierTimerRef.current) clearTimeout(carrierTimerRef.current);
    carrierTimerRef.current = null;
    setDetailTitle(null);
    setStep(next);
    requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: 0 }));
  }
  function handleCarrierSelect(carrier: Carrier) {
    if (carrierTimerRef.current) clearTimeout(carrierTimerRef.current);
    setSelectedCarrier(carrier);
    carrierTimerRef.current = setTimeout(() => {
      setStep("name-input");
      carrierTimerRef.current = null;
    }, 700);
  }
  function reset() {
    if (carrierTimerRef.current) clearTimeout(carrierTimerRef.current);
    carrierTimerRef.current = null;
    setStep("counselor"); setCounselorNumber(""); setAgreementType("summary");
    setCounselorSession((session) => session + 1);
    setAgreements(Object.fromEntries(allGroups.map((group) => [group.id, false])));
    setExpanded(new Set()); setDetailTitle(null); setSelectedCarrier(null);
    setCustomerName(""); setPhoneNumber("01012345678"); setBirthDate("");
    setGenderDigit(""); setPrivateDigits(""); setVerificationCode("");
    setVehicleNumber(""); setNoVehicle(false); setLpointChoice(null);
  }
  function toggleAgreement(id: string) { setAgreements((currentAgreements) => ({ ...currentAgreements, [id]: !currentAgreements[id] })); }
  function toggleLoanAll() { const checked = loanAgreementGroups.every((group) => agreements[group.id]); setAgreements((currentAgreements) => { const next = { ...currentAgreements }; loanAgreementGroups.forEach((group) => { next[group.id] = !checked; }); return next; }); }
  function toggleExpanded(id: string) { setExpanded((currentExpanded) => { const next = new Set(currentExpanded); if (next.has(id)) next.delete(id); else next.add(id); return next; }); }

  return <section className={`workspace-card ${styles.workspace}`}>
    <div className="workspace-card-header"><div><span className="workspace-kicker">INTERACTIVE MOBILE PROTOTYPE</span><h2>신용정보조회동의</h2></div><div className={styles.workspaceActions}><span className={styles.stepBadge}>{current.number} {current.label}</span><button type="button" className={styles.resetButton} onClick={reset}>다시 시작</button></div></div>
    <nav className={styles.flowGraph} aria-label="신용정보조회동의 단계 바로가기"><div className={styles.flowHeader}><span>CREDIT CONSENT FLOW</span><p>단계를 선택하면 해당 화면으로 이동합니다.</p></div><div className={styles.flowScroll}><ol className={styles.flowList} style={{ "--step-count": steps.length } as CSSProperties}>{steps.map((item, index) => <li key={item.id}><button type="button" className={`${styles.flowNode} ${index < currentIndex ? styles.flowVisited : ""} ${item.id === step ? styles.flowActive : ""}`} aria-current={item.id === step ? "step" : undefined} onClick={() => navigate(item.id)}><span>{item.number}</span><strong>{item.label}</strong></button></li>)}</ol></div></nav>
    <div className={styles.prototypeStage}><div className={styles.phoneFrame}>
      {step === "counselor" ? <CounselorScreen key={counselorSession} value={counselorNumber} onChange={setCounselorNumber} onNext={() => navigate("agreement-type")} /> : null}
      {step === "agreement-type" || step === "required-agreement" ? <RequiredAgreementScreen agreements={agreements} expanded={expanded} scrollRef={scrollRef} onBack={() => navigate(step === "agreement-type" ? "counselor" : "agreement-type")} onContinue={() => navigate("carrier-selection")} onToggle={toggleAgreement} onToggleLoanAll={toggleLoanAll} onExpand={toggleExpanded} onOpen={setDetailTitle} showSheet={step === "agreement-type"} agreementType={agreementType} onAgreementTypeChange={setAgreementType} onConfirmType={() => navigate("required-agreement")} /> : null}
      {step === "carrier-selection" ? <CarrierSelectionScreen selectedCarrier={selectedCarrier} onBack={() => navigate("required-agreement")} onSelect={handleCarrierSelect} /> : null}
      {step === "name-input" ? <NameInputScreen name={customerName} onNameChange={setCustomerName} onBack={() => navigate("carrier-selection")} onNext={() => navigate("phone-input")} /> : null}
      {step === "phone-input" ? <PhoneInputScreen phoneNumber={phoneNumber} onPhoneNumberChange={setPhoneNumber} onBack={() => navigate("name-input")} onNext={() => navigate("resident-input")} /> : null}
      {step === "resident-input" ? <ResidentInputScreen birthDate={birthDate} genderDigit={genderDigit} privateDigits={privateDigits} genderInputRef={genderInputRef} privateInputRef={privateInputRef} onBirthDateChange={setBirthDate} onGenderDigitChange={setGenderDigit} onPrivateDigitsChange={setPrivateDigits} onBack={() => navigate("phone-input")} onRequestVerification={() => navigate("verification-code")} /> : null}
      {step === "verification-code" ? <VerificationCodeScreen code={verificationCode} onCodeChange={setVerificationCode} onBack={() => navigate("resident-input")} onNext={() => navigate("vehicle-number")} /> : null}
      {step === "vehicle-number" ? <VehicleNumberScreen value={vehicleNumber} noVehicle={noVehicle} onValueChange={(value) => { setVehicleNumber(value); setNoVehicle(false); }} onNoVehicleChange={(selected) => { setNoVehicle(selected); setVehicleNumber(selected ? "자동차 없음" : ""); }} onBack={() => navigate("verification-code")} onNext={() => navigate("lpoint-choice")} /> : null}
      {step === "lpoint-choice" ? <LpointChoiceScreen value={lpointChoice} onChange={setLpointChoice} onBack={() => navigate("vehicle-number")} onNext={() => navigate("electronic-signature")} /> : null}
      {step === "public-data-entry" ? <PublicDataEntryScreen onBack={() => navigate("lpoint-choice")} /> : null}
      {step === "electronic-signature" ? <><PublicDataEntryScreen onBack={() => navigate("lpoint-choice")} /><CertificateSelectionSheet onClose={() => navigate("public-data-entry")} onSelect={() => undefined} /></> : null}
      {detailTitle ? <AgreementDetail title={detailTitle} onClose={() => setDetailTitle(null)} /> : null}
    </div><aside className={styles.demoGuide}><span>DEMO GUIDE</span><h3>신용정보 조회 동의를 직접 진행해보세요</h3><ol><li><b>01</b><span><strong>10</strong>으로 시작하는 상담사번호 입력</span></li><li><b>02–03</b><span>동의서 선택 및 필수동의</span></li><li><b>04–07</b><span>통신사·본인정보 입력</span></li><li><b>08–09</b><span>인증번호 및 자동차번호 입력</span></li><li><b>10</b><span>L.POINT 회원 확인 동의 여부 선택</span></li><li><b>11</b><span>인증서 선택 바텀시트</span></li><li><b>12</b><span>공공마이데이터 진입 안내</span></li></ol><p>L.POINT 선택 후 전자서명으로 이어집니다. 인증서 항목은 시연 범위에 따라 후속 화면으로 이동하지 않습니다.</p></aside></div>
  </section>;
}
