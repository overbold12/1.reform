"use client";

import { useEffect, useRef, useState } from "react";
import { allAgreementGroups, loanAgreementGroups } from "./agreement-data";
import { AgreementDetail } from "./agreement-detail";
import {
  AgreementTypeSheet,
  type AgreementType,
} from "./agreement-type-sheet";
import {
  CarrierSelectionScreen,
  type Carrier,
} from "./carrier-selection-screen";
import {
  NameInputScreen,
  PhoneInputScreen,
  ResidentInputScreen,
} from "./identity-input-screens";
import { LpointValidationSheet } from "./lpoint-validation-sheet";
import {
  initialOptionalAgreements,
  optionalAgreementGroups,
  optionalChildId,
} from "./optional-agreement-data";
import { OptionalAgreementScreen } from "./optional-agreement-screen";
import {
  CertificateSelectionSheet,
  PublicDataEntryScreen,
  PublicDataReceiveScreen,
  ScreeningScreen,
} from "./public-data-screens";
import {
  PrototypeFlowGraph,
  prototypeStages,
  type PrototypeStep,
} from "./prototype-flow-graph";
import { RequiredAgreementScreen } from "./required-agreement-screen";
import { VerificationCodeScreen } from "./verification-code-screen";
import styles from "./loan-prototype.module.css";

const initialAgreements = Object.fromEntries(
  allAgreementGroups.map((group) => [group.id, false]),
);

export function LoanAgreementPrototype() {
  const [step, setStep] = useState<PrototypeStep>("agreement-type");
  const [agreementType, setAgreementType] = useState<AgreementType>("summary");
  const [agreements, setAgreements] =
    useState<Record<string, boolean>>(initialAgreements);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [optionalAgreements, setOptionalAgreements] =
    useState<Record<string, boolean>>(initialOptionalAgreements);
  const [showLpointValidation, setShowLpointValidation] = useState(false);
  const [detailTitle, setDetailTitle] = useState<string | null>(null);
  const [selectedCarrier, setSelectedCarrier] = useState<Carrier | null>(null);
  const [customerName, setCustomerName] = useState("김롯데");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [genderDigit, setGenderDigit] = useState("");
  const [privateDigits, setPrivateDigits] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const genderInputRef = useRef<HTMLInputElement>(null);
  const privateInputRef = useRef<HTMLInputElement>(null);
  const carrierTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const publicDataTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (carrierTimerRef.current) clearTimeout(carrierTimerRef.current);
      if (publicDataTimerRef.current) clearTimeout(publicDataTimerRef.current);
    };
  }, []);

  const allLoanAgreementsChecked = loanAgreementGroups.every(
    (group) => agreements[group.id],
  );
  const allRequiredChecked = allAgreementGroups.every(
    (group) => agreements[group.id],
  );
  const allOptionalChecked = optionalAgreementGroups.every(
    (group) => optionalAgreements[group.id],
  );

  function moveToRequiredAgreement() {
    setStep("required-agreement");
    requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: 0 }));
  }

  function moveBackToAgreementType() {
    setDetailTitle(null);
    setStep("agreement-type");
    requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: 0 }));
  }

  function moveToOptionalAgreement() {
    setDetailTitle(null);
    setStep("optional-agreement");
    requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: 0 }));
  }

  function moveBackToRequiredAgreement() {
    setDetailTitle(null);
    setShowLpointValidation(false);
    setStep("required-agreement");
    requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: 0 }));
  }

  function moveBackToOptionalAgreement() {
    if (carrierTimerRef.current) clearTimeout(carrierTimerRef.current);
    carrierTimerRef.current = null;
    setSelectedCarrier(null);
    setStep("optional-agreement");
  }

  function handleCarrierSelect(carrier: Carrier) {
    if (carrierTimerRef.current) clearTimeout(carrierTimerRef.current);
    setSelectedCarrier(carrier);
    carrierTimerRef.current = setTimeout(() => {
      setStep("name-input");
      carrierTimerRef.current = null;
    }, 700);
  }

  function navigateToStep(nextStep: PrototypeStep) {
    if (carrierTimerRef.current) clearTimeout(carrierTimerRef.current);
    if (publicDataTimerRef.current) clearTimeout(publicDataTimerRef.current);
    carrierTimerRef.current = null;
    publicDataTimerRef.current = null;
    setDetailTitle(null);
    setShowLpointValidation(false);
    setStep(nextStep);

    if (nextStep === "public-data-entry") {
      publicDataTimerRef.current = setTimeout(() => {
        setStep("electronic-signature");
        publicDataTimerRef.current = null;
      }, 2200);
    }

    requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: 0 }));
  }

  function toggleAgreement(id: string) {
    setAgreements((current) => ({ ...current, [id]: !current[id] }));
  }

  function toggleLoanAgreements() {
    setAgreements((current) => {
      const next = { ...current };
      loanAgreementGroups.forEach((group) => {
        next[group.id] = !allLoanAgreementsChecked;
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

  function toggleOptionalAgreement(id: string) {
    setOptionalAgreements((current) => {
      const group = optionalAgreementGroups.find((item) => item.id === id);
      if (!group) return current;

      const next = { ...current };
      const nextValue = !current[id];
      next[id] = nextValue;

      if (group.kind === "channels") {
        group.children.forEach((child) => {
          next[optionalChildId(id, child)] = nextValue;
        });
      }

      return next;
    });
  }

  function toggleOptionalChild(id: string, child: string) {
    setOptionalAgreements((current) => {
      const group = optionalAgreementGroups.find((item) => item.id === id);
      if (!group) return current;

      const next = { ...current };
      const childId = optionalChildId(id, child);
      next[childId] = !current[childId];
      next[id] = group.children.every((item) =>
        item === child
          ? next[childId]
          : Boolean(next[optionalChildId(id, item)]),
      );
      return next;
    });
  }

  function toggleAllOptionalAgreements() {
    const nextValue = !allOptionalChecked;
    setOptionalAgreements(
      Object.fromEntries(
        Object.keys(initialOptionalAgreements).map((id) => [id, nextValue]),
      ),
    );
  }

  function handleOptionalNext() {
    const lpointMarketing = optionalAgreementGroups.find(
      (group) => group.id === "lpoint-marketing",
    );
    const hasLpointMarketingSelection =
      Boolean(optionalAgreements["lpoint-marketing"]) ||
      Boolean(
        lpointMarketing?.children.some(
          (child) => optionalAgreements[optionalChildId("lpoint-marketing", child)],
        ),
      );
    const requestedLpointBenefit =
      Boolean(optionalAgreements["lpoint-optional-personal"]) ||
      hasLpointMarketingSelection;
    const hasRequiredLpointAgreements =
      Boolean(optionalAgreements["lotte-members-provide"]) &&
      Boolean(optionalAgreements["lpoint-required-personal"]);

    if (requestedLpointBenefit && !hasRequiredLpointAgreements) {
      setShowLpointValidation(true);
      return;
    }

    setSelectedCarrier(null);
    setStep("carrier-selection");
  }

  function resetPrototype() {
    if (carrierTimerRef.current) clearTimeout(carrierTimerRef.current);
    if (publicDataTimerRef.current) clearTimeout(publicDataTimerRef.current);
    carrierTimerRef.current = null;
    publicDataTimerRef.current = null;
    setStep("agreement-type");
    setAgreementType("summary");
    setAgreements({ ...initialAgreements });
    setOptionalAgreements({ ...initialOptionalAgreements });
    setExpandedGroups(new Set());
    setShowLpointValidation(false);
    setDetailTitle(null);
    setSelectedCarrier(null);
    setCustomerName("김롯데");
    setPhoneNumber("");
    setBirthDate("");
    setGenderDigit("");
    setPrivateDigits("");
    setVerificationCode("");
    requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: 0 }));
  }

  function renderPrototypeScreen() {
    switch (step) {
      case "optional-agreement":
        return (
          <OptionalAgreementScreen
            agreements={optionalAgreements}
            expandedGroups={expandedGroups}
            allOptionalChecked={allOptionalChecked}
            scrollRef={scrollRef}
            onBack={moveBackToRequiredAgreement}
            onNext={handleOptionalNext}
            onToggleAll={toggleAllOptionalAgreements}
            onToggleAgreement={toggleOptionalAgreement}
            onToggleChild={toggleOptionalChild}
            onToggleExpanded={toggleExpanded}
            onDocumentOpen={setDetailTitle}
          />
        );
      case "carrier-selection":
        return (
          <CarrierSelectionScreen
            selectedCarrier={selectedCarrier}
            onBack={moveBackToOptionalAgreement}
            onSelect={handleCarrierSelect}
          />
        );
      case "name-input":
        return (
          <NameInputScreen
            name={customerName}
            onNameChange={setCustomerName}
            onBack={() => setStep("carrier-selection")}
            onNext={() => setStep("phone-input")}
          />
        );
      case "phone-input":
        return (
          <PhoneInputScreen
            phoneNumber={phoneNumber}
            onPhoneNumberChange={setPhoneNumber}
            onBack={() => setStep("name-input")}
            onNext={() => setStep("resident-input")}
          />
        );
      case "resident-input":
        return (
          <ResidentInputScreen
            birthDate={birthDate}
            genderDigit={genderDigit}
            privateDigits={privateDigits}
            genderInputRef={genderInputRef}
            privateInputRef={privateInputRef}
            onBirthDateChange={setBirthDate}
            onGenderDigitChange={setGenderDigit}
            onPrivateDigitsChange={setPrivateDigits}
            onBack={() => setStep("phone-input")}
            onRequestVerification={() => navigateToStep("verification-code")}
          />
        );
      case "verification-code":
        return (
          <VerificationCodeScreen
            code={verificationCode}
            onCodeChange={setVerificationCode}
            onBack={() => setStep("resident-input")}
            onNext={() => navigateToStep("public-data-entry")}
          />
        );
      case "public-data-entry":
        return (
          <PublicDataEntryScreen
            onBack={() => navigateToStep("verification-code")}
          />
        );
      case "electronic-signature":
        return (
          <>
            <PublicDataEntryScreen
              onBack={() => navigateToStep("verification-code")}
            />
            <CertificateSelectionSheet
              onClose={() => navigateToStep("public-data-entry")}
              onSelect={() => navigateToStep("public-data-receive")}
            />
          </>
        );
      case "public-data-receive":
        return (
          <PublicDataReceiveScreen
            onComplete={() => navigateToStep("screening")}
          />
        );
      case "screening":
        return <ScreeningScreen />;
      default:
        return (
          <RequiredAgreementScreen
            agreements={agreements}
            expandedGroups={expandedGroups}
            allLoanAgreementsChecked={allLoanAgreementsChecked}
            allRequiredChecked={allRequiredChecked}
            scrollRef={scrollRef}
            onBack={moveBackToAgreementType}
            onContinue={moveToOptionalAgreement}
            onToggleLoanAll={toggleLoanAgreements}
            onToggleAgreement={toggleAgreement}
            onToggleExpanded={toggleExpanded}
            onDocumentOpen={setDetailTitle}
          />
        );
    }
  }

  const currentStage = prototypeStages.find((stage) => stage.id === step);

  return (
    <section className={`workspace-card ${styles.prototypeWorkspace}`}>
      <div className="workspace-card-header">
        <div>
          <span className="workspace-kicker">INTERACTIVE MOBILE PROTOTYPE</span>
          <h2>대출 신청 · 본인확인</h2>
        </div>
        <div className={styles.workspaceActions}>
          <span className={styles.stepBadge}>
            {currentStage?.number} {currentStage?.label}
          </span>
          <button type="button" className={styles.resetButton} onClick={resetPrototype}>
            다시 시작
          </button>
        </div>
      </div>

      <PrototypeFlowGraph currentStep={step} onNavigate={navigateToStep} />

      <div className={styles.prototypeStage}>
        <div className={styles.phoneFrame}>
          {renderPrototypeScreen()}

          {step === "agreement-type" ? (
            <AgreementTypeSheet
              selectedType={agreementType}
              onSelect={setAgreementType}
              onConfirm={moveToRequiredAgreement}
            />
          ) : null}

          {detailTitle ? (
            <AgreementDetail title={detailTitle} onClose={() => setDetailTitle(null)} />
          ) : null}

          {showLpointValidation ? (
            <LpointValidationSheet onClose={() => setShowLpointValidation(false)} />
          ) : null}
        </div>

        <div className={styles.demoGuide}>
          <span>DEMO GUIDE</span>
          <h3>동의 흐름을 직접 조작해 보세요</h3>
          <ol>
            <li>
              <b>01</b>
              <span>동의서 종류 선택</span>
            </li>
            <li>
              <b>02</b>
              <span>전체 또는 개별 필수동의</span>
            </li>
            <li>
              <b>03</b>
              <span>선택동의 및 L.POINT 조건 확인</span>
            </li>
            <li>
              <b>04</b>
              <span>통신사 선택 및 본인정보 입력</span>
            </li>
            <li>
              <b>08</b>
              <span>인증번호 입력 및 전자서명</span>
            </li>
            <li>
              <b>11</b>
              <span>공공마이데이터 서류 수신</span>
            </li>
            <li>
              <b>12</b>
              <span>최대한도와 금리 심사</span>
            </li>
          </ol>
          <p>이번 구현 범위는 심사중 단계에서 종료되며 결과 화면으로 이동하지 않습니다.</p>
        </div>
      </div>
    </section>
  );
}
