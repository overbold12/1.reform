"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { CreditConsentFirstNinePrototype } from "../credit-consent/credit-consent-prototype";
import { AgreementDetail } from "../loan-prototype/agreement-detail";
import { MobileStatusBar } from "../loan-prototype/mobile-status-bar";
import loanStyles from "../loan-prototype/loan-prototype.module.css";
import layoutStyles from "./consent-comparison.module.css";
import styles from "./credit-consent-interaction.module.css";

type AsIsStep =
  | "primary-type"
  | "primary-consent"
  | "sunshine-choice"
  | "sunshine-type"
  | "sunshine-consent"
  | "vehicle-choice"
  | "vehicle-number"
  | "auth-method"
  | "carrier";

type AgreementType = "summary" | "full";
type YesNo = "yes" | "no";
type AgreementGroup = { id: string; title: string; documents: string[] };

const primaryGroups: AgreementGroup[] = [
  {
    id: "personal",
    title: "개인(신용)정보 필수적 동의서",
    documents: [
      "개인(신용)정보 수집·이용 동의",
      "개인(신용)정보 조회 동의",
      "개인(신용)정보 제공 동의",
    ],
  },
  {
    id: "public-collect",
    title: "공공마이데이터 개인(신용)정보 수집·이용 동의",
    documents: ["개인(신용)필수적 정보 수집·이용 동의", "고유식별정보 수집·이용 동의"],
  },
  {
    id: "public-provide",
    title: "공공마이데이터 개인(신용)정보 제공 동의",
    documents: ["개인(신용)필수적 정보 제공 동의", "고유식별정보 제공 동의"],
  },
  {
    id: "public-request",
    title: "본인 행정정보 제공요구신청",
    documents: ["본인정보 제공·이용에 관한 사항", "본인정보 제공·이용 항목에 관한 사항"],
  },
];

const sunshineGroups: AgreementGroup[] = [
  {
    id: "sunshine-required",
    title: "개인(신용)정보 수집·이용·제공 필수적 동의서(햇살론)",
    documents: [
      "개인(신용)정보 수집·이용·제공·조회 동의서(신용보증 신청용)",
      "개인(신용)정보 수집·이용·제공·조회 동의서(비금융 대안정보 활용 신청용)",
      "개인(신용)정보 이용·제공 동의서(비금융 대안정보 활용 신청용)",
    ],
  },
  {
    id: "sunshine-optional",
    title: "개인(신용)정보 수집·이용 선택적 동의서(햇살론)",
    documents: [
      "개인(신용)정보 수집·이용 동의서(상품서비스 안내 등)",
      "개인(신용)정보 수집·이용 동의서(보증료 우대 서비스)",
    ],
  },
];

const asIsLabels: Record<AsIsStep, string> = {
  "primary-type": "1. 동의서 선택",
  "primary-consent": "2. 필수 동의",
  "sunshine-choice": "3. 햇살론 진행여부",
  "sunshine-type": "4. 햇살론 동의서 선택",
  "sunshine-consent": "5. 햇살론 필수동의",
  "vehicle-choice": "6. 자동차 보유여부",
  "vehicle-number": "7. 자동차번호 입력",
  "auth-method": "8. 인증방법 선택",
  carrier: "9. 통신사 선택",
};

function emptyChecks(groups: AgreementGroup[]) {
  return Object.fromEntries(
    groups.flatMap((group) =>
      group.documents.map((document) => [documentId(group.id, document), false]),
    ),
  );
}

function documentId(groupId: string, document: string) {
  return `${groupId}:${document}`;
}

export function CreditConsentInteractionComparison() {
  const [asIsResetKey, setAsIsResetKey] = useState(0);
  const [toBeResetKey, setToBeResetKey] = useState(0);
  const [toBeComplete, setToBeComplete] = useState(false);

  return (
    <div className={layoutStyles.comparisonGrid}>
      <PrototypeColumn
        label="AS-IS"
        meta="9개 화면 · 조건 분기형"
        onReset={() => setAsIsResetKey((key) => key + 1)}
      >
        <AsIsCreditConsentPrototype key={asIsResetKey} />
      </PrototypeColumn>

      <div className={layoutStyles.comparisonDirection} aria-hidden="true">
        <span>BRANCHED</span>
        <svg viewBox="0 0 32 24"><path d="M3 12h24M20 5l7 7-7 7" /></svg>
        <span>LINEAR</span>
      </div>

      <PrototypeColumn
        label="TO-BE"
        meta="01–09 · 일관된 흐름"
        onReset={() => {
          setToBeComplete(false);
          setToBeResetKey((key) => key + 1);
        }}
      >
        <div className={styles.toBeFrameWrap}>
          <CreditConsentFirstNinePrototype
            key={toBeResetKey}
            onComplete={() => setToBeComplete(true)}
          />
          {toBeComplete ? <CompletionToast>TO-BE 01–09 체험을 완료했습니다.</CompletionToast> : null}
        </div>
      </PrototypeColumn>
    </div>
  );
}

function AsIsCreditConsentPrototype() {
  const [step, setStep] = useState<AsIsStep>("primary-type");
  const [history, setHistory] = useState<AsIsStep[]>([]);
  const [primaryType, setPrimaryType] = useState<AgreementType>("summary");
  const [sunshineType, setSunshineType] = useState<AgreementType>("summary");
  const [primaryChecks, setPrimaryChecks] = useState<Record<string, boolean>>(() =>
    emptyChecks(primaryGroups),
  );
  const [sunshineChecks, setSunshineChecks] = useState<Record<string, boolean>>(() =>
    emptyChecks(sunshineGroups),
  );
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set([...primaryGroups, ...sunshineGroups].map((group) => group.id)),
  );
  const [detailTitle, setDetailTitle] = useState<string | null>(null);
  const [sunshineChoice, setSunshineChoice] = useState<YesNo | null>(null);
  const [vehicleChoice, setVehicleChoice] = useState<YesNo | null>(null);
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [selectedCarrier, setSelectedCarrier] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const vehicleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (vehicleTimerRef.current) clearTimeout(vehicleTimerRef.current);
    },
    [],
  );

  function go(next: AsIsStep) {
    setHistory((current) => [...current, step]);
    setStep(next);
  }

  function back() {
    if (vehicleTimerRef.current) {
      clearTimeout(vehicleTimerRef.current);
      vehicleTimerRef.current = null;
    }
    const previous = history.at(-1);
    if (!previous) return;
    setStep(previous);
    setHistory((current) => current.slice(0, -1));
  }

  function handleVehicleChoice(choice: YesNo) {
    if (vehicleTimerRef.current) clearTimeout(vehicleTimerRef.current);
    setVehicleChoice(choice);
    vehicleTimerRef.current = setTimeout(() => {
      go(choice === "yes" ? "vehicle-number" : "auth-method");
      vehicleTimerRef.current = null;
    }, 1200);
  }

  return (
    <div className={loanStyles.phoneFrame}>
      <span className={styles.stepPill}>{asIsLabels[step]}</span>
      {step === "primary-type" || step === "primary-consent" ? (
        <AgreementScreen
          title={<>신용정보 조회 약관에<br />동의해 주세요</>}
          groups={primaryGroups}
          checks={primaryChecks}
          expanded={expanded}
          onChecksChange={setPrimaryChecks}
          onExpandedChange={setExpanded}
          onDetail={setDetailTitle}
          onBack={back}
          onNext={() => go("sunshine-choice")}
          sheet={step === "primary-type"}
          agreementType={primaryType}
          onAgreementTypeChange={setPrimaryType}
          onSheetConfirm={() => go("primary-consent")}
        />
      ) : null}
      {step === "sunshine-choice" ? (
        <ChoiceScreen
          title={<>신용조회 시, 햇살론을<br />진행하시겠습니까?</>}
          value={sunshineChoice}
          onChange={setSunshineChoice}
          onBack={back}
          actionLabel="확인"
          onAction={() =>
            sunshineChoice && go(sunshineChoice === "yes" ? "sunshine-type" : "vehicle-choice")
          }
        />
      ) : null}
      {step === "sunshine-type" || step === "sunshine-consent" ? (
        <AgreementScreen
          title={<>햇살론 대출 신청을 위한<br />필수 약관에 동의해 주세요</>}
          groups={sunshineGroups}
          checks={sunshineChecks}
          expanded={expanded}
          onChecksChange={setSunshineChecks}
          onExpandedChange={setExpanded}
          onDetail={setDetailTitle}
          onBack={back}
          onNext={() => go("vehicle-choice")}
          sheet={step === "sunshine-type"}
          agreementType={sunshineType}
          onAgreementTypeChange={setSunshineType}
          onSheetConfirm={() => go("sunshine-consent")}
        />
      ) : null}
      {step === "vehicle-choice" ? (
        <ChoiceScreen
          title="자동차를 가지고 계신가요?"
          description="자동차를 담보로 금리가 낮아질 수 있어요."
          value={vehicleChoice}
          onChange={handleVehicleChoice}
          onBack={back}
          plain
        />
      ) : null}
      {step === "vehicle-number" ? (
        <VehicleNumberScreen
          value={vehicleNumber}
          onChange={setVehicleNumber}
          onBack={back}
          onNext={() => go("auth-method")}
        />
      ) : null}
      {step === "auth-method" ? (
        <AuthMethodScreen onBack={back} onNext={() => go("carrier")} />
      ) : null}
      {step === "carrier" ? (
        <CarrierScreen
          selected={selectedCarrier}
          onBack={back}
          onSelect={setSelectedCarrier}
          onComplete={() => setCompleted(true)}
        />
      ) : null}
      {detailTitle ? (
        <AgreementDetail title={detailTitle} onClose={() => setDetailTitle(null)} />
      ) : null}
      {completed ? <CompletionToast>AS-IS 분기 흐름 체험을 완료했습니다.</CompletionToast> : null}
    </div>
  );
}

function AgreementScreen({
  title,
  groups,
  checks,
  expanded,
  onChecksChange,
  onExpandedChange,
  onDetail,
  onBack,
  onNext,
  sheet,
  agreementType,
  onAgreementTypeChange,
  onSheetConfirm,
}: {
  title: ReactNode;
  groups: AgreementGroup[];
  checks: Record<string, boolean>;
  expanded: Set<string>;
  onChecksChange: (checks: Record<string, boolean>) => void;
  onExpandedChange: (expanded: Set<string>) => void;
  onDetail: (title: string) => void;
  onBack: () => void;
  onNext: () => void;
  sheet: boolean;
  agreementType: AgreementType;
  onAgreementTypeChange: (type: AgreementType) => void;
  onSheetConfirm: () => void;
}) {
  const allChecked = groups.every((group) =>
    group.documents.every((document) => checks[documentId(group.id, document)]),
  );

  function toggleExpanded(id: string) {
    const next = new Set(expanded);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onExpandedChange(next);
  }

  return (
    <ScreenShell onBack={onBack}>
      <div className={styles.agreementScroll}>
        <h2 className={styles.agreementTitle}>{title}</h2>
        <div className={styles.agreementGroups}>
          {groups.map((group) => {
            const checked = group.documents.every(
              (document) => checks[documentId(group.id, document)],
            );
            const isExpanded = expanded.has(group.id);
            return (
              <section className={styles.agreementGroup} key={group.id}>
                <div className={styles.agreementGroupHeading}>
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={checked}
                    className={styles.agreementCheckArea}
                    onClick={() => {
                      const next = { ...checks };
                      group.documents.forEach((document) => {
                        next[documentId(group.id, document)] = !checked;
                      });
                      onChecksChange(next);
                    }}
                  >
                    <CheckMark checked={checked} filled />
                    <strong>{group.title}</strong>
                  </button>
                  <button
                    type="button"
                    className={styles.chevronButton}
                    aria-expanded={isExpanded}
                    aria-label={`${group.title} ${isExpanded ? "닫기" : "열기"}`}
                    onClick={() => toggleExpanded(group.id)}
                  >
                    <svg className={isExpanded ? styles.chevronOpen : ""} viewBox="0 0 16 16"><path d="m4 6 4 4 4-4" /></svg>
                  </button>
                </div>
                <div className={`${styles.agreementDocuments} ${isExpanded ? styles.agreementDocumentsOpen : ""}`}>
                  <div>
                    {group.documents.map((document) => (
                      <div className={styles.agreementDocument} key={document}>
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={Boolean(checks[documentId(group.id, document)])}
                          className={styles.documentCheckArea}
                          onClick={() => {
                            const id = documentId(group.id, document);
                            onChecksChange({ ...checks, [id]: !checks[id] });
                          }}
                        >
                          <CheckMark checked={Boolean(checks[documentId(group.id, document)])} />
                          <span>{document}</span>
                        </button>
                        <button type="button" className={styles.documentDetailButton} aria-label={`${document} 상세보기`} onClick={() => onDetail(document)}>
                          <svg viewBox="0 0 16 16"><path d="m6 3.5 4.5 4.5L6 12.5" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
        <div className={styles.agreementBottomSpace} />
      </div>
      {allChecked && !sheet ? <RoundAction label="다음" onClick={onNext} floating /> : null}
      {sheet ? (
        <AgreementTypeSheet
          selected={agreementType}
          onSelect={onAgreementTypeChange}
          onConfirm={onSheetConfirm}
        />
      ) : null}
    </ScreenShell>
  );
}

function AgreementTypeSheet({
  selected,
  onSelect,
  onConfirm,
}: {
  selected: AgreementType;
  onSelect: (type: AgreementType) => void;
  onConfirm: () => void;
}) {
  return (
    <div className={styles.sheetLayer} role="dialog" aria-modal="true" aria-label="동의서 종류 선택">
      <div className={styles.dimLayer} aria-hidden="true" />
      <section className={styles.bottomSheet}>
        <h3>동의서 종류를 선택해주세요</h3>
        <p>요약동의서는 전체동의서의 핵심내용을<br />알기 쉽게 요약한 동의서입니다</p>
        <button type="button" className={styles.sheetOption} onClick={() => onSelect("summary")}>
          <CheckMark checked={selected === "summary"} filled /><span>요약동의서로 볼게요</span>
        </button>
        <button type="button" className={styles.sheetOption} onClick={() => onSelect("full")}>
          <CheckMark checked={selected === "full"} filled /><span>전체동의서로 볼게요</span>
        </button>
        <button type="button" className={styles.sheetConfirm} onClick={onConfirm}>확인</button>
      </section>
    </div>
  );
}

function ChoiceScreen({
  title,
  description,
  value,
  onChange,
  onBack,
  actionLabel,
  onAction,
  plain = false,
}: {
  title: ReactNode;
  description?: string;
  value: YesNo | null;
  onChange: (value: YesNo) => void;
  onBack: () => void;
  actionLabel?: string;
  onAction?: () => void;
  plain?: boolean;
}) {
  return (
    <ScreenShell onBack={onBack}>
      <main className={styles.choiceContent}>
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
        <div className={styles.choiceList} role="radiogroup" aria-label="선택">
          {(["yes", "no"] as YesNo[]).map((choice) => (
            <button
              type="button"
              role="radio"
              aria-checked={value === choice}
              className={`${plain ? styles.plainChoice : ""} ${
                plain && value === choice ? styles.plainChoiceSelected : ""
              }`}
              key={choice}
              onClick={() => onChange(choice)}
            >
              {plain ? null : <CheckMark checked={value === choice} filled />}
              <strong>{choice === "yes" ? "네" : "아니오"}</strong>
              {choice === "no" && description ? <small>(담보는 원하지 않아요)</small> : null}
              {plain ? <SelectionCheck selected={value === choice} /> : null}
            </button>
          ))}
        </div>
        {value && actionLabel && onAction ? (
          <div className={styles.choiceAction}><RoundAction label={actionLabel} onClick={onAction} /></div>
        ) : null}
      </main>
    </ScreenShell>
  );
}

function VehicleNumberScreen({
  value,
  onChange,
  onBack,
  onNext,
}: {
  value: string;
  onChange: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const composingRef = useRef(false);
  const valid = /^\d{2,3}[가-힣]\d{4}$/.test(value);

  function normalizeVehicleNumber(input: string) {
    return input.replace(/[^0-9ㄱ-ㅎㅏ-ㅣ가-힣]/g, "").slice(0, 8);
  }

  return (
    <ScreenShell onBack={onBack}>
      <main className={styles.vehicleContent}>
        <label htmlFor="as-is-vehicle-number">자동차 번호를 입력해주세요</label>
        <input
          id="as-is-vehicle-number"
          value={value}
          placeholder="33가 3456"
          maxLength={8}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          lang="ko"
          onChange={(event) => {
            const next = composingRef.current
              ? event.target.value.slice(0, 8)
              : normalizeVehicleNumber(event.target.value);
            onChange(next);
          }}
          onCompositionStart={() => {
            composingRef.current = true;
          }}
          onCompositionEnd={(event) => {
            composingRef.current = false;
            onChange(normalizeVehicleNumber(event.currentTarget.value));
          }}
        />
        <p><span>i</span> 자동차 번호를 입력하면 더 좋은 조건을 받으실 수 있어요.</p>
        {valid ? <div className={styles.vehicleAction}><RoundAction label="다음" onClick={onNext} /></div> : null}
      </main>
    </ScreenShell>
  );
}

function AuthMethodScreen({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const [selected, setSelected] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  function select() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSelected(true);
    timerRef.current = setTimeout(() => {
      onNext();
      timerRef.current = null;
    }, 450);
  }

  return (
    <ScreenShell onBack={onBack}>
      <main className={styles.authContent}>
        <h2>자동차를 가지고 계신가요?</h2>
        <button
          type="button"
          role="radio"
          aria-checked={selected}
          className={styles.authOption}
          onClick={select}
        >
          <span>휴대폰 본인인증</span>
          <SelectionCheck selected={selected} />
        </button>
      </main>
    </ScreenShell>
  );
}

function CarrierScreen({
  selected,
  onBack,
  onSelect,
  onComplete,
}: {
  selected: string | null;
  onBack: () => void;
  onSelect: (carrier: string) => void;
  onComplete: () => void;
}) {
  const carriers = ["SKT", "KT", "LG U+", "알뜰폰"];
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  function selectCarrier(carrier: string) {
    if (timerRef.current) clearTimeout(timerRef.current);
    onSelect(carrier);
    timerRef.current = setTimeout(() => {
      onComplete();
      timerRef.current = null;
    }, 1800);
  }

  return (
    <ScreenShell onBack={onBack}>
      <main className={styles.carrierContent}>
        <p>김롯데님, 통신사를 선택해주세요</p>
        <div role="radiogroup" aria-label="통신사 선택">
          {carriers.map((carrier) => (
            <button
              type="button"
              role="radio"
              aria-checked={selected === carrier}
              className={selected === carrier ? styles.carrierSelected : ""}
              key={carrier}
              onClick={() => selectCarrier(carrier)}
            >
              {carrier}
            </button>
          ))}
        </div>
      </main>
    </ScreenShell>
  );
}

function ScreenShell({ children, onBack }: { children: ReactNode; onBack: () => void }) {
  return (
    <div className={styles.appScreen}>
      <MobileStatusBar />
      <nav className={styles.appNav}>
        <button type="button" onClick={onBack} aria-label="이전 화면으로 돌아가기">
          <svg viewBox="0 0 24 24"><path d="m15 4-8 8 8 8" /></svg>
        </button>
      </nav>
      {children}
      <span className={styles.homeIndicator} aria-hidden="true" />
    </div>
  );
}

function CheckMark({ checked, filled = false }: { checked: boolean; filled?: boolean }) {
  return (
    <span className={`${styles.checkMark} ${filled ? styles.checkMarkFilled : ""} ${checked ? styles.checkMarkChecked : ""}`} aria-hidden="true">
      <svg viewBox="0 0 18 18"><path d="m4.5 9.2 2.8 2.8 6.1-6.4" /></svg>
    </span>
  );
}

function SelectionCheck({ selected }: { selected: boolean }) {
  return (
    <svg
      className={`${styles.selectionCheck} ${selected ? styles.selectionCheckVisible : ""}`}
      viewBox="0 0 22 22"
      aria-hidden="true"
    >
      <path d="m5.5 11.2 3.5 3.5 7.5-8" />
    </svg>
  );
}

function RoundAction({
  label,
  onClick,
  floating = false,
}: {
  label: string;
  onClick: () => void;
  floating?: boolean;
}) {
  return (
    <div className={floating ? styles.floatingAction : undefined}>
      <button type="button" className={styles.roundAction} onClick={onClick}>
        <span>{label}</span>
        <i><svg viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6" /></svg></i>
      </button>
    </div>
  );
}

function CompletionToast({ children }: { children: ReactNode }) {
  return <div className={styles.completionToast} role="status">{children}</div>;
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
